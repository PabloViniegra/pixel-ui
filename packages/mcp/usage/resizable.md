Use for app layouts where the user adjusts how space is split: editor and preview, list and detail, a log panel.

- Sizes are percentages of the group. Set `defaultSize` and a sensible `minSize` on each `ResizablePanel` so no panel can collapse to nothing.
- Persist the sizes from `onLayout` to restore them later.
- The group needs a defined height (or width) from its parent. Do not use it for page-level responsive layout; use CSS grid.
