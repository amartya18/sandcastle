---
"@ai-hero/sandcastle": patch
---

Add `workspace.interactive()` method to the `Workspace` handle. Runs an interactive agent session directly in the workspace's worktree. Defaults to `noSandbox()` when no sandbox provider is specified. The workspace persists after the interactive session completes.
