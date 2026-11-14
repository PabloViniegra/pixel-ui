<div align="center">

<a href="https://pabloviniegra.github.io/pixel-ui/">
  <img src="https://www.gitskins.com/api/section/wordmark?username=PabloViniegra&amp;label=PIXEL" alt="PIXEL drawn as a rotating 3D ASCII wordmark in a terminal window" width="100%" />
</a>

### React components with a pixel signature

Greyscale surfaces · one accent · soft rounded shapes · springy motion<br />
set in **Geist Pixel**, with a few 8-bit details.

<br />

[![npm](https://img.shields.io/npm/v/@pablo-v/react?style=flat-square&label=%40pablo-v%2Freact&labelColor=000000&color=0070f3)](https://www.npmjs.com/package/@pablo-v/react)
[![Storybook](https://img.shields.io/badge/storybook-10-ededed?style=flat-square&logo=storybook&logoColor=white&labelColor=000000)](https://pabloviniegra.github.io/pixel-ui/storybook/)
[![TypeScript](https://img.shields.io/badge/typescript-7-ededed?style=flat-square&logo=typescript&logoColor=white&labelColor=000000)](#-why-this-toolchain-typescript-7)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-v4_preset-ededed?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=000000)](#-using-it)
[![Licence](https://img.shields.io/badge/licence-MIT-ededed?style=flat-square&labelColor=000000)](LICENSE)

**[Website](https://pabloviniegra.github.io/pixel-ui/)** &nbsp;▪&nbsp;
**[Storybook](https://pabloviniegra.github.io/pixel-ui/storybook/)** &nbsp;▪&nbsp;
**[npm](https://www.npmjs.com/org/pablo-v)** &nbsp;▪&nbsp;
**[Changelog](.changeset/README.md)**

```bash
pnpm add @pablo-v/react
```

</div>

<br />

## ▪ Highlights

|                                  |                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| **📦 One package per component** | Each with its own semver version and changelog (Changesets). Install only what you use. |
| **📚 Storybook 10**              | Catalogue with theme switcher, a11y checks and a live version table.                    |
| **⚡ TypeScript 7**              | Native Go compiler end to end. No tool in the stack depends on the TS API.              |
| **🌗 Themeable**                 | `data-theme="light" \| "dark"` on any element, every `--pxl-*` token overridable.       |

## ▪ Packages

<table>
<tr><th align="left">Foundations</th><th align="left"></th></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/tokens"><code>@pablo-v/tokens</code></a></td><td>CSS variables, fonts, keyframes, utilities and a Tailwind CSS v4 preset</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/core"><code>@pablo-v/core</code></a></td><td>Shared hooks and helpers (<code>cx</code>, <code>useControllableState</code>, positioning, roving focus)</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/react"><code>@pablo-v/react</code></a></td><td>Umbrella package re-exporting everything</td></tr>

<tr><th align="left">Actions &amp; inputs</th><th></th></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/autocomplete"><code>@pablo-v/autocomplete</code></a></td><td>Combobox that filters a list of options as you type</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/button"><code>@pablo-v/button</code></a></td><td>Button with soft lift, smooth shine, loading dots</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/calendar"><code>@pablo-v/calendar</code></a></td><td>Month calendar grid with keyboard navigation and range selection</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/checkbox"><code>@pablo-v/checkbox</code></a></td><td>Checkbox with indeterminate state and pixel check mark</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/chip"><code>@pablo-v/chip</code></a></td><td>Pill chip that can be toggled or removed</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/date-field"><code>@pablo-v/date-field</code></a></td><td>Segmented date input that follows the locale order</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/date-picker"><code>@pablo-v/date-picker</code></a></td><td>Date field with a pop-up calendar</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/date-range-picker"><code>@pablo-v/date-range-picker</code></a></td><td>Start and end date fields with a pop-up range calendar</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/field"><code>@pablo-v/field</code></a></td><td>Form field wrapper with label, description and error</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/file-upload"><code>@pablo-v/file-upload</code></a></td><td>Drag-and-drop file picker with type, size and count checks</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/input"><code>@pablo-v/input</code></a></td><td>Text input with prefix and suffix slots</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/multi-select"><code>@pablo-v/multi-select</code></a></td><td>Combobox that picks several options shown as chips</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/number-field"><code>@pablo-v/number-field</code></a></td><td>Numeric input with stepper buttons and keyboard increments</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/pin-input"><code>@pablo-v/pin-input</code></a></td><td>Segmented OTP and PIN input with paste and masking</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/radio"><code>@pablo-v/radio</code></a></td><td>Radio group with a pixel dot indicator</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/rating"><code>@pablo-v/rating</code></a></td><td>Star rating on native radios, or a read-only score with fractions</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/select"><code>@pablo-v/select</code></a></td><td>Styled native select</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/slider"><code>@pablo-v/slider</code></a></td><td>Range slider drawn as a track of pixel cells</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/switch"><code>@pablo-v/switch</code></a></td><td><code>role="switch"</code> toggle with fading track and spring thumb</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/textarea"><code>@pablo-v/textarea</code></a></td><td>Multi-line text input with auto-resize</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/time-field"><code>@pablo-v/time-field</code></a></td><td>Segmented time input and a time picker with suggested times</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/toggle"><code>@pablo-v/toggle</code></a></td><td>Toggle button, toggle group and segmented control</td></tr>

<tr><th align="left">Navigation &amp; layout</th><th></th></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/accordion"><code>@pablo-v/accordion</code></a></td><td>Accordion on native details elements</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/breadcrumb"><code>@pablo-v/breadcrumb</code></a></td><td>Breadcrumb trail for nested pages</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/card"><code>@pablo-v/card</code></a></td><td>Rounded card with soft lift and accent highlight border</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/collapsible"><code>@pablo-v/collapsible</code></a></td><td>Single show/hide section on a native details element</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/command-menu"><code>@pablo-v/command-menu</code></a></td><td>⌘K command palette whose results decode in with ScrambleText</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/link"><code>@pablo-v/link</code></a></td><td>Text link with external-link handling</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/menu"><code>@pablo-v/menu</code></a></td><td>Menu and dropdown with keyboard navigation</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/resizable"><code>@pablo-v/resizable</code></a></td><td>Resizable panels with keyboard and pointer handles</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/scroll-area"><code>@pablo-v/scroll-area</code></a></td><td>Focusable scroll container with thin square-thumbed scrollbars</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/separator"><code>@pablo-v/separator</code></a></td><td>Horizontal and vertical separators</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/sidebar"><code>@pablo-v/sidebar</code></a></td><td>Collapsible app sidebar with groups, badges and a current-page cell</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/stepper"><code>@pablo-v/stepper</code></a></td><td>Step progress with pixel-cell connectors</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/tabs"><code>@pablo-v/tabs</code></a></td><td>Tabs with roving focus and a sliding indicator</td></tr>

<tr><th align="left">Overlays</th><th></th></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/alert-dialog"><code>@pablo-v/alert-dialog</code></a></td><td>Confirmation dialog that waits for async confirms</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/context-menu"><code>@pablo-v/context-menu</code></a></td><td>Right-click and Shift+F10 menu built on the menu primitives</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/dialog"><code>@pablo-v/dialog</code></a></td><td>Modal dialog on the native dialog element</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/drawer"><code>@pablo-v/drawer</code></a></td><td>Edge panel on the native dialog element</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/hover-card"><code>@pablo-v/hover-card</code></a></td><td>Rich link preview on hover or keyboard focus</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/popover"><code>@pablo-v/popover</code></a></td><td>Non-modal panel anchored to a trigger</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/tooltip"><code>@pablo-v/tooltip</code></a></td><td>Hover and focus hint anchored to its trigger</td></tr>

<tr><th align="left">Feedback &amp; status</th><th></th></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/alert"><code>@pablo-v/alert</code></a></td><td>Inline status message with tone icon, action and dismiss</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/badge"><code>@pablo-v/badge</code></a></td><td>Status badge with tones and a blinking terminal dot</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/loader"><code>@pablo-v/loader</code></a></td><td>3×3 pixel loader: <code>snake</code>, <code>pulse</code>, <code>scan</code></td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/progress"><code>@pablo-v/progress</code></a></td><td>Segmented bar with staggered fill and an indeterminate comet</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/skeleton"><code>@pablo-v/skeleton</code></a></td><td>Loading placeholders</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/toast"><code>@pablo-v/toast</code></a></td><td>Toast notifications with a pixel countdown</td></tr>

<tr><th align="left">Data display</th><th></th></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/avatar"><code>@pablo-v/avatar</code></a></td><td>Photo avatar with initials fallback, presence status and groups</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/flip-clock"><code>@pablo-v/flip-clock</code></a></td><td>Flip-clock counter and clock with split-flap digits in the pixel font</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/kbd"><code>@pablo-v/kbd</code></a></td><td>Keyboard key and shortcut display</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/mini-chart"><code>@pablo-v/mini-chart</code></a></td><td>Sparklines and bar charts drawn in pixel cells</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/table"><code>@pablo-v/table</code></a></td><td>Data table primitives</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/terminal"><code>@pablo-v/terminal</code></a></td><td>Streaming log viewer with autoscroll, level colours and a block cursor</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/timeline"><code>@pablo-v/timeline</code></a></td><td>Chronological events joined by a rail of pixel cells</td></tr>

<tr><th align="left">Pixel effects</th><th></th></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/pixel-avatar"><code>@pablo-v/pixel-avatar</code></a></td><td>Symmetric pixel identicon generated from a name or email</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/pixel-icons"><code>@pablo-v/pixel-icons</code></a></td><td>16x16 pixel SVG icon set with crisp edges</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/pixel-image"><code>@pablo-v/pixel-image</code></a></td><td>Image that loads as a coarse pixel mosaic and sharpens to full resolution</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/pixel-transition"><code>@pablo-v/pixel-transition</code></a></td><td>Pixel-grid dissolve for the View Transitions API</td></tr>
<tr><td><a href="https://www.npmjs.com/package/@pablo-v/scramble-text"><code>@pablo-v/scramble-text</code></a></td><td>Text that decodes itself from random glyphs</td></tr>
</table>

## ▪ Getting started

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

## ▪ Using it

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

> [!TIP]
> **Next.js:** if you load fonts with `geist/font/sans`, `geist/font/mono` and `geist/font/pixel`, import `@pablo-v/tokens/tokens.css`,
> `motion.css` and `utilities.css` instead of `styles.css`; the tokens read the
> `--font-geist-sans`, `--font-geist-mono` and `--font-geist-pixel-*` variables set by `next/font`.

> [!NOTE]
> **Next.js App Router:** interactive components ship with `"use client"`, so they can be imported
> straight from Server Components.

**Tailwind CSS v4:** add the preset after the tokens to get `font-pixel`, `shadow-pixel`,
`clip-notch`, `pixelated` and `*-pxl-*` utilities that follow the active theme:

```css
@import "tailwindcss";
@import "@pablo-v/tokens/styles.css";
@import "@pablo-v/tokens/tailwind.css";
```

## ▪ Repository layout

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

## ▪ Versioning

Versioning is **independent** per package (see [`.changeset/README.md`](.changeset/README.md)):

1. Change a component and run `pnpm changeset` (pick package + `patch`/`minor`/`major`).
2. Open a PR. CI fails if a package changed without a changeset.
3. On `main`, the release workflow opens a **Version Packages** PR. Merging it bumps only the
   affected packages, writes their `CHANGELOG.md`, publishes them to npm with provenance and
   tags each one (`@pablo-v/button@0.2.0`). The landing page (root) and Storybook
   (`/storybook/`) are redeployed together to GitHub Pages.

Each story shows its package name and version in the corner, and **Versions** in Storybook lists
every package with its latest changelog entry.

## ▪ Why this toolchain (TypeScript 7)

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

## ▪ Project

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://www.gitskins.com/api/section/projects?username=PabloViniegra&amp;theme=github-dark&amp;repos=PabloViniegra/pixel-ui" />
  <img src="https://www.gitskins.com/api/section/projects?username=PabloViniegra&amp;theme=minimal&amp;repos=PabloViniegra/pixel-ui" alt="pixel-ui project card with stars, languages and last update" width="100%" />
</picture>

## ▪ Fonts & licence

Geist, Geist Mono and Geist Pixel are © Vercel, licensed under the SIL Open Font License 1.1; the licence file is
copied next to the fonts. PixelUI code is MIT.

<div align="center">
<br />
<sub>▪ ▪ ▪ &nbsp; made with pixels by <a href="https://github.com/PabloViniegra">@PabloViniegra</a> &nbsp; ▪ ▪ ▪</sub>
</div>
