import { constants } from "node:fs";
import { mkdir, open, rm } from "node:fs/promises";
import { join } from "node:path";

export interface LockData {
  pid: number;
  branch: string;
  acquiredAt: string;
}

/**
 * Acquires a lock for a worktree using O_EXCL atomic file creation.
 * Creates the lockDir on first use.
 * Throws if a lock file already exists for the given worktreeName.
 */
export const acquire = async (
  lockDir: string,
  worktreeName: string,
  branch: string,
): Promise<void> => {
  await mkdir(lockDir, { recursive: true });
  const lockPath = join(lockDir, `${worktreeName}.lock`);

  let fd;
  try {
    fd = await open(
      lockPath,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL,
    );
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "EEXIST") {
      throw new Error(
        `Worktree lock already held for '${worktreeName}' (lock file: ${lockPath})`,
      );
    }
    throw err;
  }

  const data: LockData = {
    pid: process.pid,
    branch,
    acquiredAt: new Date().toISOString(),
  };

  try {
    await fd.writeFile(JSON.stringify(data, null, 2));
  } finally {
    await fd.close();
  }
};

/**
 * Releases a lock for a worktree by removing the lock file.
 * Idempotent: does not throw if the lock file does not exist.
 */
export const release = async (
  lockDir: string,
  worktreeName: string,
): Promise<void> => {
  const lockPath = join(lockDir, `${worktreeName}.lock`);
  try {
    await rm(lockPath);
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return;
    }
    throw err;
  }
};
