Use for a query that filters or searches content: a list, a table, a command or a site search.

- It is an `Input` with `type="search"`, a search icon and a clear button that appears once there is text. Escape clears the text first; a second Escape reaches the parent (for example, closes a dialog).
- Control it with `value` and `onValueChange` to filter as the user types. `onClear` fires after the button or Escape empties it.
- Give it a name: wrap it in `Field` or pass `aria-label`. Translate the clear button with `clearLabel`.
- Announce result counts in a `role="status"` element next to the results, not in the field.
- Replace the icon with `prefix`; the suffix slot is reserved for the clear button.
- For picking one option from a list, use `Autocomplete`; for app commands, use `CommandMenu`.
