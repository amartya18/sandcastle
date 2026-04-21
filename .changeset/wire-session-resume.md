---
"@ai-hero/sandcastle": patch
---

Add `resumeSession` option to `run()` for continuing prior Claude Code conversations in new sandbox runs. Validates session file exists and is incompatible with `maxIterations > 1`. Transfers session JSONL from host to sandbox with cwd rewriting before iteration 1.
