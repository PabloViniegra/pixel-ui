Use for an always-visible month grid: a booking page, a schedule sidebar, an availability view.

- A date inside a form: use `DatePicker` (or `DateRangePicker`), which combines a typed field with this calendar in a pop-up.
- `mode="range"` selects a start and end; `onChange` fires once both ends are picked.
- Values are local-midnight `Date`s; time of day is ignored. Use `min`, `max` and `isDateDisabled` rather than rejecting a pick afterwards.
- The package also exports date helpers (`toISODate`, `parseISODate`, `addDays`, ...) for the same local-date model.
