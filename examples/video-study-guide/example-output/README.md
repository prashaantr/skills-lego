# Example Output

This folder contains an example study guide generated using the `video-study-guide` composite skill.

## Source Video

- **Title**: How Git Works: Explained in 4 Minutes
- **URL**: https://youtube.com/watch?v=e9lnsKot_SQ

## Generated Files

- `study-guide.md` - Complete study guide with diagrams

## How It Was Generated

The skill followed this workflow:

1. **Extracted transcript** using `references/youtube-clipper-skill.md`
   - Identified 5 main concepts from the video
   - Noted timestamps for each section

2. **Created diagrams** using `references/mermaid-diagrams.md`
   - Flowchart for Git objects relationship
   - Flowchart for the three trees
   - GitGraph for commit history
   - Mindmap for key takeaways

3. **Compiled study guide** following PDF export patterns
   - Table of contents
   - Sections with timestamps
   - Diagrams inline with explanations
   - Summary and reference table

## Diagrams Generated

| Concept | Diagram Type |
|---------|--------------|
| Git Objects | Flowchart |
| Three Trees | Flowchart (LR) |
| Commit History | GitGraph |
| Branching | Flowchart |
| Key Takeaways | Mindmap |

## To Export as PDF

```bash
# Using pandoc
pandoc study-guide.md -o study-guide.pdf

# Or use the pdf skill's scripts
python scripts/pdf/convert_to_pdf.py study-guide.md
```
