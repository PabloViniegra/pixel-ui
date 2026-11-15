# Agent rules

## Republish the MCP server with every component release

`@pablo-v/mcp` ships a snapshot of every component's API, examples and usage guide, built at
release time. It only depends on the components as a devDependency, so Changesets never bumps it
on its own and npm would keep serving stale docs.

- Every changeset that bumps a component package must also bump `"@pablo-v/mcp": patch`. Use
  `minor` when the change adds a component.
- A new component also needs its usage guide in `packages/mcp/usage/<name>.md`; the MCP build
  lists components that have none.
- If a component's props or recommended usage change, update its usage guide in the same change.
