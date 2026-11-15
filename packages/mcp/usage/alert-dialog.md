Use to confirm an action that is destructive or hard to undo: delete, revoke, discard changes.

- Anything with form fields or more than a yes/no choice: use `Dialog`. Reversible actions: skip the confirmation and offer undo in a `toast`.
- Set `tone="danger"` for destructive confirms and write `confirmLabel` as the verb ("Delete project"), never "OK" or "Yes".
- Return the promise from `onConfirm`: the dialog shows the loading state and stays open until it settles, and stays open on rejection so you can show the error.
- `title` asks the question; `description` (required) states the consequence.
