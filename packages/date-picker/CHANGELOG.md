# @pablo-v/date-picker

## 0.1.3

### Patch Changes

- 878f832: Document every component prop with JSDoc so editor hovers, the Storybook controls table and the MCP API reference describe them.
- 878f832: Move the square affix button style into `@pablo-v/input` (`.pxl-input__affix-button`) so `DatePicker`, `SearchInput` and `PasswordInput` share one definition. `DatePicker` keeps its `pxl-date-picker__trigger` class for overrides.
- Updated dependencies [878f832]
- Updated dependencies [878f832]
  - @pablo-v/calendar@0.1.3
  - @pablo-v/date-field@0.1.2
  - @pablo-v/field@1.1.3
  - @pablo-v/input@1.0.3

## 0.1.2

### Patch Changes

- Improve small screens, touch and rendering cost: floating panels stay within the viewport and above the on-screen keyboard, Alert and Stepper adapt to their container width and now fill it, rows wrap instead of overflowing, touch targets grow on coarse pointers, hover effects only apply on devices that hover, safe-area insets are respected, and list rows and animations re-render less.
- Updated dependencies
- Updated dependencies
  - @pablo-v/field@1.1.2
  - @pablo-v/calendar@0.1.2
  - @pablo-v/core@0.2.2

## 0.1.1

### Patch Changes

- 1b8a9f9: Overlays animate out as well as in. Dialog transitions in and out; Popover, Menu, DatePicker and the Navbar dropdown fade out before unmounting; dismissed toasts collapse so the stack closes up. Floating panels scale from the point facing their anchor, and a tooltip shown right after another skips its delay and animation. Colour previews keep their colours in forced-colours mode.
- Updated dependencies [1b8a9f9]
  - @pablo-v/core@0.2.1

## 0.1.0

### Minor Changes

- 2c3df8b: Add Alert, Autocomplete, Calendar, Chip, DateField, DatePicker, DateRangePicker, Link and MultiSelect. Pixel icons gain `CalendarIcon`; Field exposes `useFieldLabelId()` for controls made of several focusable parts.

### Patch Changes

- Updated dependencies [2c3df8b]
  - @pablo-v/calendar@0.1.0
  - @pablo-v/date-field@0.1.0
  - @pablo-v/pixel-icons@1.1.0
  - @pablo-v/field@1.1.0
