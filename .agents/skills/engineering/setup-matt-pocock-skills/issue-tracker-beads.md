# Issue tracker: Beads

Issues and PRDs for this repo live in Beads. Use the `bd` CLI for all operations.

For repos that also use Sandcastle, treat `ready-for-agent` as the AFK handoff label and query work with `bd ready --label ready-for-agent --json`.

## Conventions

- **Create an issue**: `bd create "Title" -t feature|bug|task|epic|chore|decision -p 0-4 -d "..." --json`. Use a body file or stdin for long descriptions if needed.
- **Read an issue**: `bd show <id> --json`.
- **List issues**: for the Sandcastle handoff queue, use `bd ready --label ready-for-agent --json`. For broader tracker queries, use `bd list --json` or filtered queries such as `bd list --label needs-triage --json`.
- **Comment / notes**: if the workflow needs durable triage notes beyond the description, append them with `bd note <id> "..."` or `bd update <id> --append-notes "..." --json`.
- **Apply / remove labels**: `bd label add <id> <label> --json` / `bd label remove <id> <label> --json`.
- **Update type / status**: `bd update <id> --type bug|feature|task|epic|chore --status open|in_progress|blocked|deferred|closed --json`.
- **Close**: `bd close <id> --reason "..." --json`.

### Triage mapping in Beads

- The canonical category role `bug` maps to Beads issue type `bug`.
- The canonical category role `enhancement` maps to Beads issue type `feature`.
- The five canonical triage state roles usually map to labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
- Beads `status` remains the execution lifecycle (`open`, `in_progress`, `blocked`, `deferred`, `closed`) and should not be used as a replacement for the canonical triage state roles.

## When a skill says "publish to the issue tracker"

Create a Beads issue with `bd create`, using the tracker-native type/label mapping described above.

## When a skill says "fetch the relevant ticket"

Run `bd show <id> --json`.

## Sandcastle handoff

When this repo uses Sandcastle, keep the Beads integration minimal:

- **Queue work for AFK agents**: apply the `ready-for-agent` label.
- **List ready work**: `bd ready --label ready-for-agent --json`.
- **Read a work item**: `bd show <id>`.
- **Close a completed work item**: `bd close <id> --reason "Completed by Sandcastle"`.

Do not rely on Beads comments, notes, or custom state dimensions for the Sandcastle handoff unless the repo has explicitly chosen that convention.
