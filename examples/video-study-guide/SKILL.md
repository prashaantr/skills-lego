---
name: "video-study-guide"
description: "Transform YouTube videos into comprehensive study guides with diagrams and PDF export"
triggers:
  - "youtube study guide"
  - "video notes"
  - "video to pdf"
  - "learn from video"
  - "study guide"
---

# Video Study Guide Generator

Transform any YouTube video into a comprehensive study guide with visual diagrams and professional PDF export.

## Included Skills

| Skill | Source | Instructions |
|-------|--------|--------------|
| youtube-clipper-skill | [op7418/youtube-clipper-skill](https://github.com/op7418/youtube-clipper-skill) | `skills/youtube-clipper-skill/instructions.md` |
| mermaid-diagrams | [softaworks/agent-toolkit](https://github.com/softaworks/agent-toolkit) | `skills/mermaid-diagrams/instructions.md` |
| pdf | [anthropics/skills](https://github.com/anthropics/skills) | `skills/pdf/instructions.md` |

## Workflow

When creating a study guide from a YouTube video:

1. **Extract Video Content**
   - Read `skills/youtube-clipper-skill/instructions.md`
   - Get the video transcript and identify key concepts
   - Note important timestamps

2. **Create Visual Diagrams**
   - For EACH major concept:
     a. Read `skills/mermaid-diagrams/instructions.md`
     b. Create a mermaid diagram (flowchart, sequence, or mindmap)
     c. Add to the study guide with context

3. **Export PDF Study Guide**
   - Read `skills/pdf/instructions.md`
   - Compile with table of contents, diagrams, and timestamps
   - Export as professional PDF

**IMPORTANT**: Create diagrams as you identify concepts, not all at the end. This ensures each diagram accurately represents the specific topic.

## Reference Table

| Reference | When to Read |
|-----------|--------------|
| `skills/youtube-clipper-skill/instructions.md` | First - to extract video content |
| `skills/mermaid-diagrams/instructions.md` | For each concept that needs visualization |
| `skills/pdf/instructions.md` | Final step - to export the study guide |

## Example Usage

**User**: Create a study guide from this YouTube video: https://youtube.com/watch?v=xyz

**Claude**:
1. Extracts transcript using youtube-clipper
2. Identifies 5 main concepts from the video
3. Creates a flowchart for Concept 1
4. Creates a sequence diagram for Concept 2
5. Creates a mindmap for Concepts 3-5
6. Compiles everything into a formatted PDF study guide

---

See `SOURCES.md` for attribution and update information.
