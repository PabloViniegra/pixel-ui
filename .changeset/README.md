# Changesets

Every PixelUI component is its own npm package with its own version and `CHANGELOG.md`.
Versioning is **independent**: changing `@pablo-v/button` never bumps `@pablo-v/badge`.

```bash
pnpm changeset          # pick the packages you touched + semver bump + summary
pnpm version-packages   # apply pending changesets -> bump versions, write CHANGELOGs
pnpm release            # build + publish changed packages, create git tags like @pablo-v/button@1.2.0
```

The umbrella package `@pablo-v/react` is bumped automatically (patch) when one of its
component dependencies is released.
