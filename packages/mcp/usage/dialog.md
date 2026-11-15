Use for a short, focused task that must be finished or dismissed before returning to the page: create, rename, edit a few fields.

- Yes/no confirmation of a destructive action: use `AlertDialog`. Long forms, detail views or anything that benefits from page context: use `Drawer`. Small non-blocking content next to a control: use `Popover`.
- Pass the opening element as `trigger`, or control it with `open` and `onOpenChange`.
- Put actions in `footer`, primary last, and wrap the cancel button in `DialogClose`.
- `title` is required. Set `dismissible={false}` only when closing would lose work.
- Content mounts only while open, so state inside resets on each open. Do not open a dialog from a dialog.
