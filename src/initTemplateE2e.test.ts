/**
 * E2E tests for init templates — scaffolds the template, dynamically imports
 * the generated main.mts with @ai-hero/sandcastle aliased (via vitest.config.ts)
 * to the internal testSupport module, and asserts the recorded agent invocations.
 *
 * No Docker, no real agent, no network.
 */
import { NodeFileSystem } from "@effect/platform-node";
import { exec } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { Effect } from "effect";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  scaffold,
  getAgent,
  getBacklogManager,
} from "./InitService.js";
import {
  clearRecordedInvocations,
  getRecordedInvocations,
} from "./testSupport.js";

const execAsync = promisify(exec);

describe("init-template e2e", () => {
  let scaffoldDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    scaffoldDir = await mkdtemp(join(tmpdir(), "init-template-e2e-"));

    // Create a git repo in the scaffold dir so that branch resolution works
    await execAsync("git init -b main", { cwd: scaffoldDir });
    await execAsync('git config user.email "test@sandcastle.local"', {
      cwd: scaffoldDir,
    });
    await execAsync('git config user.name "Sandcastle Test"', {
      cwd: scaffoldDir,
    });
    // Need at least one commit for git branch operations
    await execAsync("git commit --allow-empty -m 'initial commit'", {
      cwd: scaffoldDir,
    });

    clearRecordedInvocations();
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    try {
      await rm(scaffoldDir, { recursive: true, force: true });
    } catch {}
  });

  describe("blank template", () => {
    it("scaffolds and executes with claudeCode agent, github-issues backlog manager", async () => {
      const agent = getAgent("claude-code")!;
      const backlogManager = getBacklogManager("github-issues")!;

      // Scaffold the blank template
      const result = await Effect.runPromise(
        scaffold(scaffoldDir, {
          agent,
          model: "claude-opus-4-6",
          templateName: "blank",
          createLabel: true,
          backlogManager,
        }).pipe(Effect.provide(NodeFileSystem.layer)),
      );

      // Verify the main file was created
      const mainFilePath = join(
        scaffoldDir,
        ".sandcastle",
        result.mainFilename,
      );
      const mainContent = await readFile(mainFilePath, "utf-8");
      expect(mainContent).toContain("run");
      expect(mainContent).toContain("claudeCode");

      // Read the expected prompt content
      const promptPath = join(scaffoldDir, ".sandcastle", "prompt.md");
      const expectedPrompt = await readFile(promptPath, "utf-8");

      // chdir to the scaffold dir so relative prompt file paths resolve
      process.chdir(scaffoldDir);

      // Dynamically import the scaffolded main file.
      // The vitest alias rewrites @ai-hero/sandcastle → testSupport.ts
      // which exports runForTest as run, so the template runs unchanged.
      await import(mainFilePath);

      // Assert the recorded invocation
      const invocations = getRecordedInvocations();
      expect(invocations).toHaveLength(1);

      const invocation = invocations[0]!;
      expect(invocation.agentProvider).toBe("claude-code");
      expect(invocation.model).toBe("claude-opus-4-6");
      expect(invocation.prompt).toBe(expectedPrompt);
      expect(invocation.branchStrategy).toEqual({ type: "head" });
      expect(invocation.maxIterations).toBe(1);
      expect(invocation.iterationIndex).toBe(1);
    });
  });
});
