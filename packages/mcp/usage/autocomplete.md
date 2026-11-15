Use to pick exactly one value from a list long enough to need searching (roughly more than 10 options): countries, users, repositories.

- Short fixed list: use `Select` (or `RadioGroup` / `SegmentedControl` for 2 to 5 visible options). Several values: use `MultiSelect`. Free text with no fixed options: use `Input`.
- The value is always one of `options` or `null`; text that matches nothing is discarded on blur. It is not a search box.
- Wrap it in `Field` for the label and error. `onChange` receives the value and the full option.
- Use `inputValue` and `onInputChange` to load options from a server as the user types.
