---
version: alpha
name: PixelUI
description: Minimal React component library with greyscale surfaces, one blue accent and pixel details used as a signature, not as the whole surface.
colors:
  primary: "#0070f3"
  bg: "#ffffff"
  bg-subtle: "#fafafa"
  fg: "#0a0a0a"
  fg-muted: "#666666"
  gray-100: "#f2f2f2"
  gray-200: "#ebebeb"
  gray-300: "#e0e0e0"
  gray-400: "#c9c9c9"
  gray-500: "#a8a8a8"
  gray-600: "#8f8f8f"
  gray-700: "#666666"
  gray-800: "#4d4d4d"
  gray-900: "#171717"
  accent: "#0070f3"
  accent-fg: "#ffffff"
  accent-subtle: "#e9f2ff"
  accent-text: "#0060d1"
  success: "#08863a"
  success-subtle: "#e6f6ec"
  warning: "#b45309"
  warning-subtle: "#fff4e0"
  danger: "#e5001f"
  danger-fg: "#ffffff"
  danger-subtle: "#ffebee"
  border: "#e0e0e0"
  border-strong: "#171717"
typography:
  display:
    fontFamily: Geist Pixel Square
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: 0em
  title:
    fontFamily: Geist Pixel Square
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: 0.01em
  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.01em
  numeric:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1
rounded:
  xs: 2px
  sm: 4px
  md: 6px
  lg: 12px
  full: 9999px
spacing:
  unit: 4px
  space-1: 4px
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-6: 24px
  space-8: 32px
components:
  button-primary:
    backgroundColor: "{colors.fg}"
    textColor: "{colors.bg}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 16px
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 40px
    padding: 16px
  button-ghost:
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
  button-ghost-hover:
    backgroundColor: "{colors.gray-100}"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.danger-fg}"
    rounded: "{rounded.md}"
  button-sm:
    typography: "{typography.label-sm}"
    height: 32px
    padding: 12px
  button-lg:
    height: 48px
    padding: 24px
  badge:
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    height: 22px
    padding: 8px
  badge-accent-subtle:
    backgroundColor: "{colors.accent-subtle}"
    textColor: "{colors.accent-text}"
  switch-track:
    backgroundColor: "{colors.gray-600}"
    rounded: "{rounded.full}"
    width: 44px
    height: 24px
  switch-track-on:
    backgroundColor: "{colors.accent}"
  switch-thumb:
    backgroundColor: "#ffffff"
    rounded: "{rounded.full}"
    size: 16px
  progress-cell:
    backgroundColor: "{colors.gray-200}"
    rounded: "{rounded.xs}"
    height: 12px
  progress-cell-lit:
    backgroundColor: "{colors.accent}"
  progress-value:
    typography: "{typography.numeric}"
    textColor: "{colors.fg}"
  loader-cell:
    rounded: "{rounded.xs}"
    size: 6px
  card:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-title:
    typography: "{typography.title}"
  card-description:
    typography: "{typography.body-sm}"
    textColor: "{colors.fg-muted}"
---

# PixelUI

## Overview

PixelUI is a set of independently versioned React components with a Vercel-like restraint: greyscale surfaces, a single blue accent and generous whitespace. The pixel identity is a **signature, not a texture**. Pixels appear where they carry meaning — display type, segmented progress, the 3×3 loader, decoding text — while every surface, edge, shadow and transition is smooth and quiet. Components should read as calm, precise product UI first, and reveal their 8-bit character in small, deliberate moments.

## Colors

The palette is neutral-first. Greys build every surface and border; colour is reserved for meaning.

- **Accent (`accent`, also `primary`):** the only brand colour. Use it for the "on" state of controls, lit progress, focus rings and a single highlighted element per view. Never as a large fill behind text other than `accent-fg`. Accent-coloured text on `accent-subtle` uses `accent-text`, which keeps small labels above 4.5:1.
- **Foreground (`fg`) on Background (`bg`):** the primary button is an inverted ink block rather than an accent block, which keeps the accent free for state.
- **Greys (`gray-100`–`gray-900`):** `gray-100` for quiet fills (ghost hover, secondary surfaces), `gray-200`/`gray-300` for tracks and resting borders, `gray-900`/`border-strong` only for emphasis borders.
- **Status (`success`, `warning`, `danger`):** each pairs with a `-subtle` tint for low-emphasis badges; solid status fills are for small elements only.
- Every theme scope is overridable through the `--pxl-*` custom properties; components must read colours from tokens, never from literals.

## Themes

Themes are selected with `data-theme="light" | "dark"` on any element and default to the OS setting. Frontmatter holds light values; dark values are:

| Token            | Light     | Dark      |
| ---------------- | --------- | --------- |
| `bg`             | `#ffffff` | `#000000` |
| `bg-subtle`      | `#fafafa` | `#0a0a0a` |
| `fg`             | `#0a0a0a` | `#ededed` |
| `fg-muted`       | `#666666` | `#a1a1a1` |
| `gray-100`       | `#f2f2f2` | `#1a1a1a` |
| `gray-200`       | `#ebebeb` | `#1f1f1f` |
| `gray-300`       | `#e0e0e0` | `#292929` |
| `gray-400`       | `#c9c9c9` | `#2e2e2e` |
| `gray-500`       | `#a8a8a8` | `#454545` |
| `gray-600`       | `#8f8f8f` | `#878787` |
| `gray-700`       | `#666666` | `#8f8f8f` |
| `gray-800`       | `#4d4d4d` | `#a1a1a1` |
| `gray-900`       | `#171717` | `#ededed` |
| `accent`         | `#0070f3` | `#3291ff` |
| `accent-fg`      | `#ffffff` | `#000000` |
| `accent-subtle`  | `#e9f2ff` | `#0a1a33` |
| `accent-text`    | `#0060d1` | `#3291ff` |
| `success`        | `#08863a` | `#3ccf6e` |
| `success-subtle` | `#e6f6ec` | `#0b2615` |
| `warning`        | `#b45309` | `#f5a623` |
| `warning-subtle` | `#fff4e0` | `#2b1d05` |
| `danger`         | `#e5001f` | `#ff4d5e` |
| `danger-fg`      | `#ffffff` | `#000000` |
| `danger-subtle`  | `#ffebee` | `#330a10` |
| `border`         | `#e0e0e0` | `#292929` |
| `border-strong`  | `#171717` | `#ededed` |

In dark mode, elevation comes from lighter borders and surfaces rather than shadows, because dark shadows are invisible on `#000`.

## Typography

Three families with strict roles:

- **Geist (sans):** all interactive text — button labels, badge text, switch labels — plus body and descriptions. Sentence case; no uppercase transforms on labels.
- **Geist Mono:** numeric readouts such as progress percentages, always with tabular figures so values do not jitter.
- **Geist Pixel:** display and title roles only (card titles, hero text, `ScrambleText`). It is never used below the `title` size, where its square glyphs look blurry and crude.

Pixel type is the loudest signal in the system; one pixel-set element per component is the ceiling.

## Layout

All spacing snaps to the 4px `unit`; use the `space-*` steps and avoid in-between values. Component internals use `space-2`–`space-3` for gaps and `space-4`–`space-6` for padding. Control heights are 32 / 40 / 48px for small / medium / large so mixed controls align on one baseline.

## Elevation & Depth

Depth is soft and shallow. Resting surfaces are flat and defined by a 1px `border`; elevation appears only as feedback.

- **Resting:** no shadow; surfaces are defined by a 1px `border`.
- **Hover lift:** translate up by 1px (2px on cards) and add a diffuse, low-opacity shadow (two layers: `0 1px 2px` and `0 4px 12px`, both under 10% black in light mode). Never offset shadows diagonally and never use zero-blur shadows.
- **Pressed:** remove the lift and scale to `0.98`.
- **Dark mode:** shadows are removed; hover strengthens the border to `gray-500`.
- **Floating surfaces:** popovers, menus, toasts, dialogs and the command menu use `shadow-lg`; modal ones sit over the `overlay` veil. Tooltips stay flat with a border.
- **`shadow-pixel`:** a hard 4px offset shadow kept for decorative blocks only (illustrations, empty states, marketing). Never on interactive controls.

## Shapes

Shapes are softly rounded rectangles. Corners use `rounded` tokens via `border-radius`. The `clip-notch` stepped corner (`--pxl-clip-notch`) is decorative only, like `shadow-pixel`: it also clips shadows and focus rings, so it never goes on interactive controls.

- `xs` — pixel cells (progress segments, loader cells, badge dot): the corner is barely softened so cells still read as pixels.
- `sm` — small inline elements and focus-ring insets.
- `md` — buttons and inputs.
- `lg` — cards and containers.
- `full` — pills: badges, switch track and thumb.

Nested shapes use a smaller radius than their parent (outer radius minus inner padding) so curves stay concentric.

## Components

- **Button:** primary is the inverted ink block; secondary is `bg` with a 1px `border`; ghost has no fill until hover. Hover lifts per Elevation; the shine sweep, if kept, is a single smooth gradient pass, not a stepped one. Loading dots are round and fade smoothly.
- **Badge:** pill shape, sentence-case sans label. The status dot is round and its pulse is a smooth opacity breathe, not a hard blink.
- **Switch:** pill track (`gray-600` when off, so the control meets 3:1 against the page) with a round white thumb in both themes (`--pxl-thumb`, with its contact shadow `--pxl-shadow-thumb`); the "on" fill crossfades to `accent` and the thumb travels with the spring ease. No stepped wipe.
- **Progress:** keeps its segmented track as a pixel signature, with `xs`-rounded cells; cells light up with a smooth stagger and the indeterminate comet uses eased opacity, not frames.
- **Loader:** the 3×3 grid is the one place where stepped timing stays, because the frame-by-frame snake is the component's identity.
- **Card:** `lg` radius, 1px `border`, flat at rest; interactive cards lift per Elevation and strengthen the border to `gray-500`. The highlight state is a static `accent` border or soft accent glow, not marching pixels; the title glitch is removed.
- **ScrambleText:** unchanged; it is a deliberate pixel moment set in Geist Pixel.
- **Form controls (Input, Textarea, Select, Checkbox, Radio, Slider):** `md` radius, 1px `border`, 32/40/48px heights; `Field` wires label, description and error with `aria-describedby`. The slider track is a row of `xs` cells, the progress signature reused.
- **Overlays (Dialog, Popover, Tooltip, Menu, Toast):** `lg` radius (tooltip `sm`), `bg` surface with a 1px `border`, floating ones entering with `pxl-float-in` from the side they open on. Dialog sits on the native `<dialog>`; toast shows its timeout as a pixel countdown.
- **Navigation and structure (Tabs, Breadcrumb, Accordion, Table, Separator, Skeleton, Kbd):** quiet greys; tabs slide a 2px `fg` indicator with the spring ease; skeletons use a slow eased sweep.
- **Signature components:** PixelAvatar (symmetric identicon from a hash), PixelImage (mosaic that sharpens), PixelTransition (stepped dither dissolve for the View Transitions API), Terminal (level gutter, block cursor), PixelIcons (16×16, `crispEdges`), CommandMenu (results decode with ScrambleText), mini charts (bars and sparklines in cells) and FlipClock (split-flap digits in Geist Pixel). Each is one deliberate pixel moment.
- **Focus:** every interactive component shows a 2px `accent` ring offset by 2px that follows the element's radius.

## Do's and Don'ts

- Do use smooth easing (ease-out for entrances, the spring ease for movement) for state changes; reserve `steps()` for the loader, `ScrambleText`, the terminal cursor and the PixelTransition dissolve, where frame-by-frame motion is the identity.
- Do keep at most one pixel-signature element per component.
- Do respect `prefers-reduced-motion` by making transitions instant and stopping loops.
- Don't use hard offset shadows (`shadow-pixel`), notched corners (`clip-notch`) or uppercase pixel labels on interactive controls.
- Don't use Geist Pixel for body text, labels or anything below the `title` size.
- Don't introduce a second accent colour; status colours communicate state only.

## Tailwind CSS v4

`@pixel-ui/tokens/tailwind.css` maps the tokens to theme variables with `@theme inline`, so utilities follow the live theme: `font-pixel` (and `font-pixel-grid|circle|triangle|line`), `font-pxl-sans|mono`, `text-pxl-*`, `bg-pxl-*`/`text-pxl-*` colours, `rounded-pxl-*`, `shadow-pixel`, `shadow-pxl-sm|md|lg`, `ease-pxl-*`, plus the `clip-notch` and `pixelated` utilities. The same decorative-only rule applies to `shadow-pixel` and `clip-notch`.
