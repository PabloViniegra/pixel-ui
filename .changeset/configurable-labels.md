---
"@pablo-v/dialog": minor
"@pablo-v/drawer": minor
"@pablo-v/number-field": minor
"@pablo-v/toast": minor
"@pablo-v/command-menu": minor
"@pablo-v/file-upload": minor
"@pablo-v/color": minor
"@pablo-v/mcp": patch
---

Add props to translate built-in accessible names: `closeLabel` on `Dialog` and `Drawer`, `incrementLabel` and `decrementLabel` on `NumberField`, `dismissLabel` on `Toaster`, `searchLabel` and `listLabel` on `CommandMenu`, `listLabel` and `removeLabel` (a function of the file name) on `FileUpload`, and `saturationLabel`, `brightnessLabel`, `hueLabel`, `alphaLabel`, `hexLabel` and `presetsLabel` on `ColorPicker`. Error toasts now announce their text with `role="alert"`, so screen readers read them immediately.
