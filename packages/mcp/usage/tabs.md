Use to switch between peer views of the same context, one visible at a time: Overview / Deployments / Settings.

- Sections to read in sequence or several open at once: `Accordion`. A value choice or a filter: `SegmentedControl`. Steps in order: `Stepper`. Links to different pages: navigation links, not tabs.
- `defaultValue` is required. Each `Tab` `value` must match a `TabPanel` `value`. Give `TabList` a `label`.
- Arrow keys select tabs immediately, so panels should render fast; do not gate a panel behind slow work.
- Keep to a handful of tabs with short labels.
