# Sources

Last composed: 2025-02-25

## Included Skills

| Skill | Source | Installs | Commit | License |
|-------|--------|----------|--------|---------|
| youtube-clipper-skill | [op7418/youtube-clipper-skill](https://github.com/op7418/youtube-clipper-skill) | 1.4K | `f31f077` | MIT |
| mermaid-diagrams | [softaworks/agent-toolkit@mermaid-diagrams](https://github.com/softaworks/agent-toolkit) | 2.8K | `62b5df5` | MIT |
| pdf | [anthropics/skills@pdf](https://github.com/anthropics/skills) | 21.6K | `3d59511` | MIT |

## Install Original Skills

```bash
npx skills add op7418/youtube-clipper-skill@youtube-clipper
npx skills add softaworks/agent-toolkit@mermaid-diagrams
npx skills add anthropics/skills@pdf
```

## Updating

To update this composite with the latest versions:

```bash
python lego.py --update .
```

Or regenerate manually:

```bash
python lego.py \
    --name "video-study-guide" \
    --skills \
        "github.com/op7418/youtube-clipper-skill" \
        "github.com/softaworks/agent-toolkit@mermaid-diagrams" \
        "github.com/anthropics/skills@pdf" \
    --workflow "Extract video content, create diagrams for key concepts, export as PDF study guide" \
    --output ./video-study-guide
```

## Why This Composite?

Installing these 3 skills separately works, but this composite adds:

1. **Orchestration** - Defines the exact sequence: extract → diagram → export
2. **Per-concept diagrams** - Creates visuals as concepts are identified, not batched at the end
3. **Structured output** - Ensures consistent study guide format with TOC, timestamps, and summaries
