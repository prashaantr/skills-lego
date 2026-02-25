---
name: "{{name}}"
description: "{{description}}"
triggers:
{{#triggers}}
  - "{{.}}"
{{/triggers}}
---

# {{name}}

{{description}}

## Included Skills

| Skill | Description | Instructions |
|-------|-------------|--------------|
{{#skills}}
| {{name}} | {{description}} | `skills/{{name}}/instructions.md` |
{{/skills}}

## Workflow

{{#workflow}}
{{workflow}}
{{/workflow}}
{{^workflow}}
_No orchestration defined. Skills can be used independently._
{{/workflow}}

## Reference Table

| Reference | When to Read |
|-----------|--------------|
{{#skills}}
| `skills/{{name}}/instructions.md` | When working with {{name}} functionality |
{{/skills}}

---

See `SOURCES.md` for attribution and update information.
