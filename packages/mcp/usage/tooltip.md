Use for a short text hint about a control, mainly the name of an icon-only button or a shortcut.

- It never shows on touch and cannot hold interactive content: nothing essential may live only in a tooltip.
- Rich content or a preview: `HoverCard`. Content with controls: `Popover`. Help text for a form field: `Field description`.
- `children` must be one focusable element that accepts a ref. Do not put tooltips on disabled buttons or on plain text.
- Keep it to a few words; an icon-only button still needs its own `aria-label`.
