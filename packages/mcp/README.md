# @pablo-v/mcp

MCP server that teaches coding agents the PixelUI catalogue: which components exist, their typed
API, real usage examples and the design rules.

```bash
claude mcp add pixel-ui -- npx -y @pablo-v/mcp
```

Any other MCP client (stdio):

```json
{
  "mcpServers": {
    "pixel-ui": { "command": "npx", "args": ["-y", "@pablo-v/mcp"] }
  }
}
```

| Tool              |                                                                     |
| ----------------- | ------------------------------------------------------------------- |
| `list_components` | The catalogue by category, with exported names and descriptions     |
| `get_component`   | Install, imports, typed API and examples for one or more components |
| `get_guide`       | `setup`, `design` or `tokens`                                       |

The data is generated at build time from the packages' type declarations, their Storybook stories,
`DESIGN.md` and the README, so each release documents the component versions it shipped with.

The "when to use it" guidance is hand-written: one short file per component in `usage/<name>.md`.
Add one when you add a component; the build lists any that are missing.
