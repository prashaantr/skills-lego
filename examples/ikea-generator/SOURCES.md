# Sources

Last composed: 2025-02-25

## Included Skills

| Skill | Source | Commit | License |
|-------|--------|--------|---------|
| assembly-instructions | [github.com/prashaantranganathan/assembly-instructions](https://github.com/prashaantranganathan/assembly-instructions) | `abc123d` | MIT |
| nano-banana | [github.com/prashaantranganathan/nano-banana](https://github.com/prashaantranganathan/nano-banana) | `def456e` | MIT |

## Updating

To update this composite with the latest versions:

```bash
python compose.py --update .
```

Or regenerate manually:

```bash
python compose.py \
    --name "ikea-generator" \
    --skills \
        "github.com/prashaantranganathan/assembly-instructions" \
        "github.com/prashaantranganathan/nano-banana" \
    --workflow "When creating IKEA-style assembly instructions..." \
    --output ./ikea-generator
```
