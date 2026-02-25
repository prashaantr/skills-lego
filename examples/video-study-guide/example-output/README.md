# Example Output

This folder contains a study guide generated using the `video-study-guide` composite skill.

## Source Video

- **Title**: Linus Torvalds: The Mind Behind Linux
- **URL**: https://www.ted.com/talks/linus_torvalds_the_mind_behind_linux
- **Duration**: ~21 minutes
- **Speaker**: Linus Torvalds (creator of Linux and Git)

## Generated Files

| File | Description |
|------|-------------|
| `study-guide.md` | AI-generated study guide with diagrams |
| `transcript.vtt` | Raw VTT transcript from TED |

## How It Was Generated

1. **Extracted transcript** using `yt-dlp` via TED.com
   ```bash
   yt-dlp --write-sub --sub-lang en --skip-download \
     "https://www.ted.com/talks/linus_torvalds_the_mind_behind_linux"
   ```

2. **AI Analysis** identified 8 major sections:
   - The Unlikely Headquarters (working alone)
   - How Linux Actually Started (not as open source)
   - The Power of Community Feedback
   - Why Git Was Created (scaling problems)
   - The Stubbornness Factor (key trait)
   - Working with Different People
   - What is "Good Taste" in Code
   - Engineer vs Visionary (Edison not Tesla)

3. **Created 9 mermaid diagrams** using `references/mermaid-diagrams.md`:
   - Flowcharts for process comparisons
   - Sequence diagrams for community interaction
   - Mindmaps for key concepts

4. **Compiled study guide** with timestamps, diagrams, and summary tables

## Diagrams Generated

| Concept | Diagram Type |
|---------|--------------|
| Expected vs Reality HQ | Flowchart LR |
| Linux Origin Story | Flowchart TD |
| Community Feedback | Sequence Diagram |
| Scaling to Git | Flowchart TB |
| Stubbornness Traits | Mindmap |
| People Types | Flowchart LR |
| Good vs Bad Taste | Flowchart TB |
| Edison vs Tesla | Flowchart LR |
| Success Formula | Mindmap |

## Note on YouTube

YouTube's bot detection blocked `yt-dlp` during testing. TED.com worked without issues.

**YouTube workarounds:**
- Export browser cookies: `yt-dlp --cookies cookies.txt <url>`
- Manually copy transcript from YouTube's "Show transcript" feature

## To Export as PDF

```bash
pandoc study-guide.md -o study-guide.pdf
```
