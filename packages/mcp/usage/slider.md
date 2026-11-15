Use for an approximate value in a range where the relative position matters: volume, opacity, a threshold.

- An exact number: `NumberField`. A few discrete options: `SegmentedControl` or `RadioGroup`.
- Set `min`, `max` and `step`. Use `showValue` with `format` so the value reads with its unit.
- Listen with `onValueChange`. Wrap it in `Field` for the label.
