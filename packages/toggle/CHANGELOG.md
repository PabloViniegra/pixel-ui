# @pablo-v/toggle

## 0.1.3

### Patch Changes

- Improve small screens, touch and rendering cost: floating panels stay within the viewport and above the on-screen keyboard, Alert and Stepper adapt to their container width and now fill it, rows wrap instead of overflowing, touch targets grow on coarse pointers, hover effects only apply on devices that hover, safe-area insets are respected, and list rows and animations re-render less.
- Updated dependencies
  - @pablo-v/core@0.2.2

## 0.1.2

### Patch Changes

- Respect fractional number bounds after rounding, preserve PIN cell positions during deletion, and keep segmented controls keyboard accessible when the selected option is disabled.

## 0.1.1

### Patch Changes

- 805f315: FileUpload lists refused files under the drop zone (`rejectionMessage` customises or hides it) and keeps focus in the component when a file is removed. Timeline items get their missing vertical spacing, unlit Rating stars meet 3:1 contrast, and a pressed Toggle keeps its pressed look while hovered.

## 0.1.0

### Minor Changes

- 44d2025: Add Drawer, AlertDialog, Toggle/ToggleGroup/SegmentedControl, NumberField, Avatar, Sidebar, FileUpload, PinInput, TimeField/TimePicker, Stepper, ContextMenu, HoverCard, ScrollArea, Collapsible, Timeline, Rating and ResizablePanels, and re-export them from `@pablo-v/react`.
