# Chat design

Living standard for `@sarchauhan/chat` / chat-sdk. Vercel restraint, not a Vercel product-shell clone: content-first reading column, type and spacing before chrome, monochrome with color only for real state. No Geist, no Google Fonts, no decorative display faces unless the product later opts in.

Reviewers and agents: treat this file as the visual contract. Do not invent a parallel system.

## Principles

- Content-first. The conversation is a reading column. Chrome yields to text, tools, and questions.
- Hierarchy comes from typography and spacing before borders or cards. If type and space cannot carry the grouping, the structure is wrong — do not add a box to paper over it.
- Stillness by default. Motion only for live state (pending tools, streaming thought, running tasks). Honor `prefers-reduced-motion`.
- Earn every surface. Most of the column is open canvas. Color marks streaming, approval, error, success — not decoration.

## Typography

System stacks only, via tokens:

- `--chat-font-sans` — `ui-sans-serif`, system-ui, and platform fallbacks
- `--chat-font-mono` — `ui-monospace` and platform fallbacks

Weights: `400` / `500` / `600` / `700`. No intermediates (`550`, `560`, `650`). No gradient text.

## Tokens

All color, type, space, and radius flow through `--chat-*` in `packages/chat/src/theme/tokens.css`. Themes: `light`, `dark`, and `system` (follows `prefers-color-scheme`). Do not introduce one-off hex, rem, or radius values that bypass tokens.

## Surfaces and borders

Stay **borderless**: message shells, tool groups, thinking, code, question, task rows.

The **composer** may keep a surface plus a soft shadow — it is the interactive control, not a card around content.

The composer top fade is a **functional** `linear-gradient` scroll veil into `--chat-bg` so messages do not collide with the input. It is not a decorative vibe gradient. Do not add other gradients.

## Public primitives

Compose these. Do not re-skin them with nested cards.

| Export | Role |
| --- | --- |
| `ToolChip` / `BaseTool` | Icon + short label + optional detail pill |
| `ToolChipGroup` | Consecutive tools under **N tool calls** |
| `ThinkingBlock` | Streaming / completed thought |
| `DiffChips` | Real file + add/del counts when the agent provides them |
| `TaskRows` | Live task list; glyph + type carry status |
| `Question` / `questionWidget` | First-class poll / ask |
| Markdown / `@sarchauhan/code-markdown` | Fenced code in the same reading column |

## Tool UX

- Never dump raw tool args as the default UI.
- Live / pending groups stay expanded and may animate.
- Completed groups collapse to the **N tool calls** summary. Diff chips remain if the data exists.
- Chips stay compact. One tool is one row, not a `<details>` panel.

## Hard rejects

Anti-AI-slop. Do not ship:

- Novelty or decorative gradients, gradient text, glows, blobs, glass
- Ornamental shadows (composer shadow is the exception)
- Random borders or nested cards to fix weak hierarchy
- Decorative custom fonts
- Pills / badges for ordinary metadata that type or color already express (task “Completed” capsules). Keep `DiffChips` — they carry file + diff facts.

## CSS and components

Keep CSS by concern under `packages/chat/src/`:

`theme/tokens.css` · `chat.css` · `chips.css` · `blocks.css` · `markdown.css` · `widgets.css` · `chat.select.css`

Surfaces live under `packages/chat/src/components/{Chat,Message,Widget}`. Policy helpers stay in `packages/chat/src/lib`. Do not add magic sizes that skip tokens.

## Storybook

`storybook/src/stories/Primitives.stories.tsx` is the visual contract. Check Tool, grouped tools (live + complete), Thinking, Code, and Question in **light and dark** before landing chrome changes.
