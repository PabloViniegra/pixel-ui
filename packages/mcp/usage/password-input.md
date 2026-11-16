Use for passwords and other secrets the user types.

- It is an `Input` with a button that shows or hides the text. The button keeps one label (`toggleLabel`, default `Show password`) and reports its state with `aria-pressed`.
- Set `autoComplete`: the default is `current-password`; use `new-password` on sign-up and reset forms so password managers can suggest one.
- Wrap it in `Field` for the label, requirements (`description`) and errors. A disabled `Field` disables the toggle too.
- `visible`/`onVisibleChange` control the visibility; `defaultVisible` starts it revealed, for example after generating a password.
- For one-time codes, use `PinInput`.
