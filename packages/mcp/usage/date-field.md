Use for typing a known date quickly from the keyboard: a birth date, a document date.

- When browsing a calendar helps (near-future dates, weekdays matter): use `DatePicker`. Start and end together: use `DateRangePicker`.
- The value is a `Date` or `null`; `onChange` only fires with a complete, valid date or `null`.
- The segment order follows `locale`. Pass `name` to submit the value as `YYYY-MM-DD`.
- Wrap it in `Field` for the label and error.
