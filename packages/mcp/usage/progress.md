Use for an operation with measurable progress: uploads, builds, quotas, multi-step completion.

- Unknown duration: omit `value` for the indeterminate bar, or use `Loader` for a small region. Discrete named steps: `Stepper`.
- Always give `label` (or `aria-labelledby`). `showValue` when the exact percentage matters.
- `tone` reflects state: `danger` for a failed run or an exceeded quota, `success` when complete.
