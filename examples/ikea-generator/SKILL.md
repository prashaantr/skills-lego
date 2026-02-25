---
name: "ikea-generator"
description: "Generate IKEA-style assembly instructions with AI-generated images for each step"
triggers:
  - "ikea instructions"
  - "assembly manual"
  - "build guide"
  - "step by step instructions"
  - "furniture assembly"
---

# IKEA-Style Assembly Instructions Generator

Generate professional IKEA-style assembly instructions with AI-generated images for each step. Combines structured instruction writing with on-demand image generation.

## Included Skills

| Skill | Description | Instructions |
|-------|-------------|--------------|
| assembly-instructions | Generates structured step-by-step assembly guides | `skills/assembly-instructions/instructions.md` |
| nano-banana | AI image generation with DALL-E | `skills/nano-banana/instructions.md` |

## Workflow

When creating IKEA-style assembly instructions:

1. **Read the format spec first**
   - Read `skills/assembly-instructions/instructions.md` for the instruction format
   - Read `skills/assembly-instructions/references/ikea-visual-spec.md` for visual style

2. **For EACH step** (this is critical):
   a. Write the step text following the assembly format
   b. STOP and read `skills/nano-banana/instructions.md`
   c. Generate an isometric illustration for this specific step
   d. Include the image in the output
   e. Continue to the next step

3. **Compile final document**
   - Text and images should be interleaved (not all text then all images)
   - Use the compilation script if generating PDF output

**IMPORTANT**: Do not generate all text first. Image generation must happen per-step to maintain context and accuracy.

## Reference Table

| Reference | When to Read |
|-----------|--------------|
| `skills/assembly-instructions/instructions.md` | At the start, for instruction format |
| `skills/assembly-instructions/references/ikea-visual-spec.md` | Before generating any images |
| `skills/assembly-instructions/references/design-principles.md` | When making design decisions |
| `skills/nano-banana/instructions.md` | Before each image generation |

## Example Usage

**User**: Create assembly instructions for a simple wooden bookshelf

**Claude**:
1. Reads assembly instructions format
2. Writes Step 1: "Attach side panel A to base B using 4 screws"
3. Generates isometric image of this step
4. Writes Step 2: "Insert shelf C into slots on both side panels"
5. Generates isometric image of this step
6. ... continues until complete

---

See `SOURCES.md` for attribution and update information.
