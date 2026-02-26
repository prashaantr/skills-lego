# Sources

Last composed: 2026-02-26

## Included Skills

| Skill | Source | Commit | License |
|-------|--------|--------|---------|
| claude-deep-research-skill | [github.com/199-biotechnologies/claude-deep-research-skill](https://github.com/199-biotechnologies/claude-deep-research-skill) | `a725f9a` | Unknown |
| mermaid-diagrams | [github.com/softaworks/agent-toolkit@mermaid-diagrams](https://github.com/softaworks/agent-toolkit@mermaid-diagrams) | `62b5df5` | Unknown |

## Updating

To update this composite with the latest versions:

```bash
python lego.py --update .
```

Or regenerate manually:

```bash
python lego.py \
    --skills "github.com/199-biotechnologies/claude-deep-research-skill" \
             "github.com/softaworks/agent-toolkit@mermaid-diagrams"
    --output ./updated
```