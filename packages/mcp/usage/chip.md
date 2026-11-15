Use for compact interactive pills: filter toggles, tags the user can remove, selected values.

- Static status label: use `Badge`.
- Passing `selected` makes it a toggle button; passing `onRemove` adds the remove button. Leave both out for a static chip.
- For an exclusive choice use `SegmentedControl` or `RadioGroup`; a row of selectable chips means "any combination".
