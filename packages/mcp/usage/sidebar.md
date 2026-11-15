Use as the primary navigation of an application shell with many destinations.

- A marketing site or an app with a handful of top-level pages: `Navbar`. A temporary side panel: `Drawer`.
- Structure: `SidebarHeader` (brand, `SidebarToggle`), `SidebarContent` with `SidebarGroup`s of `SidebarItem`s, then `SidebarFooter` (account).
- Give every `SidebarItem` an `icon`, since the collapsed rail shows only icons. Mark the current page with `current`.
- `SidebarItem` is a link with `href` and a button without it. Give `SidebarContent` an `aria-label`.
