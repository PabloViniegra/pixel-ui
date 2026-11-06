# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

React developers at large who install components from public npm. They are building their own product UI and want ready-made, accessible components with a distinctive character instead of a blank, generic kit.

## Product Purpose

PixelUI is an open-source React component library (button, badge, switch, progress, loader, card, scramble-text) plus design tokens. Success means a developer can drop a component into a production interface and it looks calm and finished next to the rest of their product, while still being recognisably PixelUI.

## Positioning

Sober, Vercel-style product UI where the pixel/8-bit character is a subtle signature: pixel display type, the segmented progress, the 3×3 loader, decoding text and small motion moments. The pixel touch is an accent on top of precise product UI, never the whole surface.

## Operating Context

- Consumed as one npm package per component (`@pixel-ui/<name>`), each independently versioned with Changesets, or all at once via `@pixel-ui/react`.
- Styling is plain CSS with overridable `--pxl-*` custom properties, imported per component (`@pixel-ui/<name>/style.css`).
- Developers evaluate and browse components in the Storybook catalogue (`apps/docs`), which shows each package's version and changelog.

## Capabilities and Constraints

- Must work in Next.js, including fonts loaded via `next/font` (`geist/font/pixel`); tokens read the `--font-geist-*` variables.
- Theming via `data-theme="light" | "dark"` on any element, defaulting to the OS setting.
- Toolchain is TypeScript 7 (no programmatic TS API): `tsc -b`, Vitest, Biome, react-docgen.

## Brand Commitments

- Name: PixelUI; npm scope `@pixel-ui`.
- Geist Pixel (SIL OFL 1.1, © Vercel) is the signature typeface; PixelUI code is MIT.

## Evidence on Hand

No users, testimonials, adoption figures or case studies exist yet; future work must not fabricate them.

## Product Principles

1. Product UI first, pixel second: every component must sit comfortably in a serious interface.
2. The pixel signature is deliberate and scarce, used where it carries meaning.
3. Install only what you use: each component stands alone.
4. Accessible by default, not as an option.

## Accessibility & Inclusion

WCAG 2.2 AA is mandatory for every component: contrast, keyboard operation, correct roles and labels, and `prefers-reduced-motion` support.
