Use for a longer task or a detail view that slides over the page while keeping its context: edit forms, filters, an item inspector.

- Short task or a few fields: use `Dialog`. Persistent app navigation: use `Sidebar`.
- `side="right"` (default) for details and forms, `left` for navigation on small screens, `bottom` for mobile sheets.
- Put actions in `footer` (pinned to the bottom) and wrap the cancel button in `DrawerClose`.
- It is modal: the page behind is inert. For a panel that stays open while the user works on the page, use `ResizablePanels`.
- In non-English UIs, translate the close button with `closeLabel`.
