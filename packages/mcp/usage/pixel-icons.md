Use for every icon in a PixelUI interface, so icons share the 16px grid. Import each icon by name (`SearchIcon`, `GitHubIcon`, ...).

- Without `label` the icon is decorative and hidden from assistive tech. Give `label` only to icons that stand alone; inside a labelled button leave it out.
- `size` in multiples of 16 keeps the pixels crisp. Icons use `currentColor`.
- Animated variants (`SpinnerIcon`, `UploadingIcon`, `BellRingingIcon`, ...) are for live states; use at most one in view. Brand marks are monochrome.
- Missing an icon: author it with `createPixelIcon` from a 16×16 bitmap instead of mixing in another icon set.
