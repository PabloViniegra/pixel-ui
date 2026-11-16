Use for single-line text: names, emails and URLs.

- Multi-line: `Textarea`. Numbers the user steps: `NumberField`. Codes: `PinInput`. Search: `SearchInput`. Passwords: `PasswordInput`. One of many options: `Autocomplete` or `Select`. Dates and times: the date and time fields.
- Wrap it in `Field` for the label, description and error. Set the right native `type`, `autoComplete` and `inputMode`.
- `prefix` and `suffix` hold short text or an icon (a unit, a protocol, a currency).
- `className` and `style` apply to the visible box, not the inner `<input>`.
