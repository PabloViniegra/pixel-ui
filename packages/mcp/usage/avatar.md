Use to represent a person or team with their photo.

- Always pass the real `name`: it is the accessible name and the source of the initials shown while the image loads or when it fails.
- No photo at all for most users: pass a `PixelAvatar` as `fallback`, or use `PixelAvatar` directly.
- `status` is for live presence only. Use `AvatarGroup` with `max` for stacks and give the group the same `size` as its avatars.
- `shape="square"` for organisations, teams and apps; the default circle for people.
