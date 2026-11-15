import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  type Catalog,
  findComponent,
  guideTopics,
  renderComponent,
  renderList,
} from './catalog.js';

const instructions = `PixelUI is a React 19 component library published as @pablo-v/* packages.
Before writing UI with it: call list_components to pick components, then get_component for each one
you will use and follow its API and examples instead of guessing props. Read get_guide "setup" once
per project, and "design" before composing screens or writing custom styles.
Prefer a PixelUI component over hand-written markup whenever the catalogue has one.`;

const text = (value: string, isError = false) => ({
  content: [{ type: 'text' as const, text: value }],
  isError,
});

export function createServer(catalog: Catalog, version: string): McpServer {
  const server = new McpServer({ name: 'pixel-ui', version }, { instructions });
  const readOnly = { readOnlyHint: true, openWorldHint: false };

  server.registerTool(
    'list_components',
    {
      title: 'List PixelUI components',
      description:
        'Lists every PixelUI component grouped by category, with its exported names and a one-line description. Start here to choose components.',
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            'Only this category, e.g. "Forms" or "Overlays". Omit for the whole catalogue.',
          ),
      },
      annotations: readOnly,
    },
    ({ category }) => text(renderList(catalog, category)),
  );

  server.registerTool(
    'get_component',
    {
      title: 'Get PixelUI component docs',
      description:
        'Returns install command, imports, full typed API (props with JSDoc) and usage examples for one or more components. Call it before using a component.',
      inputSchema: {
        names: z
          .array(z.string())
          .min(1)
          .describe(
            'Component ids from list_components ("date-picker") or exported names ("DialogClose").',
          ),
      },
      annotations: readOnly,
    },
    ({ names }) => {
      const found = names.map((name) => ({ name, component: findComponent(catalog, name) }));
      const missing = found.filter((item) => !item.component).map((item) => item.name);
      const docs = [...new Set(found.flatMap((item) => item.component ?? []))].map(renderComponent);
      if (missing.length > 0) {
        const ids = catalog.components.map((c) => c.id).join(', ');
        docs.push(`Not found: ${missing.join(', ')}. Available ids: ${ids}.`);
      }
      return text(docs.join('\n\n---\n\n'), missing.length === names.length);
    },
  );

  server.registerTool(
    'get_guide',
    {
      title: 'Get PixelUI guide',
      description:
        'Returns a library-wide guide. "setup": installation, stylesheets, theming, Next.js and Tailwind. "design": the design system rules, design notes per component and what to avoid. "tokens": every --pxl-* CSS variable.',
      inputSchema: { topic: z.enum(guideTopics) },
      annotations: readOnly,
    },
    ({ topic }) => text(catalog.guides[topic]),
  );

  return server;
}
