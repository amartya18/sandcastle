---
"@ai-hero/sandcastle": patch
---

Isolated sandbox providers now create worktrees, matching the bind-mount lifecycle. This enables proper branch strategy support (merge-to-head and named branches) and failure-mode worktree preservation for isolated providers.
