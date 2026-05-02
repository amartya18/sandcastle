# Triage Role Mapping

The skills speak in terms of canonical category roles and canonical triage state roles. This file maps those roles to the actual representation used in this repo's issue tracker.

| Canonical role in mattpocock/skills | Representation in our tracker | Meaning                                  |
| ----------------------------------- | ----------------------------- | ---------------------------------------- |
| `bug`                               | `bug`                         | Broken behavior                          |
| `enhancement`                       | `enhancement`                 | New feature or improvement               |
| `needs-triage`                      | `needs-triage`                | Maintainer needs to evaluate this issue  |
| `needs-info`                        | `needs-info`                  | Waiting on reporter for more information |
| `ready-for-agent`                   | `ready-for-agent`             | Fully specified, ready for an AFK agent  |
| `ready-for-human`                   | `ready-for-human`             | Requires human implementation            |
| `wontfix`                           | `wontfix`                     | Will not be actioned                     |

For label-based trackers, the right-hand column is usually a label string. For Beads, category roles may map to issue types (for example `enhancement -> feature`) while the state roles still map to labels.

Edit the right-hand column to match whatever tracker-native vocabulary you actually use.
