Use on pages nested two or more levels deep so the user can move back up the hierarchy.

- Do not use it for steps of a flow (use `Stepper`) or as the main navigation (use `Navbar` or `Sidebar`).
- The last `BreadcrumbItem` is the current page: set `current` and omit `href`.
- With a client router, pass your router link as `children` instead of `href`.
