---
"@ai-hero/sandcastle": patch
---

Add pluggable sandbox provider abstraction with bind-mount and isolated provider types, `createBindMountSandboxProvider` and `createIsolatedSandboxProvider` factories, and `docker()` factory function. `run()` and `createSandbox()` now accept an optional `sandbox` option, defaulting to Docker internally.
