# @pablo-v/context-menu

## 0.2.2

### Patch Changes

- 878f832: Document every component prop with JSDoc so editor hovers, the Storybook controls table and the MCP API reference describe them.
- Updated dependencies [878f832]
  - @pablo-v/menu@1.0.4

## 0.2.1

### Patch Changes

- Refine component surfaces, spacing, typography and interaction feedback while preserving existing APIs and theme tokens.

## 0.2.0

### Minor Changes

- - ContextMenu opens on a touch long press, which iOS needs because it never fires `contextmenu`.
  - Double-clicking a Resizable handle collapses the panel to its minimum and restores its previous size.
  - MultiSelect announces the value removed with Backspace; customise it with `removedMessage`.
  - Toasts with an action no longer dismiss themselves unless a `duration` is given.
  - Terminal accepts `maxLines` to keep only the latest lines, and skips rendering off-screen lines.

### Patch Changes

- Updated dependencies
- Updated dependencies
  - @pablo-v/menu@1.0.3
  - @pablo-v/core@0.2.2

## 0.1.0

### Minor Changes

- 44d2025: Add Drawer, AlertDialog, Toggle/ToggleGroup/SegmentedControl, NumberField, Avatar, Sidebar, FileUpload, PinInput, TimeField/TimePicker, Stepper, ContextMenu, HoverCard, ScrollArea, Collapsible, Timeline, Rating and ResizablePanels, and re-export them from `@pablo-v/react`.
