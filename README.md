# PixelUI

Minimal React components with a Vercel feel: greyscale surfaces, one accent, soft rounded
shapes and springy motion, with **Geist Pixel** type and a few 8-bit details as the signature.

- **One npm package per component**, each with its own semver version and changelog (Changesets).
- **Storybook 10** catalogue with theme switcher, a11y checks and a live version table.
- **TypeScript 7** (native Go compiler) end to end.

| Package                     | What it is                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `@pablo-v/tokens`           | CSS variables, fonts, keyframes, utilities and a Tailwind CSS v4 preset            |
| `@pablo-v/core`             | Shared hooks and helpers (`cx`, `useControllableState`, positioning, roving focus) |
| `@pablo-v/accordion`        | Accordion on native details elements                                               |
| `@pablo-v/badge`            | Status badge with tones and a blinking terminal dot                                |
| `@pablo-v/breadcrumb`       | Breadcrumb trail for nested pages                                                  |
| `@pablo-v/button`           | Button with soft lift, smooth shine, loading dots                                  |
| `@pablo-v/card`             | Rounded card with soft lift and accent highlight border                            |
| `@pablo-v/checkbox`         | Checkbox with indeterminate state and pixel check mark                             |
| `@pablo-v/command-menu`     | ⌘K command palette whose results decode in with ScrambleText                       |
| `@pablo-v/dialog`           | Modal dialog on the native dialog element                                          |
| `@pablo-v/field`            | Form field wrapper with label, description and error                               |
| `@pablo-v/flip-clock`       | Flip-clock counter and clock with split-flap digits in the pixel font              |
| `@pablo-v/input`            | Text input with prefix and suffix slots                                            |
| `@pablo-v/kbd`              | Keyboard key and shortcut display                                                  |
| `@pablo-v/loader`           | 3×3 pixel loader: `snake`, `pulse`, `scan`                                         |
| `@pablo-v/menu`             | Menu and dropdown with keyboard navigation                                         |
| `@pablo-v/mini-chart`       | Sparklines and bar charts drawn in pixel cells                                     |
| `@pablo-v/pixel-avatar`     | Symmetric pixel identicon generated from a name or email                           |
| `@pablo-v/pixel-icons`      | 16x16 pixel SVG icon set with crisp edges                                          |
| `@pablo-v/pixel-image`      | Image that loads as a coarse pixel mosaic and sharpens to full resolution          |
| `@pablo-v/pixel-transition` | Pixel-grid dissolve for the View Transitions API                                   |
| `@pablo-v/popover`          | Non-modal panel anchored to a trigger                                              |
| `@pablo-v/progress`         | Segmented bar with staggered fill and an indeterminate comet                       |
| `@pablo-v/radio`            | Radio group with a pixel dot indicator                                             |
| `@pablo-v/scramble-text`    | Text that decodes itself from random glyphs                                        |
| `@pablo-v/select`           | Styled native select                                                               |
| `@pablo-v/separator`        | Horizontal and vertical separators                                                 |
| `@pablo-v/skeleton`         | Loading placeholders                                                               |
| `@pablo-v/slider`           | Range slider drawn as a track of pixel cells                                       |
| `@pablo-v/switch`           | `role="switch"` toggle with fading track and spring thumb                          |
| `@pablo-v/table`            | Data table primitives                                                              |
| `@pablo-v/tabs`             | Tabs with roving focus and a sliding indicator                                     |
| `@pablo-v/terminal`         | Streaming log viewer with autoscroll, level colours and a block cursor             |
| `@pablo-v/textarea`         | Multi-line text input with auto-resize                                             |
| `@pablo-v/toast`            | Toast notifications with a pixel countdown                                         |
| `@pablo-v/tooltip`          | Hover and focus hint anchored to its trigger                                       |
| `@pablo-v/react`            | Umbrella package re-exporting everything                                           |

## Getting started

```bash
pnpm install        # also copies the Geist, Geist Mono and Geist Pixel fonts into packages/tokens/fonts
pnpm storybook      # http://localhost:6006
pnpm site           # landing page, http://localhost:4321/pixel-ui/
```

| Script                      |                                                          |
| --------------------------- | -------------------------------------------------------- |
| `pnpm build`                | Build every package with `tsc -b` (TS7) and copy the CSS |
| `pnpm typecheck`            | Type-check sources, stories and tests                    |
| `pnpm test`                 | Vitest + Testing Library (jsdom)                         |
| `pnpm lint` / `pnpm format` | Biome                                                    |
| `pnpm build-site`           | Build the Astro landing page into `apps/site/dist`       |
| `pnpm new:component <name>` | Scaffold a new, independently versioned component        |
| `pnpm changeset`            | Record a version bump for the packages you changed       |

## Using it

```tsx
import '@pablo-v/tokens/styles.css';
import '@pablo-v/button/style.css';
import { Button } from '@pablo-v/button';

<Button variant="primary" loading={isDeploying}>
  Deploy
</Button>;
```

Theme with `data-theme="light" | "dark"` on any element (defaults to the OS setting) and
override any `--pxl-*` token on `:root` or a container.

**Next.js:** if you load fonts with `geist/font/sans`, `geist/font/mono` and `geist/font/pixel`, import `@pablo-v/tokens/tokens.css`,
`motion.css` and `utilities.css` instead of `styles.css`; the tokens read the
`--font-geist-sans`, `--font-geist-mono` and `--font-geist-pixel-*` variables set by `next/font`.

**Next.js App Router:** interactive components ship with `"use client"`, so they can be imported
straight from Server Components.

**Tailwind CSS v4:** add the preset after the tokens to get `font-pixel`, `shadow-pixel`,
`clip-notch`, `pixelated` and `*-pxl-*` utilities that follow the active theme:

```css
@import "tailwindcss";
@import "@pablo-v/tokens/styles.css";
@import "@pablo-v/tokens/tailwind.css";
```

## Repository layout

```
pixel-ui/
├─ packages/
│  ├─ tokens/          design tokens + fonts (no React)
│  ├─ core/            shared utilities
│  ├─ <component>/     one folder = one npm package
│  │  ├─ src/
│  │  │  ├─ Button.tsx
│  │  │  ├─ button.css           → exported as "@pablo-v/button/style.css"
│  │  │  ├─ Button.stories.tsx   → picked up by Storybook
│  │  │  └─ Button.test.tsx
│  │  ├─ CHANGELOG.md            → written by Changesets
│  │  └─ package.json            → own version
│  └─ react/           umbrella package
├─ apps/docs/          Storybook (catalogue, foundations, version table)
├─ apps/site/          Astro landing page (catalogue, install, docs links)
├─ scripts/            new-component generator, CSS copy
└─ .changeset/         pending version bumps
```

## Versioning

Versioning is **independent** per package (see [`.changeset/README.md`](.changeset/README.md)):

1. Change a component and run `pnpm changeset` (pick package + `patch`/`minor`/`major`).
2. Open a PR. CI fails if a package changed without a changeset.
3. On `main`, the release workflow opens a **Version Packages** PR. Merging it bumps only the
   affected packages, writes their `CHANGELOG.md`, publishes them to npm with provenance and
   tags each one (`@pablo-v/button@0.2.0`). The landing page (root) and Storybook
   (`/storybook/`) are redeployed together to GitHub Pages.

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

Geist, Geist Mono and Geist Pixel are © Vercel, licensed under the SIL Open Font License 1.1; the licence file is
copied next to the fonts. PixelUI code is MIT.
