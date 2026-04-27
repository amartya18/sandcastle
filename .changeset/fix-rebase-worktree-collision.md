---
"@ai-hero/sandcastle": patch
---

Fix `createWorktree` failing with "already exists" when reusing a preserved mid-rebase worktree. Collision detection now also matches by target path, covering the detached-HEAD state during an in-progress rebase.
