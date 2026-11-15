A signature display component: `FlipCounter` for a number whose changes deserve attention (countdowns, live totals) and `Clock` for the current time.

- At most one per view, in hero or dashboard-headline positions. Use plain text for ordinary numbers and for values inside tables or forms.
- `minDigits` keeps the width stable while the value changes.
- `Clock` renders dashes on the server and until mounted; pass `timeZone` to show a specific zone.
