# @pablo-v/multi-select

## 0.1.2

### Patch Changes

- bd5c3f5: Restyle dropdown lists: Select uses `appearance: base-select` where supported, Listbox highlights the matched text (`highlight` prop, `splitMatch` export) and MultiSelect rows show a checkbox.
- Updated dependencies [bd5c3f5]
  - @pablo-v/autocomplete@0.2.0

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

- Updated dependencies [d0c11f7]
  - @pablo-v/autocomplete@0.1.2
  - @pablo-v/chip@0.1.1
  - @pablo-v/field@1.1.1
  - @pablo-v/input@1.0.1

## 0.1.0

### Minor Changes

- 2c3df8b: Add Alert, Autocomplete, Calendar, Chip, DateField, DatePicker, DateRangePicker, Link and MultiSelect. Pixel icons gain `CalendarIcon`; Field exposes `useFieldLabelId()` for controls made of several focusable parts.

### Patch Changes

- Updated dependencies [2c3df8b]
  - @pablo-v/autocomplete@0.1.0
  - @pablo-v/chip@0.1.0
  - @pablo-v/pixel-icons@1.1.0
  - @pablo-v/field@1.1.0
