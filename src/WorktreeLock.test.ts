import { existsSync } from "node:fs";
import { mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { acquire, release, type LockData } from "./WorktreeLock.js";

const makeTmpDir = async (): Promise<string> => {
  const dir = join(
    tmpdir(),
    `lock-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  await mkdir(dir, { recursive: true });
  return dir;
};

describe("WorktreeLock", () => {
  it("acquire creates a lock file with correct JSON content", async () => {
    const lockDir = await makeTmpDir();
    try {
      await acquire(lockDir, "test-worktree", "my-branch");

      const lockPath = join(lockDir, "test-worktree.lock");
      expect(existsSync(lockPath)).toBe(true);

      const data: LockData = JSON.parse(await readFile(lockPath, "utf-8"));
      expect(data.pid).toBe(process.pid);
      expect(data.branch).toBe("my-branch");
      expect(data.acquiredAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    } finally {
      await rm(lockDir, { recursive: true, force: true });
    }
  });

  it("release removes the lock file", async () => {
    const lockDir = await makeTmpDir();
    try {
      await acquire(lockDir, "test-worktree", "my-branch");
      await release(lockDir, "test-worktree");

      const lockPath = join(lockDir, "test-worktree.lock");
      expect(existsSync(lockPath)).toBe(false);
    } finally {
      await rm(lockDir, { recursive: true, force: true });
    }
  });

  it("release is idempotent when lock file does not exist", async () => {
    const lockDir = await makeTmpDir();
    try {
      await expect(
        release(lockDir, "no-such-worktree"),
      ).resolves.toBeUndefined();
    } finally {
      await rm(lockDir, { recursive: true, force: true });
    }
  });

  it("acquire fails if lock file already exists", async () => {
    const lockDir = await makeTmpDir();
    try {
      await acquire(lockDir, "test-worktree", "my-branch");
      await expect(
        acquire(lockDir, "test-worktree", "my-branch"),
      ).rejects.toThrow("Worktree lock already held for 'test-worktree'");
    } finally {
      await rm(lockDir, { recursive: true, force: true });
    }
  });

  it("acquire creates the lockDir if it does not exist", async () => {
    const baseDir = await makeTmpDir();
    const lockDir = join(baseDir, "locks");
    try {
      await acquire(lockDir, "test-worktree", "my-branch");

      const lockPath = join(lockDir, "test-worktree.lock");
      expect(existsSync(lockPath)).toBe(true);
    } finally {
      await rm(baseDir, { recursive: true, force: true });
    }
  });
});
