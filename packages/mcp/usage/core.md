Internal helpers the components are built on. Application code rarely needs this package.

- Useful exports for apps: the `PixelSize` (`sm | md | lg`), `PixelTone`, `Side`, `Align` and `Orientation` types, and `cx` for joining class names.
- The hooks (`useFloating`, `useDismiss`, `useModalDialog`, `usePresence`, ...) are for building new PixelUI-style components. Prefer the finished `Popover`, `Dialog`, `Menu` and `Tooltip` over rebuilding them.
