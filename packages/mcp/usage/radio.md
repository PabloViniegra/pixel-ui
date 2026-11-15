Use for exactly one choice from two to about five options that should all be visible.

- More options or little space: `Select`. Switching the view rather than answering a form question: `SegmentedControl`. Independent choices: `Checkbox`.
- `RadioGroup` renders the legend, description and error itself (`label` is required); do not wrap it in `Field`.
- Use `orientation="horizontal"` only for short labels. Add a `description` to a `Radio` when an option needs explaining.
- Preselect the safest default instead of leaving the group empty, unless the choice must be deliberate.
