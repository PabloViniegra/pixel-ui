Use to show progress through a fixed sequence of steps: onboarding, checkout, a setup wizard.

- It displays position only; you render the content of the current step and own `current`.
- Pass `onStepClick` to let users go back to completed steps. Set `status: 'error'` on a step that needs fixing.
- Continuous progress without named steps: `Progress`. A history of past events: `Timeline`. Switching freely between views: `Tabs`.
- Keep to about five steps with short labels; use `orientation="vertical"` when steps need descriptions.
