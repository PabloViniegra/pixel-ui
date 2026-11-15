Use for a start and end date chosen together: report periods, bookings, filters.

- Two unrelated dates: use two `DatePicker`s.
- `onChange` gives an ordered `{ start, end }` or `null`; it never emits a half-finished range.
- Submit with `startName` and `endName`. Wrap it in `Field` for the label and error.
