# @pablo-v/pixel-icons

## 1.3.1

### Patch Changes

- Balance directional arrows, center camera and microphone details, and clarify file and database silhouettes. Refine the Storybook icon galleries with responsive columns and consistent preview spacing.

## 1.3.0

### Minor Changes

- e753d57: Add 17 monochrome brand icons: Android, Apple, Discord, Docker, Facebook, Figma, Git, GitHub, GitLab, Google, LinkedIn, Microsoft, npm, Slack, Vercel, X and YouTube.

## 1.2.0

### Minor Changes

- 451b428: Add 45 icons and 11 animated icons, plus `createAnimatedPixelIcon` for authoring frame-by-frame icons.

## 1.1.0

### Minor Changes

- 2c3df8b: Add Alert, Autocomplete, Calendar, Chip, DateField, DatePicker, DateRangePicker, Link and MultiSelect. Pixel icons gain `CalendarIcon`; Field exposes `useFieldLabelId()` for controls made of several focusable parts.

## 1.0.0

### Minor Changes

- 546adf4: Add form, overlay, navigation and structure components (input, textarea, checkbox, radio, select, slider, field, dialog, tooltip, popover, menu, toast, tabs, breadcrumb, accordion, table, kbd, skeleton, separator) and signature components (pixel-avatar, pixel-image, pixel-transition, terminal, pixel-icons, command-menu, mini-chart, flip-clock). Interactive components ship with `"use client"` for the Next.js App Router. Tokens add `--pxl-shadow-lg`, `--pxl-overlay`, the decorative `--pxl-shadow-pixel` and `--pxl-clip-notch`, the `pxl-float-in` keyframes and a Tailwind CSS v4 preset at `@pablo-v/tokens/tailwind.css`. Core adds positioning, dismiss, roving-focus, ref-merging and cell helpers; progress and scramble-text reuse them.

### Patch Changes

- Updated dependencies [546adf4]
- Updated dependencies [18d5fc6]
  - @pablo-v/core@0.2.0
  - @pablo-v/tokens@0.2.0
