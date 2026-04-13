---
"@ai-hero/sandcastle": patch
---

Add OpenCode as a built-in agent provider. The `opencode()` factory returns an `AgentProvider` that invokes `opencode run` with raw stdout passthrough (no JSON stream parsing). Includes CLI registry entry, init scaffold with Dockerfile template, and documentation.
