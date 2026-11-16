# @pablo-v/number-field

## 0.2.0

### Minor Changes

- 878f832: Add props to translate built-in accessible names: `closeLabel` on `Dialog` and `Drawer`, `incrementLabel` and `decrementLabel` on `NumberField`, `dismissLabel` on `Toaster`, `searchLabel` and `listLabel` on `CommandMenu`, `listLabel` and `removeLabel` (a function of the file name) on `FileUpload`, and `saturationLabel`, `brightnessLabel`, `hueLabel`, `alphaLabel`, `hexLabel` and `presetsLabel` on `ColorPicker`. Error toasts now announce their text with `role="alert"`, so screen readers read them immediately.

### Patch Changes

- Updated dependencies [878f832]
- Updated dependencies [878f832]
  - @pablo-v/field@1.1.3
  - @pablo-v/input@1.0.3

## 0.1.2

### Patch Changes

- Respect fractional number bounds after rounding, preserve PIN cell positions during deletion, and keep segmented controls keyboard accessible when the selected option is disabled.

## 0.1.1

### Patch Changes

- 805f315: Stepper connectors wipe in as a step completes, the new check pops in, and horizontal steppers keep only the current label on narrow screens. The chosen Rating star and masked PinInput digits pop in, NumberField buttons tint toward the accent while pressed, Resizable handles get a wider hit area, and FileUpload animates its icon while a file is dragged over.

## 0.1.0

### Minor Changes

- 44d2025: Add Drawer, AlertDialog, Toggle/ToggleGroup/SegmentedControl, NumberField, Avatar, Sidebar, FileUpload, PinInput, TimeField/TimePicker, Stepper, ContextMenu, HoverCard, ScrollArea, Collapsible, Timeline, Rating and ResizablePanels, and re-export them from `@pablo-v/react`.

### Patch Changes

- Updated dependencies [e753d57]
  - @pablo-v/pixel-icons@1.3.0
