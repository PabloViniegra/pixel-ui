Use to group related content into one bounded unit: a project, a plan, a summary.

- Compose it from `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` and `CardFooter` instead of free-form children.
- To make the whole card clickable, put a `CardLink` inside (usually wrapping the title text). Do not add `onClick` to the card and do not use the deprecated `interactive` prop. Buttons and other links inside stay clickable.
- `highlight` marks one selected or recommended card in a set; `CardTitle pixel` is for a single featured card per view.
- Do not nest cards, and do not wrap every page section in one; plain spacing or a `Separator` is often enough.
