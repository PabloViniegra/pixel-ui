Use to pick one option from a short, fixed list (up to about 10 to 15 items).

- Long or searchable lists: `Autocomplete`. Several values: `MultiSelect`. Two to five options with room to show them: `RadioGroup` or `SegmentedControl`.
- It is a native `<select>`: pass `<option>` and `<optgroup>` children and use `value`, `defaultValue` and `onChange` as usual.
- Use `placeholder` for the empty first option instead of writing one by hand.
- Wrap it in `Field` for the label and error.
