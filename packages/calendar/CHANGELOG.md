# @pablo-v/calendar

## 0.1.3

### Patch Changes

- 878f832: Document every component prop with JSDoc so editor hovers, the Storybook controls table and the MCP API reference describe them.

## 0.1.2

### Patch Changes

- Fix keyboard and screen reader issues: Shift+Tab leaves a standalone menu, Tab leaves a partly filled PIN, popovers are named by their trigger, `aria-controls` only points at the rendered tab panel, "no results" and field errors are announced through live regions, the range start stays selected while choosing the end, and mini chart columns can be focused to read their value.
- Updated dependencies
  - @pablo-v/core@0.2.2

## 0.1.1

### Patch Changes

- d0c11f7: Design audit fixes:

  - tokens: add the `--pxl-size-xs/sm/md/lg` control heights (24/32/40/48px) and `--pxl-opacity-disabled`. Components now take their heights and disabled opacity from these tokens.
  - card: add `CardLink`, a stretched link that makes the whole card clickable, and `CardTitle pixel`. Titles are now sans by default. `interactive` is deprecated.
  - input, select, textarea: a single focus ring, with the outline only for keyboard focus; affixes, chevrons, field dots and selection labels no longer turn accent; fields use 16px text on coarse pointers so iOS does not zoom.
  - switch, chip: hit areas of at least 24px, and the switch changes tone on hover when on.
  - link: the resting underline uses a `currentColor` mix that stays visible in dark mode.
  - progress, slider: unlit cells are `gray-400` with a thin border; mini-chart ink uses `fg-muted`.
  - terminal text is 13px; the skeleton sweep and table row hover are more visible in dark mode.

## 0.1.0

### Minor Changes

- 2c3df8b: Add Alert, Autocomplete, Calendar, Chip, DateField, DatePicker, DateRangePicker, Link and MultiSelect. Pixel icons gain `CalendarIcon`; Field exposes `useFieldLabelId()` for controls made of several focusable parts.

### Patch Changes

- Updated dependencies [2c3df8b]
  - @pablo-v/pixel-icons@1.1.0
