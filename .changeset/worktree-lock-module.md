---
"@ai-hero/sandcastle": patch
---

Add WorktreeLock module with atomic O_EXCL lock acquisition and idempotent release. Wire into createWorktree() and Worktree.close() to track live worktrees in .sandcastle/locks/.
