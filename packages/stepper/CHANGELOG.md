# @pablo-v/stepper

## 0.2.1

### Patch Changes

- Improve small screens, touch and rendering cost: floating panels stay within the viewport and above the on-screen keyboard, Alert and Stepper adapt to their container width and now fill it, rows wrap instead of overflowing, touch targets grow on coarse pointers, hover effects only apply on devices that hover, safe-area insets are respected, and list rows and animations re-render less.
- Updated dependencies
  - @pablo-v/core@0.2.2

## 0.2.0

### Minor Changes

- 805f315: Stepper connectors wipe in as a step completes, the new check pops in, and horizontal steppers keep only the current label on narrow screens. The chosen Rating star and masked PinInput digits pop in, NumberField buttons tint toward the accent while pressed, Resizable handles get a wider hit area, and FileUpload animates its icon while a file is dragged over.

## 0.1.0

### Minor Changes

- 44d2025: Add Drawer, AlertDialog, Toggle/ToggleGroup/SegmentedControl, NumberField, Avatar, Sidebar, FileUpload, PinInput, TimeField/TimePicker, Stepper, ContextMenu, HoverCard, ScrollArea, Collapsible, Timeline, Rating and ResizablePanels, and re-export them from `@pablo-v/react`.

### Patch Changes

- Updated dependencies [e753d57]
  - @pablo-v/pixel-icons@1.3.0
