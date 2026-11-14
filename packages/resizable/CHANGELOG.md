# @pablo-v/resizable

## 0.2.0

### Minor Changes

- - ContextMenu opens on a touch long press, which iOS needs because it never fires `contextmenu`.
  - Double-clicking a Resizable handle collapses the panel to its minimum and restores its previous size.
  - MultiSelect announces the value removed with Backspace; customise it with `removedMessage`.
  - Toasts with an action no longer dismiss themselves unless a `duration` is given.
  - Terminal accepts `maxLines` to keep only the latest lines, and skips rendering off-screen lines.

### Patch Changes

- Updated dependencies
  - @pablo-v/core@0.2.2

## 0.1.1

### Patch Changes

- 805f315: Stepper connectors wipe in as a step completes, the new check pops in, and horizontal steppers keep only the current label on narrow screens. The chosen Rating star and masked PinInput digits pop in, NumberField buttons tint toward the accent while pressed, Resizable handles get a wider hit area, and FileUpload animates its icon while a file is dragged over.

## 0.1.0

### Minor Changes

- 44d2025: Add Drawer, AlertDialog, Toggle/ToggleGroup/SegmentedControl, NumberField, Avatar, Sidebar, FileUpload, PinInput, TimeField/TimePicker, Stepper, ContextMenu, HoverCard, ScrollArea, Collapsible, Timeline, Rating and ResizablePanels, and re-export them from `@pablo-v/react`.
