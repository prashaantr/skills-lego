# Nano Banana - AI Image Generation

Generate images using DALL-E or other AI image models.

## Usage

When you need to generate an image:

1. Craft a detailed prompt describing the image
2. Use the generation script: `skills/nano-banana/scripts/generate.py`
3. The script returns a URL or base64 image

## Prompt Guidelines

For IKEA-style assembly illustrations:

- Start with: "Isometric technical illustration"
- Specify: "Clean white background, no text"
- Describe the exact assembly action
- Mention: "IKEA instruction manual style"
- Include: "Minimal shadows, flat colors"

## Example Prompt

```
Isometric technical illustration of hands attaching a wooden shelf
to two vertical side panels using screws. IKEA instruction manual style.
Clean white background, no text, minimal shadows, flat colors.
The shelf slots into pre-drilled holes on the side panels.
```

## Script Usage

```bash
python skills/nano-banana/scripts/generate.py \
    --prompt "Your image description" \
    --style "isometric" \
    --output ./step-3.png
```
