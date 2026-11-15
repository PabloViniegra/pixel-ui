Use `Dropdown` for a list of actions opened from a button: row "more" menus, account menus, "New..." buttons.

- Choosing a form value: use `Select` or `Autocomplete`. Right-click menus: `ContextMenu`. Site navigation: `Navbar`.
- Compose with `MenuItem`, `MenuGroup` and `MenuSeparator`. Handle actions in `onSelect`; the menu closes after it unless you call `event.preventDefault()`.
- `tone="danger"` for destructive items, placed last after a separator.
- The `trigger` must be a button-like element; an icon-only trigger needs an `aria-label`.
- Use bare `Menu` only for an always-visible action list.
