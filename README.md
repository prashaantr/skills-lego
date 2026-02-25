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
          │  compose.py     │
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
python compose.py \
    --name "document-suite" \
    --skills "github.com/user/pdf-skill" "github.com/user/xlsx-skill" \
    --workflow "Use PDF skill for reading documents, XLSX for spreadsheets" \
    --output ./my-composite

# Install it
ln -s $(pwd)/my-composite ~/.claude/skills/document-suite
```

## Real Example: IKEA-Style Manual Generator

Combines [assembly-instructions](https://github.com/user/assembly-instructions) with [nano-banana](https://github.com/user/nano-banana) (AI image generation):

```bash
python compose.py \
    --name "ikea-generator" \
    --skills \
        "github.com/user/assembly-instructions" \
        "github.com/user/nano-banana" \
    --workflow "When creating assembly instructions:
1. Read skills/assembly-instructions/instructions.md for format
2. For EACH step:
   a. Write the step text
   b. Read skills/nano-banana/instructions.md
   c. Generate an image for this step
   d. Continue to next step
3. Compile final document with text + images interleaved

IMPORTANT: Do not generate all text first. Image generation must happen per-step." \
    --output ./ikea-generator
```

The orchestration logic (`--workflow`) is the secret sauce. Without it, you just have 2 unrelated skills. With it, Claude knows to generate text → image → text → image in sequence.

## Output Structure

```
my-composite/
├── SKILL.md              # Main orchestrator with workflow
├── SOURCES.md            # Attribution + update info
└── skills/
    ├── pdf-skill/
    │   ├── instructions.md    # Extracted from original SKILL.md
    │   ├── references/        # Original references
    │   └── scripts/           # Original scripts
    └── xlsx-skill/
        ├── instructions.md
        ├── references/
        └── scripts/
```

## Commands

### Create Composite

```bash
python compose.py \
    --name "my-workflow" \
    --skills "github.com/..." "github.com/..." \
    --workflow "How skills work together..." \
    --description "Optional description" \
    --output ./my-composite
```

### Update from Sources

Re-fetch latest versions from source repos:

```bash
python compose.py --update ./my-composite
```

### Package for Distribution

```bash
python compose.py --package ./my-composite --output my-composite.zip
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

| Skill | Source | Commit | License |
|-------|--------|--------|---------|
| assembly | github.com/user/assembly-instructions | a1b2c3d | MIT |
| nano-banana | github.com/user/nano-banana | e4f5g6h | Apache-2.0 |
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
python compose.py --update ./my-composite
```

This reads `SOURCES.md`, fetches the latest code from each repo, and rebuilds the composite while **preserving your custom orchestration logic** in SKILL.md.

### Option 2: Regenerate from Scratch

If you want to change the workflow or add/remove skills:

```bash
python compose.py \
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
                     │  python compose.py --update .
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
| Document Suite | pdf + xlsx + charts | Route by file type |
| IKEA Generator | assembly + nano-banana | Interleaved text/image generation |
| Research Assistant | paper-review + web-search | Search → analyze → summarize |
| Data Pipeline | csv-parser + validator + transformer | Sequential processing |

## License

MIT

---

**Note**: This tool follows the [Claude Code Skills spec](https://docs.anthropic.com/en/docs/claude-code/skills). Composite skills are just regular skills that reference other skills' instructions.
