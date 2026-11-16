Use for an exact number the user types or nudges: quantity, port, replicas.

- An approximate value in a range: `Slider`. Identifiers that happen to be digits (phone, card, ZIP): `Input` with `inputMode="numeric"`.
- The value is `number | null`. `onChange` fires on commit (blur or Enter) and on each step, not on every keystroke.
- Set `min`, `max` and `step`. Wrap it in `Field` for the label and error.
- In non-English UIs, translate the stepper buttons with `incrementLabel` and `decrementLabel`.
