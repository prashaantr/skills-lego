---
name: skills-lego
description: "Combine multiple Claude Code skills into composite skills with orchestration workflows. Use when user wants to merge skills, create skill bundles, combine multiple skills into one, or build a workflow that coordinates between different skills."
---

# Skills Lego

Create composite skills by combining multiple Claude Code skills with orchestration logic.

## When to Use

Trigger this skill when the user wants to:
- Combine 2+ skills into one
- Create a workflow that uses multiple skills together
- Bundle related skills with coordination logic
- Merge skills from GitHub into a single composite

## Quick Reference

**Script location**: `lego.py` (in repo root)

**Basic command**:
```bash
python lego.py \
    --name "composite-name" \
    --skills "github.com/user/skill-a" "github.com/user/skill-b" \
    --workflow "Orchestration instructions..." \
    --output ./output-folder
```

## Workflow: From User Request to Composite Skill

### Step 1: Identify Skills to Combine

Ask the user or identify from their request:
- Which skills to combine (need GitHub URLs)
- Find skills at https://skills.sh or ask for URLs

**URL formats:**
| Format | When to Use |
|--------|-------------|
| `github.com/user/repo` | Skill is the whole repo |
| `github.com/user/repo@skill-name` | Skill is in `skills/skill-name/` subdirectory |

### Step 2: Design the Workflow

The `--workflow` argument is the orchestration logic - it tells Claude HOW the skills work together. This is the key differentiator.

**Write the workflow as step-by-step instructions:**

```
--workflow "When [doing the task]:
1. First, use [skill-a] to [action]
2. For each [item], use [skill-b] to [action]
3. Finally, use [skill-c] to [compile/export/finish]

IMPORTANT: [Any critical sequencing or coordination notes]"
```

**Example workflows:**

For a video study guide:
```
"When creating a study guide from a video:
1. Extract transcript using youtube-clipper
2. For EACH major concept, create a mermaid diagram
3. Compile final PDF with table of contents and timestamps
IMPORTANT: Create diagrams as you identify concepts, not all at the end."
```

For a research reporter:
```
"When researching a topic:
1. Use deep-research to gather information
2. Create mermaid diagrams to visualize key relationships
3. Export as PDF with executive summary
IMPORTANT: Cite sources inline as you research."
```

### Step 3: Run lego.py

```bash
python lego.py \
    --name "my-composite" \
    --skills \
        "github.com/user/skill-a" \
        "github.com/user/skill-b" \
    --workflow "Your orchestration instructions..." \
    --output ./my-composite
```

### Step 4: Install the Composite

After lego.py completes, install the composite skill:

```bash
ln -s $(pwd)/my-composite ~/.claude/skills/my-composite
```

### Step 5: Verify and Test

The output folder contains:
```
my-composite/
├── SKILL.md         # Main skill with workflow (Claude reads this)
├── SOURCES.md       # Attribution and update commands
├── references/      # Individual skill instructions
│   ├── skill-a.md
│   └── skill-b.md
└── scripts/         # Combined scripts from all skills
```

Tell the user:
- Composite created at `./my-composite`
- Installed to `~/.claude/skills/my-composite`
- They can now use it by mentioning the skill's purpose

## Example Interaction

**User says**: "I want to combine the youtube clipper skill with mermaid diagrams and pdf export to create study guides from videos"

**Agent does**:
1. Identifies skills needed: youtube-clipper, mermaid-diagrams, pdf
2. Looks up GitHub URLs (or asks user)
3. Designs workflow for study guide creation
4. Runs:
```bash
python lego.py \
    --name "video-study-guide" \
    --skills \
        "github.com/op7418/youtube-clipper-skill" \
        "github.com/softaworks/agent-toolkit@mermaid-diagrams" \
        "github.com/anthropics/skills@pdf" \
    --workflow "When creating a study guide from a video:
1. Extract video transcript using youtube-clipper
2. Identify key concepts and timestamps
3. For EACH concept, create a mermaid diagram (flowchart, sequence, or mindmap)
4. Compile final PDF with table of contents, diagrams, and timestamps
IMPORTANT: Create diagrams incrementally as you identify concepts." \
    --output ./video-study-guide
```
5. Installs: `ln -s $(pwd)/video-study-guide ~/.claude/skills/video-study-guide`
6. Tells user: "Created and installed video-study-guide skill. You can now ask me to create study guides from YouTube videos."

## Other Commands

**Update existing composite** (re-fetch latest from sources):
```bash
python lego.py --update ./my-composite
```

**Package for sharing**:
```bash
python lego.py --package ./my-composite --output my-composite.zip
```
