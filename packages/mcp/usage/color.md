Use for choosing a colour. All values are hex strings (`#rrggbb`, or `#rrggbbaa` when not opaque).

- Default choice: `ColorPicker`, a compact trigger that opens a panel; add `alpha` and `swatches` as needed.
- A fixed brand palette only: `ColorSwatchPicker`. A typed hex value only: `ColorField`. Displaying a colour: `ColorSwatch`.
- For a custom panel, pass `ColorArea`, `ColorSlider`, `ColorField` and `ColorSwatchPicker` as `ColorPicker` children; they share the picker colour without wiring `value` on each.
- Give `ColorPicker` a meaningful `label` and wrap `ColorField` in `Field`.
