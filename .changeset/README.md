# Changesets

Every PixelUI component is its own npm package with its own version and `CHANGELOG.md`.
Versioning is **independent**: changing `@pixel-ui/button` never bumps `@pixel-ui/badge`.

```bash
pnpm changeset          # pick the packages you touched + semver bump + summary
pnpm version-packages   # apply pending changesets -> bump versions, write CHANGELOGs
pnpm release            # build + publish changed packages, create git tags like @pixel-ui/button@1.2.0
```

The umbrella package `@pixel-ui/react` is bumped automatically (patch) when one of its
component dependencies is released.
