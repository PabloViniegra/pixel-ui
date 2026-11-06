# PixelUI

Minimal React components with a Vercel feel: greyscale surfaces, one accent, soft rounded
shapes and springy motion, with **Geist Pixel** type and a few 8-bit details as the signature.

- **One npm package per component**, each with its own semver version and changelog (Changesets).
- **Storybook 10** catalogue with theme switcher, a11y checks and a live version table.
- **TypeScript 7** (native Go compiler) end to end.

| Package                   | What it is                                                    |
| ------------------------- | ------------------------------------------------------------- |
| `@pixel-ui/tokens`        | CSS variables, Geist Pixel `@font-face`, keyframes, utilities |
| `@pixel-ui/core`          | `cx`, `useControllableState`, `usePrefersReducedMotion`       |
| `@pixel-ui/button`        | Button with soft lift, smooth shine, loading dots             |
| `@pixel-ui/badge`         | Status badge with tones and a blinking terminal dot           |
| `@pixel-ui/switch`        | `role="switch"` toggle with fading track and spring thumb     |
| `@pixel-ui/progress`      | Segmented bar with staggered fill and an indeterminate comet  |
| `@pixel-ui/loader`        | 3×3 pixel loader: `snake`, `pulse`, `scan`                    |
| `@pixel-ui/card`          | Rounded card with soft lift and accent highlight border       |
| `@pixel-ui/scramble-text` | Text that decodes itself from random glyphs                   |
| `@pixel-ui/react`         | Umbrella package re-exporting everything                      |

## Getting started

```bash
pnpm install        # also copies the Geist Pixel fonts into packages/tokens/fonts
pnpm storybook      # http://localhost:6006
```

| Script                      |                                                          |
| --------------------------- | -------------------------------------------------------- |
| `pnpm build`                | Build every package with `tsc -b` (TS7) and copy the CSS |
| `pnpm typecheck`            | Type-check sources, stories and tests                    |
| `pnpm test`                 | Vitest + Testing Library (jsdom)                         |
| `pnpm lint` / `pnpm format` | Biome                                                    |
| `pnpm new:component <name>` | Scaffold a new, independently versioned component        |
| `pnpm changeset`            | Record a version bump for the packages you changed       |

## Using it

```tsx
import '@pixel-ui/tokens/styles.css';
import '@pixel-ui/button/style.css';
import { Button } from '@pixel-ui/button';

<Button variant="primary" loading={isDeploying}>
  Deploy
</Button>;
```

Theme with `data-theme="light" | "dark"` on any element (defaults to the OS setting) and
override any `--pxl-*` token on `:root` or a container.

**Next.js:** if you load fonts with `geist/font/pixel`, import `@pixel-ui/tokens/tokens.css`,
`motion.css` and `utilities.css` instead of `styles.css`; the tokens read the
`--font-geist-pixel-*` variables set by `next/font`.

## Repository layout

```
pixel-ui/
├─ packages/
│  ├─ tokens/          design tokens + fonts (no React)
│  ├─ core/            shared utilities
│  ├─ <component>/     one folder = one npm package
│  │  ├─ src/
│  │  │  ├─ Button.tsx
│  │  │  ├─ button.css           → exported as "@pixel-ui/button/style.css"
│  │  │  ├─ Button.stories.tsx   → picked up by Storybook
│  │  │  └─ Button.test.tsx
│  │  ├─ CHANGELOG.md            → written by Changesets
│  │  └─ package.json            → own version
│  └─ react/           umbrella package
├─ apps/docs/          Storybook (catalogue, foundations, version table)
├─ scripts/            new-component generator, CSS copy
└─ .changeset/         pending version bumps
```

## Versioning

Versioning is **independent** per package (see [`.changeset/README.md`](.changeset/README.md)):

1. Change a component and run `pnpm changeset` (pick package + `patch`/`minor`/`major`).
2. Open a PR. CI fails if a package changed without a changeset.
3. On `main`, the release workflow opens a **Version Packages** PR. Merging it bumps only the
   affected packages, writes their `CHANGELOG.md`, publishes them to npm with provenance and
   tags each one (`@pixel-ui/button@0.2.0`). Storybook is redeployed to GitHub Pages.

Each story shows its package name and version in the corner, and **Versions** in Storybook lists
every package with its latest changelog entry.

## Why this toolchain (TypeScript 7)

TypeScript 7.0 has no programmatic API yet (planned for 7.1), so every tool that imports
`typescript` would break. The stack avoids them:

| Need                  | Tool                                                        | Uses the TS API? |
| --------------------- | ----------------------------------------------------------- | ---------------- |
| Build + `.d.ts`       | `tsc -b` (TS7)                                              | – it _is_ TS7    |
| Storybook prop tables | `react-docgen` (Babel) instead of `react-docgen-typescript` | no               |
| Tests                 | Vitest (Vite transforms)                                    | no               |
| Lint + format         | Biome instead of typescript-eslint                          | no               |

If you later add a tool that needs the API, install TypeScript 6 under an alias alongside 7:
`"typescript-6": "npm:typescript@^6"`.

## Fonts & licence

Geist Pixel is © Vercel, licensed under the SIL Open Font License 1.1; the licence file is
copied next to the fonts. PixelUI code is MIT.
