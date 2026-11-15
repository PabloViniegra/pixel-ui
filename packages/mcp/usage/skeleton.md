Use as a placeholder that mirrors the layout of content that is about to load: rows, cards, avatars, paragraphs.

- Unknown layout or a short wait: `Loader`. Measurable progress: `Progress`.
- Match the real content's size and shape (`lines` for paragraphs, `radius="full"` for avatars) so nothing jumps when it arrives.
- It is decorative: mark the loading container with `aria-busy`.
