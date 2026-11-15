---

name: pixel-ui
description: Build React interfaces with the PixelUI component library (@pablo-v/* packages). Use when a project depends on @pablo-v/react or any @pablo-v/<component> package, when the user asks for a screen, form, dashboard or layout "with PixelUI", or when styling with --pxl-* tokens. Covers choosing components, composing screens and following the design rules, using the pixel-ui MCP server as the source of truth for APIs.
---

# Building UI with PixelUI

PixelUI is a React 19 component library: greyscale surfaces, one blue accent, and pixel details
used as a signature rather than a texture. This skill is the workflow; the `pixel-ui` MCP server
holds the facts (props, examples, tokens) for the installed release. Never write PixelUI props from
memory.

## 1. Get the docs

The MCP server exposes three read-only tools:

| Tool              | Use it for                                                               |
| ----------------- | ------------------------------------------------------------------------ |
| `list_components` | The catalogue by category. Optional `category` filter.                   |
| `get_component`   | Install, imports, typed API and examples. Takes several `names` at once. |
| `get_guide`       | `setup` (install, stylesheets, theming), `design` (rules), `tokens`.     |

If the tools are missing, ask the user to add the server (`claude mcp add pixel-ui -- npx -y @pablo-v/mcp`,
or the equivalent stdio entry `npx -y @pablo-v/mcp` in another client). Until then, read the type
declarations of the component's package; their JSDoc states defaults and behaviour. `<name>` is the
package, not the component: `Dropdown` lives in `@pablo-v/menu`, `SegmentedControl` in
`@pablo-v/toggle`. With individual packages, read `node_modules/@pablo-v/<name>/dist/index.d.ts`.
With the umbrella, `@pablo-v/react/dist/index.d.ts` only re-exports, so follow it to
`node_modules/@pablo-v/react/node_modules/@pablo-v/<name>/dist/index.d.ts` (pnpm) or
`node_modules/@pablo-v/<name>/dist/index.d.ts` (hoisted npm, yarn, bun).

## 2. Workflow

1. **Check the setup once per project.** Look at `package.json` for `@pablo-v/react` (umbrella:
   one `@pablo-v/react/styles.css` import) or individual `@pablo-v/<name>` packages (tokens
   stylesheet at the root plus each component's `style.css`). If nothing is installed or the
   stylesheets are not imported, read `get_guide setup` and fix that first: components render
   unstyled without their stylesheet and the tokens.
2. **Break the screen into parts and map each to a component** with `list_components` and the
   table in section 3. Prefer a PixelUI component over hand-written markup whenever one exists.
3. **Fetch every component you will use in one `get_component` call** and follow its "When and
   how to use it" notes, API and examples. Copy the JSX from the examples, not the Storybook
   scaffolding.
4. **Read `get_guide design` before composing a full screen or writing any custom CSS**, and
   `get_guide tokens` when you need a specific `--pxl-*` variable.
5. **Write the layout glue yourself.** PixelUI has no grid or stack primitives: use the project's
   CSS approach (or the Tailwind preset from the setup guide) with token values only.
6. **Check the result** against section 5, in both themes.

## 3. Choosing between similar components

| Need                                   | Use                                                                                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| One value, short fixed list            | `Select`; 2 to 5 visible options: `RadioGroup`; switching a view or mode: `SegmentedControl`                                             |
| One value, long or searchable list     | `Autocomplete`                                                                                                                           |
| Several values                         | `MultiSelect`; a few visible options: `Checkbox` list                                                                                    |
| On/off                                 | `Switch` if it applies immediately, `Checkbox` if submitted with a form, `Toggle` for a pressed button                                   |
| A date                                 | `DatePicker` by default; `DateField` for typing a known date; `DateRangePicker` for start and end; `Calendar` for an always-visible grid |
| A number                               | `NumberField` for an exact value, `Slider` for an approximate position, `Rating` for stars                                               |
| Short blocking task                    | `Dialog`                                                                                                                                 |
| Confirm a destructive action           | `AlertDialog`                                                                                                                            |
| Long form or detail view over the page | `Drawer`                                                                                                                                 |
| Small non-blocking panel on a control  | `Popover`; a preview of a link target: `HoverCard`; a text hint: `Tooltip`                                                               |
| Actions from a button                  | `Dropdown` (menu); on right-click: `ContextMenu`; global search and commands: `CommandMenu`                                              |
| Feedback that just happened            | `toast()`; a message that stays in place: `Alert`; a field error: `Field error`                                                          |
| Loading                                | `Skeleton` when the layout is known, `Loader` when it is not, `Progress` when measurable, `Button loading` for the action itself         |
| App navigation                         | `Sidebar` for an app shell, `Navbar` for a site, `Tabs` for peer views, `Breadcrumb` for depth, `Stepper` for a fixed sequence           |
| Static label vs interactive pill       | `Badge` vs `Chip`                                                                                                                        |
| A person                               | `Avatar` with a photo, `PixelAvatar` without one                                                                                         |
| Hide optional content                  | `Collapsible` for one section, `Accordion` for several                                                                                   |
| Any icon                               | `@pablo-v/pixel-icons`; do not mix in another icon set                                                                                   |

## 4. Composition patterns

- **Forms:** one text-like control per `Field` with a visible `label`; pass validation messages
  through `Field error`, not on the control. `Checkbox`, `Switch` and `RadioGroup` carry their own
  label. Submit with `<Button type="submit" loading={pending}>`; report a form-level failure with
  `Alert` and success with a toast.
- **Data views:** `Table` is styled primitives only, so sorting, filtering, selection and paging
  are yours. Pair it with `Pagination`, `Checkbox`, `Input` and a `Dropdown` per row; use
  `Skeleton` rows while loading. A list of rich items is cards, not a table.
- **App shell:** `Sidebar` plus a content area, `Breadcrumb` on nested pages, one `<Toaster />`
  near the root, optionally a `CommandMenu` on ⌘K.
- **Overlays:** never open a dialog from a dialog. Dialog content mounts only while open, so keep
  state that must survive outside it.
- **Next.js App Router:** interactive components ship with `"use client"` and can be imported from
  Server Components; handlers and state still need a client component.

## 5. Design rules to check before finishing

These are the ones generated code breaks most often; `get_guide design` has the full set.

- Colours, radii, spacing, type and shadows come from `--pxl-*` tokens (or the `*-pxl-*` Tailwind
  utilities). No hex literals and no in-between spacing values: everything snaps to the 4px unit.
- The accent means state (on, selected, focus, progress). One accent-highlighted element per view,
  no second accent colour, and no large accent fills. Status colours communicate status only.
- One `primary` button per view or section. It is an inverted ink block, not an accent block.
- Geist Pixel is for display and title text only, never body, labels or small sizes, and at most
  one pixel-signature element per component. Signature components (`ScrambleText`, `FlipClock`,
  `PixelImage`, `PixelTransition`) are single deliberate moments, not decoration for every card.
- `shadow-pixel` and `clip-notch` are decorative only, never on interactive controls.
- Surfaces are flat with a 1px border at rest. Do not add resting shadows or restyle component
  internals; change tokens on a container instead.
- Sentence case for labels; no uppercase transforms.
- Theme with `data-theme="light" | "dark"`. Do not hand-write dark-mode overrides for token
  colours.
- Icon-only buttons need an `aria-label`, and navigation is a `Link`, not a `Button`.
