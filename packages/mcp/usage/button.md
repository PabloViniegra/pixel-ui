Use for actions: submit, save, open, delete.

- Navigation to another page or URL: use `Link` (or a router link), not a button.
- One `primary` per view or section; `secondary` for the alternatives, `ghost` for low-emphasis and toolbar-like actions, `danger` only for destructive actions.
- During async work set `loading` instead of `disabled`: it keeps focus and announces the busy state. Use `disabled` only when the action is unavailable.
- The default `type` is `button`; set `type="submit"` inside forms.
- Icon-only buttons need an `aria-label`. On/off buttons are `Toggle`, not `Button`.
