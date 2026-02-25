# How Skills Lego Works

## The Problem

You have multiple Claude Code skills that work well together:
- A PDF skill for reading documents
- An XLSX skill for spreadsheets
- A chart generation skill

But there's no way to:
1. Install them as a single unit
2. Define how they should work together
3. Share the combination with others

## The Solution

Skills Lego creates **composite skills** - regular skills that bundle other skills together with orchestration logic.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SOURCE REPOS                          │
│  github.com/user/pdf-skill    github.com/user/xlsx-skill │
└──────────────┬────────────────────────┬─────────────────┘
               │                        │
               ▼                        ▼
┌─────────────────────────────────────────────────────────┐
│                      lego.py                             │
│                                                          │
│  1. Clone repos                                          │
│  2. Extract SKILL.md → instructions.md                   │
│  3. Preserve folder structure                            │
│  4. Rewrite relative paths                               │
│  5. Generate orchestrating SKILL.md                      │
│  6. Create SOURCES.md for attribution                    │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  COMPOSITE SKILL                         │
│                                                          │
│  my-composite/                                           │
│  ├── SKILL.md          ← Orchestration + triggers        │
│  ├── SOURCES.md        ← Attribution + commit hashes     │
│  └── skills/                                             │
│      ├── pdf-skill/                                      │
│      │   ├── instructions.md  ← Extracted from SKILL.md  │
│      │   ├── references/      ← Preserved                │
│      │   └── scripts/         ← Preserved                │
│      └── xlsx-skill/                                     │
│          ├── instructions.md                             │
│          ├── references/                                 │
│          └── scripts/                                    │
└─────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. Path Rewriting

Original skill references:
```markdown
Read `references/format-spec.md`
Run `scripts/process.py`
```

After composition:
```markdown
Read `skills/pdf-skill/references/format-spec.md`
Run `skills/pdf-skill/scripts/process.py`
```

This ensures all references work from the composite's root.

### 2. Orchestration Logic

The `--workflow` parameter defines how skills coordinate:

```bash
--workflow "When processing documents:
1. Detect file type
2. If PDF, read skills/pdf-skill/instructions.md
3. If XLSX, read skills/xlsx-skill/instructions.md
4. Process accordingly"
```

This becomes the "Workflow" section in the generated SKILL.md.

### 3. Trigger Aggregation

Triggers from all source skills are combined:

```yaml
# pdf-skill triggers
- "pdf"
- "read pdf"

# xlsx-skill triggers
- "excel"
- "spreadsheet"

# Composite gets all of them
triggers:
  - "pdf"
  - "read pdf"
  - "excel"
  - "spreadsheet"
```

### 4. Attribution

SOURCES.md tracks:
- Original repo URLs
- Commit hashes at composition time
- Licenses

This enables:
- Proper credit to original authors
- Ability to update to newer versions
- License compliance

## The Workflow Pattern

The key insight is that orchestration logic must be explicit. Without it, a composite is just "3 skills in a folder." With it, Claude knows:

- **What** each skill does
- **When** to use each skill
- **How** they hand off to each other
- **In what order** operations should happen

Example orchestration:

```markdown
## Workflow

When creating IKEA-style assembly instructions:

1. Read `skills/assembly-instructions/instructions.md` for format
2. For EACH step:
   a. Write the step text
   b. Read `skills/nano-banana/instructions.md`
   c. Generate an image for this step
   d. Continue to next step

IMPORTANT: Image generation must happen per-step, not all at the end.
```

## Updating Composites

Since composites are frozen snapshots, updates are explicit:

```bash
# Check what would update
python lego.py --update ./my-composite --dry-run

# Actually update
python lego.py --update ./my-composite
```

This re-fetches from the URLs in SOURCES.md and rebuilds, preserving your custom orchestration logic.

## Comparison to Alternatives

| Approach | Pros | Cons |
|----------|------|------|
| Install separately | Simple, always current | No orchestration, manual coordination |
| Symlinks (dev) | Live updates, easy to modify | Not distributable |
| **Skills Lego** | Single install, orchestrated, distributable | Frozen snapshot |
| Package manager | Version constraints, auto-updates | Complex infrastructure |

Skills Lego hits the sweet spot: simple enough to use today, powerful enough for real workflows.
