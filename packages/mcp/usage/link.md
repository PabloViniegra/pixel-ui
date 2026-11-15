Use for navigation inside text and for standalone text links.

- Triggering an action: use `Button` (`variant="ghost"` for a link-like weight).
- `target="_blank"` or `external` adds the icon, the safe `rel` and the screen-reader hint; do not add those by hand.
- `tone="muted"` in footers and secondary text; `underline="always"` inside paragraphs, where colour alone would not distinguish the link.
- With a client router, keep your router link and give it the `pxl-link` class instead.
