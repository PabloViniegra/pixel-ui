Use to offer shortcuts to actions on an item through right-click or long press: table rows, files, canvas objects.

- It is invisible until invoked, so every action in it must also be available through visible UI (a `Dropdown` on the row, a toolbar).
- `children` is the target area (one element); `content` takes `MenuItem`, `MenuGroup` and `MenuSeparator` from `@pablo-v/menu`.
- Do not override the native context menu on text, links or inputs.
