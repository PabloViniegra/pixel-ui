Use for a short, non-interactive status or category label: "Ready", "Beta", "3 new".

- Something the user can toggle or remove: use `Chip`. A sentence-long message: use `Alert`.
- Keep the default `subtle` appearance; reserve `solid` for the single most important status in view.
- `tone` communicates state (success, warning, danger), never decoration. Use `neutral` for plain categories.
- `dot="pulse"` only for a state that is live right now (building, deploying).
