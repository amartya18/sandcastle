---
"@ai-hero/sandcastle": patch
---

Fix Beads Dockerfile libicu symlink to use dynamic multiarch path

Replace hardcoded `/usr/lib/x86_64-linux-gnu/` with `dpkg-architecture -qDEB_HOST_MULTIARCH` so the symlink loop works on both amd64 and arm64 hosts.
