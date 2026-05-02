import { run, claudeCode } from "@amartya18/sandcastle";
import { docker } from "@amartya18/sandcastle/sandboxes/docker";

// Blank template: customize this to build your own orchestration.
// Run this with: npx tsx .sandcastle/main.mts
// Or add to package.json scripts: "sandcastle": "npx tsx .sandcastle/main.mts"

await run({
  agent: claudeCode("claude-opus-4-6"),
  sandbox: docker(),
  promptFile: "./.sandcastle/prompt.md",
});
