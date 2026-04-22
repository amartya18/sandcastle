---
"@ai-hero/sandcastle": patch
---

Add `signal?: AbortSignal` to `WorktreeRunOptions` and `WorktreeInteractiveOptions` for cancelling operations on the Worktree handle. Aborting mid-operation kills the in-flight agent subprocess; the worktree is preserved on disk and the handle remains usable for subsequent calls.
