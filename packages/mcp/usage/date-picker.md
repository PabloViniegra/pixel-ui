Use as the default control for one date in a form: typed entry plus a pop-up calendar.

- A date range: use `DateRangePicker`. An always-visible calendar: use `Calendar`. Date and time: pair it with `TimeField`.
- Restrict with `min` and `max`, which also bound typed dates. `isDateDisabled` only greys out days in the calendar: a typed date can still be a disabled day, so validate it as well.
- The value is a local-midnight `Date` or `null`; pass `name` to submit it as `YYYY-MM-DD`.
- Wrap it in `Field` for the label and error.
