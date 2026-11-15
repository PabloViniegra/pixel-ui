Use as the generated avatar for users or entities without a photo; the same `name` always draws the same image.

- When photos exist, use `Avatar` and pass a `PixelAvatar` as its `fallback`.
- Seed it with a stable id or email, not a display name the user can change.
- Pass `label=""` when the name is shown next to it, so it is not read twice.
