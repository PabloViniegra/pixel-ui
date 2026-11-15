Use for a setting that turns on or off and takes effect immediately: notifications, dark mode, a feature flag.

- A choice applied only when a form is submitted, or selecting items in a list: `Checkbox`.
- Pass `label`, or `aria-label` when the visible label lives elsewhere. Label the setting itself ("Email alerts"), not the state ("On").
- Use `checked` with `onCheckedChange`; it is a button, not a native checkbox, so it does not submit a value on its own.
