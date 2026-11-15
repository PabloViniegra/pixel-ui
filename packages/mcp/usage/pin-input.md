Use for one-time codes and PINs of known length.

- Passwords or codes of unknown length: `Input`.
- Submit from `onComplete` so the user does not need a separate button press; set `length` to the real code length.
- `mask` for PINs and other secrets; `type="alphanumeric"` when the code has letters.
- Wrap it in `Field` for the label and error, and set `autoFocus` when it is the only control on the screen.
