Use `TimeField` for typing a time and `TimePicker` when suggested times help (scheduling, reminders).

- The value is always a 24-hour string (`"14:30"`, or `"14:30:00"` with `granularity="second"`), whatever clock the user sees.
- The displayed clock follows `locale`; force it with `hourCycle`.
- `min` and `max` flag out-of-range times with the error style; they do not block typing.
- Date and time together: place it beside a `DatePicker`. Wrap it in `Field` for the label and error.
