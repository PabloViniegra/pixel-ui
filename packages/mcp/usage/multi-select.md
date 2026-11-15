Use to pick several values from a list: assignees, tags, regions.

- One value: `Autocomplete` or `Select`. Fewer than about five always-visible options: a group of `Checkbox`es.
- `value` is an array of option values in selection order; `options` accepts strings or `{ value, label, description, disabled }`.
- Wrap it in `Field` for the label and error.
