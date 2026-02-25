# Skills Lego

Combine multiple [Claude Code](https://claude.ai/code) skills into one composite skill with orchestration logic.

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  PDF Skill  │   │ XLSX Skill  │   │ Chart Skill │
└──────┬──────┘   └──────┬──────┘   └──────┬──────┘
       │                 │                 │
       └────────────┬────┴────────────────┘
                    │
                    ▼
          ┌─────────────────┐
          │    lego.py      │
          └────────┬────────┘
                   │
                   ▼
          ┌─────────────────┐
          │ Document Suite  │  ← One composite skill
          │ (with workflow) │
          └─────────────────┘
```

## Why?

You have 3 skills that work great together. Instead of installing them separately, combine them into **one skill** with orchestration logic that defines *how* they work together.

**Without Skills Lego:**
- Install skill A
- Install skill B
- Install skill C
- Manually coordinate between them

**With Skills Lego:**
- Install one composite skill
- Orchestration logic handles coordination
- "Generate each step, then create an image, repeat"

## Quick Start

```bash
# Clone
git clone https://github.com/prashaantr/skills-lego
cd skills-lego

# Create a composite skill
python lego.py \
    --name "document-suite" \
    --skills "github.com/user/pdf-skill" "github.com/user/xlsx-skill" \
    --workflow "Use PDF skill for reading documents, XLSX for spreadsheets" \
    --output ./my-composite

# Install it
ln -s $(pwd)/my-composite ~/.claude/skills/document-suite
```

## Real Example: Video Study Guide

Combines three popular skills from [skills.sh](https://skills.sh):

| Skill | Installs | Purpose |
|-------|----------|---------|
| [youtube-clipper](https://github.com/op7418/youtube-clipper-skill) | 1.4K | Extract video content |
| [mermaid-diagrams](https://github.com/softaworks/agent-toolkit) | 2.8K | Create visual diagrams |
| [pdf](https://github.com/anthropics/skills) | 21.6K | Export as PDF |

```bash
python lego.py \
    --name "video-study-guide" \
    --skills \
        "github.com/op7418/youtube-clipper-skill" \
        "github.com/softaworks/agent-toolkit" \
        "github.com/anthropics/skills" \
    --workflow "When creating a study guide from a YouTube video:
1. Extract video transcript and identify key concepts
2. For EACH major concept:
   a. Create a mermaid diagram (flowchart, sequence, or mindmap)
   b. Add to the study guide with context
3. Compile final PDF with table of contents, diagrams, and timestamps

IMPORTANT: Create diagrams as you identify concepts, not all at the end." \
    --output ./video-study-guide
```

The orchestration logic (`--workflow`) is the secret sauce. Without it, you just have 3 unrelated skills. With it, Claude knows to extract → diagram → export in sequence, creating diagrams per-concept.

## Output Structure

```
video-study-guide/
├── SKILL.md              # Main orchestrator with workflow
├── SOURCES.md            # Attribution + update info
└── skills/
    ├── youtube-clipper/
    │   ├── instructions.md    # Extracted from original SKILL.md
    │   ├── references/        # Original references
    │   └── scripts/           # Original scripts
    ├── mermaid-diagrams/
    │   ├── instructions.md
    │   └── references/
    └── pdf/
        ├── instructions.md
        └── scripts/
```

## Commands

### Create Composite

```bash
python lego.py \
    --name "my-workflow" \
    --skills "github.com/..." "github.com/..." \
    --workflow "How skills work together..." \
    --description "Optional description" \
    --output ./my-composite
```

### Update from Sources

Re-fetch latest versions from source repos:

```bash
python lego.py --update ./my-composite
```

### Package for Distribution

```bash
python lego.py --package ./my-composite --output my-composite.zip
```

## How It Works

1. **Fetch** - Clones each skill from GitHub
2. **Extract** - Pulls SKILL.md body (strips frontmatter) → `instructions.md`
3. **Preserve** - Keeps references/, scripts/, assets/ intact
4. **Rewrite** - Updates paths so references still work (`references/foo.md` → `skills/name/references/foo.md`)
5. **Generate** - Creates main SKILL.md with combined triggers and workflow
6. **Attribute** - Creates SOURCES.md with commit hashes and licenses

## Attribution

Skills Lego automatically tracks where each skill came from. Every composite includes a `SOURCES.md` file:

```markdown
# Sources

Last composed: 2025-02-25

| Skill | Source | Installs | License |
|-------|--------|----------|---------|
| youtube-clipper | github.com/op7418/youtube-clipper-skill | 1.4K | MIT |
| mermaid-diagrams | github.com/softaworks/agent-toolkit | 2.8K | MIT |
| pdf | github.com/anthropics/skills | 21.6K | MIT |
```

This provides:

- **Credit** - Original authors are always attributed
- **Traceability** - Exact commit hash shows which version was used
- **License compliance** - Licenses are detected and recorded (MIT, Apache-2.0, GPL, BSD)
- **Reproducibility** - Anyone can see exactly what went into the composite

When you share a composite skill, recipients can see who created the original components and find the source repos.

## Updating Skills

Composite skills are **frozen snapshots** - they don't auto-update when source skills change. This is intentional: it prevents breaking changes from affecting your workflow.

When you want the latest versions, you have two options:

### Option 1: Update Command

Re-fetch all skills from their original repos:

```bash
python lego.py --update ./my-composite
```

This reads `SOURCES.md`, fetches the latest code from each repo, and rebuilds the composite while **preserving your custom orchestration logic** in SKILL.md.

### Option 2: Regenerate from Scratch

If you want to change the workflow or add/remove skills:

```bash
python lego.py \
    --name "my-composite" \
    --skills "github.com/user/skill-a" "github.com/user/skill-b" \
    --workflow "Updated workflow description..." \
    --output ./my-composite
```

### When to Update

- **Bug fixes** - A source skill fixed a bug you're hitting
- **New features** - A source skill added functionality you need
- **Security patches** - A source skill patched a vulnerability

### Update Flow

```
┌─────────────────────────────────────────┐
│          Your Composite Skill           │
│  (frozen at commit abc123, def456)      │
└────────────────────┬────────────────────┘
                     │
                     │  python lego.py --update .
                     ▼
┌─────────────────────────────────────────┐
│         Reads SOURCES.md                │
│   - skill-a: github.com/user/skill-a    │
│   - skill-b: github.com/user/skill-b    │
└────────────────────┬────────────────────┘
                     │
                     │  Fetches latest from each repo
                     ▼
┌─────────────────────────────────────────┐
│        Updated Composite Skill          │
│  (now at commit xyz789, uvw012)         │
│  SOURCES.md updated with new hashes     │
│  Your workflow in SKILL.md preserved    │
└─────────────────────────────────────────┘
```

## Requirements

- Python 3.10+
- Git (for cloning repos)

No external dependencies - uses only Python stdlib.

## Use Cases

| Composite | Skills | Workflow |
|-----------|--------|----------|
| **Video Study Guide** | youtube-clipper + mermaid + pdf | Extract → diagram → export |
| Research Reporter | deep-research + mermaid + pdf | Research → visualize → export |
| Content Pipeline | youtube-transcript + transcript-fixer + pdf | Transcribe → fix → format |
| Code Documenter | github-ops + mermaid + pptx | Analyze → diagram → present |

## License

MIT

---

**Note**: This tool follows the [Claude Code Skills spec](https://docs.anthropic.com/en/docs/claude-code/skills). Composite skills are just regular skills that reference other skills' instructions.
