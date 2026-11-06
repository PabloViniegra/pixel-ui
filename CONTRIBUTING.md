# Contributing to PixelUI

## Adding a component

```bash
pnpm new:component tooltip --description "Pixel tooltip with stepped reveal"
pnpm install
```

This creates `packages/tooltip` at version `0.0.0` with a component, stylesheet, story, test,
README and CHANGELOG, and registers it in the root `tsconfig.json` and in `@pablo-v/react`.
Then add a changeset (`minor`) so its first release is `0.1.0`.

## Component checklist

- [ ] Props extend the native element (`ComponentPropsWithRef<'button'>`) and spread `...rest`.
- [ ] State and variants are exposed as `data-*` attributes; CSS styles those, not extra classes.
- [ ] Class names are `pxl-<component>` / `pxl-<component>__<part>` (BEM-ish).
- [ ] Only `--pxl-*` tokens in CSS; component-private variables are prefixed `--_`.
- [ ] Rounded corners via `--pxl-radius-*`; elevation via `--pxl-shadow-sm|md`, only as hover/float feedback.
- [ ] Movement uses `--pxl-ease-spring` or `--pxl-ease-out`; `steps()` is reserved for the loader and text scramble.
- [ ] Works with `prefers-reduced-motion` (handled globally by `@pablo-v/tokens/motion.css`;
  JS animations use `usePrefersReducedMotion`).
- [ ] Correct role, accessible name and keyboard support; no a11y violations in Storybook.
- [ ] Story sets `parameters.pixelui` from `package.json` so the version badge shows.
- [ ] Tests cover behaviour, not markup.

## Changesets

| Change                                                           | Bump    |
| ---------------------------------------------------------------- | ------- |
| Bug fix, visual polish that keeps the API                        | `patch` |
| New prop, variant or component                                   | `minor` |
| Renamed/removed prop, changed default, changed `data-*` contract | `major` |

While a package is `0.x`, breaking changes go in `minor`.
