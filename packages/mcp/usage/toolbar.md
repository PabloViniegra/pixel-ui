Use to group a set of related controls for the content next to it: editor formatting, canvas tools, bulk actions.

- Fill it with `ToolbarButton`s (set `pressed` for on/off tools), split by `ToolbarGroup` and `ToolbarSeparator`.
- Icon-only buttons need an `aria-label`; add a `Tooltip` to show it. Give the toolbar and each group an `aria-label`.
- It is a single tab stop with arrow-key navigation, so do not use it as a generic flex row for unrelated buttons or for page navigation.
