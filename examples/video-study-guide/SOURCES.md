# Sources

Last composed: 2026-02-25

## Included Skills

| Skill | Source | Commit | License |
|-------|--------|--------|---------|
| youtube-clipper-skill | [github.com/op7418/youtube-clipper-skill](https://github.com/op7418/youtube-clipper-skill) | `f31f077` | MIT |
| mermaid-diagrams | [github.com/softaworks/agent-toolkit@mermaid-diagrams](https://github.com/softaworks/agent-toolkit@mermaid-diagrams) | `62b5df5` | Unknown |
| pdf | [github.com/anthropics/skills@pdf](https://github.com/anthropics/skills@pdf) | `3d59511` | Unknown |

## Updating

To update this composite with the latest versions:

```bash
python lego.py --update .
```

Or regenerate manually:

```bash
python lego.py \
    --skills "github.com/op7418/youtube-clipper-skill" \
             "github.com/softaworks/agent-toolkit@mermaid-diagrams" \
             "github.com/anthropics/skills@pdf"
    --output ./updated
```