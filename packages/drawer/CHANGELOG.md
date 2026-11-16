# @pablo-v/drawer

## 0.2.0

### Minor Changes

- 878f832: Add props to translate built-in accessible names: `closeLabel` on `Dialog` and `Drawer`, `incrementLabel` and `decrementLabel` on `NumberField`, `dismissLabel` on `Toaster`, `searchLabel` and `listLabel` on `CommandMenu`, `listLabel` and `removeLabel` (a function of the file name) on `FileUpload`, and `saturationLabel`, `brightnessLabel`, `hueLabel`, `alphaLabel`, `hexLabel` and `presetsLabel` on `ColorPicker`. Error toasts now announce their text with `role="alert"`, so screen readers read them immediately.

## 0.1.1

### Patch Changes

- Improve small screens, touch and rendering cost: floating panels stay within the viewport and above the on-screen keyboard, Alert and Stepper adapt to their container width and now fill it, rows wrap instead of overflowing, touch targets grow on coarse pointers, hover effects only apply on devices that hover, safe-area insets are respected, and list rows and animations re-render less.
- Updated dependencies
  - @pablo-v/core@0.2.2

## 0.1.0

### Minor Changes

- 44d2025: Add Drawer, AlertDialog, Toggle/ToggleGroup/SegmentedControl, NumberField, Avatar, Sidebar, FileUpload, PinInput, TimeField/TimePicker, Stepper, ContextMenu, HoverCard, ScrollArea, Collapsible, Timeline, Rating and ResizablePanels, and re-export them from `@pablo-v/react`.

### Patch Changes

- Updated dependencies [e753d57]
  - @pablo-v/pixel-icons@1.3.0
