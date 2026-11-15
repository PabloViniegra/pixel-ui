Use around every text-like form control to give it a label, helper text and an error message.

- One control per `Field`. It wires `id`, `aria-describedby`, `aria-invalid`, `required` and `disabled` into PixelUI controls automatically.
- Works with `Input`, `Textarea`, `Select`, `Autocomplete`, `MultiSelect`, `NumberField`, the date and time fields, `PinInput`, `Slider` and `ColorField`.
- `Checkbox`, `Switch` and `RadioGroup` carry their own label and do not need it.
- Pass the message in `error` only while the value is invalid; it replaces `description`. Do not also set `invalid` on the control.
- Always give a visible `label`; a placeholder is not a label.
