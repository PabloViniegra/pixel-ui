Three related controls for pressed and selected states.

- `Toggle`: one independent on/off button (bold, mute, favourite). Icon-only toggles need an `aria-label`.
- `ToggleGroup`: related toggles behind one tab stop. `type="multiple"` for combinable options (bold + italic); the default `single` allows at most one and can be empty. `value` is always an array.
- `SegmentedControl`: exactly one of two to five options, always one selected. Use it to switch a view or mode (List / Grid, Monthly / Yearly).
- Not for: a setting with a label (`Switch`), a form answer (`RadioGroup`), switching content panels (`Tabs`).
