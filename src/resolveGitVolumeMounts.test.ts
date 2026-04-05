import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { resolveGitVolumeMounts } from "./SandboxFactory.js";

describe("resolveGitVolumeMounts", () => {
  const dirs: string[] = [];

  const makeTempDir = async () => {
    const dir = await mkdtemp(join(tmpdir(), "git-mount-test-"));
    dirs.push(dir);
    return dir;
  };

  afterEach(async () => {
    await Promise.all(dirs.map((d) => rm(d, { recursive: true, force: true })));
    dirs.length = 0;
  });

  it("returns single mount when .git is a directory", async () => {
    const repoDir = await makeTempDir();
    const gitDir = join(repoDir, ".git");
    await mkdir(gitDir);

    const mounts = resolveGitVolumeMounts(gitDir);

    expect(mounts).toEqual([`${gitDir}:${gitDir}`]);
  });

  it("returns both mounts when .git is a worktree file", async () => {
    const parentRepoDir = await makeTempDir();
    const parentGitDir = join(parentRepoDir, ".git");
    await mkdir(parentGitDir);
    await mkdir(join(parentGitDir, "worktrees", "my-worktree"), {
      recursive: true,
    });

    const worktreeDir = await makeTempDir();
    const gitFile = join(worktreeDir, ".git");
    await writeFile(gitFile, `gitdir: ${parentGitDir}/worktrees/my-worktree\n`);

    const mounts = resolveGitVolumeMounts(gitFile);

    expect(mounts).toEqual([
      `${gitFile}:${gitFile}`,
      `${parentGitDir}:${parentGitDir}`,
    ]);
  });

  it("falls back to single mount when .git file has unexpected content", async () => {
    const dir = await makeTempDir();
    const gitFile = join(dir, ".git");
    await writeFile(gitFile, "something unexpected\n");

    const mounts = resolveGitVolumeMounts(gitFile);

    expect(mounts).toEqual([`${gitFile}:${gitFile}`]);
  });
});
