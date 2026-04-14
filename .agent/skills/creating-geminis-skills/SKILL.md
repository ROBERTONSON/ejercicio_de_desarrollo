---
name: creating-geminis-skills
description: Creates new skills for the Antigravity agent environment based on user requirements. Use when the user asks to create an Antigravity skill, build a skill, or automate a new workflow.
---

# Antigravity Skill Creator

## When to use this skill
- The user requests to create a new skill for Antigravity.
- The user wants to build a script, template, or automation under `.agent/skills/`.
- The user mentions "geminis skill" or skill generation.

## Workflow
- **Understand the Request**: Identify the specific task the user wants the new skill to accomplish.
- **Determine Structure**: Plan the skill name (gerund form, lowercase, numbers, hyphens, max 64 chars) and description (third-person, max 1024 chars).
- **Draft Content**: Create the required `SKILL.md` adhering to core principles (conciseness, progressive disclosure).
- **Validate**: Ensure no restricted terminology is used. Match formatting to degrees of freedom (bullet points for heuristics, code blocks for templates, bash commands for fragile operations).
- **Output**: Output the final content or directly write it to `.agent/skills/[skill-name]/SKILL.md`.

## Instructions
- Maintain the folder hierarchy: `<skill-name>/SKILL.md` (Required), with optional `scripts/`, `examples/`, and `resources/` directories.
- YAML Frontmatter must have `name` and `description` attributes.
- Always use forward slashes (`/`) for paths.
- Incorporate a Plan-Validate-Execute pattern for complex tasks.
- Keep `SKILL.md` under 500 lines. If more details are required, use links to secondary files one level deep (e.g., `ADVANCED.md`).

## Resources
[No external resources needed by default]
