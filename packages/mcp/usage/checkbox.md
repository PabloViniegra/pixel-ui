Use for an independent on/off choice that is submitted with a form, or for selecting several items from a list.

- A setting that applies immediately: use `Switch`. Exactly one of several options: use `RadioGroup`.
- Pass `label` (and `description`) to the checkbox itself; it does not need a `Field`.
- `indeterminate` is only for a "select all" box whose children are partly selected.
- It is a native input: `name`, `checked`, `defaultChecked` and `onChange` work as usual.
