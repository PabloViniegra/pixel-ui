# @pablo-v/pin-input

## 0.1.3

### Patch Changes

- Fix keyboard and screen reader issues: Shift+Tab leaves a standalone menu, Tab leaves a partly filled PIN, popovers are named by their trigger, `aria-controls` only points at the rendered tab panel, "no results" and field errors are announced through live regions, the range start stays selected while choosing the end, and mini chart columns can be focused to read their value.
- Updated dependencies
- Updated dependencies
  - @pablo-v/field@1.1.2
  - @pablo-v/core@0.2.2

## 0.1.2

### Patch Changes

- Respect fractional number bounds after rounding, preserve PIN cell positions during deletion, and keep segmented controls keyboard accessible when the selected option is disabled.

## 0.1.1

### Patch Changes

- 805f315: Stepper connectors wipe in as a step completes, the new check pops in, and horizontal steppers keep only the current label on narrow screens. The chosen Rating star and masked PinInput digits pop in, NumberField buttons tint toward the accent while pressed, Resizable handles get a wider hit area, and FileUpload animates its icon while a file is dragged over.

## 0.1.0

### Minor Changes

- 44d2025: Add Drawer, AlertDialog, Toggle/ToggleGroup/SegmentedControl, NumberField, Avatar, Sidebar, FileUpload, PinInput, TimeField/TimePicker, Stepper, ContextMenu, HoverCard, ScrollArea, Collapsible, Timeline, Rating and ResizablePanels, and re-export them from `@pablo-v/react`.
