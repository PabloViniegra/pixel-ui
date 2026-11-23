# @pablo-v/mcp

## 0.2.1

### Patch Changes

- 5c4ac19: List CommandMenu under Overlays instead of Signature.

## 0.2.0

### Minor Changes

- 878f832: Add sortable table headers (`sort` and `onSort` on `TableHeader`, with `aria-sort`) and two new components: `SearchInput`, a search field with a clear button, and `PasswordInput`, a password field with a show/hide toggle.

### Patch Changes

- 878f832: Add props to translate built-in accessible names: `closeLabel` on `Dialog` and `Drawer`, `incrementLabel` and `decrementLabel` on `NumberField`, `dismissLabel` on `Toaster`, `searchLabel` and `listLabel` on `CommandMenu`, `listLabel` and `removeLabel` (a function of the file name) on `FileUpload`, and `saturationLabel`, `brightnessLabel`, `hueLabel`, `alphaLabel`, `hexLabel` and `presetsLabel` on `ColorPicker`. Error toasts now announce their text with `role="alert"`, so screen readers read them immediately.
- 878f832: Document every component prop with JSDoc so editor hovers, the Storybook controls table and the MCP API reference describe them.
- 878f832: Mark `Button` as a client component so `<Button loading>` works inside React Server Components, and regroup the catalogue into Actions, Forms, Feedback, Data display, Layout, Navigation, Overlays and Signature.
- 878f832: Move the square affix button style into `@pablo-v/input` (`.pxl-input__affix-button`) so `DatePicker`, `SearchInput` and `PasswordInput` share one definition. `DatePicker` keeps its `pxl-date-picker__trigger` class for overrides.

## 0.1.2

### Patch Changes

- 3d237b4: Show the check mark and indeterminate dash again: the positioned input was painting over them.

## 0.1.1

### Patch Changes

- Refine component surfaces, spacing, typography and interaction feedback while preserving existing APIs and theme tokens.

## 0.1.0

### Minor Changes

- 4def8d7: Add the PixelUI MCP server: `list_components`, `get_component` and `get_guide` give coding agents the catalogue, each typed API, usage examples and the design rules.
