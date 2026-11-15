#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  readApi,
  readExports,
  readManifest,
  readStyles,
  toExample,
} from '../dist/catalog-source.js';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..', '..');
const packagesDir = join(root, 'packages');
const storybookUrl = 'https://pabloviniegra.github.io/pixel-ui/storybook/';

const skipped = new Set(['mcp', 'react', 'tokens']);

const read = (path) => readFileSync(path, 'utf8');

// Same rule Storybook uses to turn a title into a story id.
const toStoryId = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

function readComponent(dir) {
  const base = join(packagesDir, dir);
  const manifestPath = join(base, 'package.json');
  if (skipped.has(dir) || !existsSync(manifestPath)) return [];
  const pkg = readManifest(packagesDir, dir);
  if (pkg.private) return [];

  const dist = join(base, 'dist');
  if (!existsSync(join(dist, 'index.d.ts'))) {
    throw new Error(`${pkg.name} has no dist/index.d.ts. Build the components first: pnpm build`);
  }

  const usagePath = join(here, '..', 'usage', `${dir}.md`);
  const src = join(base, 'src');
  const stories = readdirSync(src)
    .filter((file) => file.endsWith('.stories.tsx'))
    .sort()
    .map((file) => read(join(src, file)));
  const storyTitle = stories[0]?.match(/^\s*title:\s*(['"`])(.+?)\1/m)?.[2];
  const [category = 'Foundations', title = dir] = storyTitle?.split('/') ?? [];

  return [
    {
      id: dir,
      title,
      category,
      package: pkg.name,
      version: pkg.version,
      description: pkg.description ?? '',
      exports: readExports(dist),
      styles: readStyles(packagesDir, dir),
      usage: existsSync(usagePath) ? read(usagePath).trim() : '',
      api: readApi(dist),
      examples: stories.map((story) => toExample(story, pkg.name)).join('\n\n'),
      storybook: storyTitle ? `${storybookUrl}?path=/docs/${toStoryId(storyTitle)}--docs` : null,
    },
  ];
}

function readmeSection(heading) {
  const lines = read(join(root, 'README.md')).split('\n');
  const start = lines.findIndex((line) => line.startsWith('## ') && line.includes(heading));
  if (start < 0) throw new Error(`README.md has no "${heading}" section`);
  const length = lines.slice(start + 1).findIndex((line) => line.startsWith('## '));
  return lines
    .slice(start + 1, length < 0 ? undefined : start + 1 + length)
    .join('\n')
    .trim();
}

const setup = `# Setting up PixelUI

React 19 components. Pick one way to install:

- Everything: \`pnpm add @pablo-v/react\`, then \`import '@pablo-v/react/styles.css'\` once
  (tokens plus every component stylesheet) and import components from \`@pablo-v/react\`.
- Per component: \`pnpm add @pablo-v/<name> @pablo-v/tokens\`, then import
  \`@pablo-v/tokens/styles.css\` once and each \`@pablo-v/<name>/style.css\` next to its component.

Components are unstyled without their stylesheet and the tokens.

${readmeSection('Using it')}`;

const tokens = `# PixelUI tokens

Every value is a \`--pxl-*\` custom property from \`@pablo-v/tokens\`. Use these variables (or the
Tailwind preset utilities described in the design guide) instead of literal colours, radii or
durations, and override them on \`:root\` or any container to re-theme.

\`\`\`css
${read(join(packagesDir, 'tokens', 'src', 'tokens.css')).trim()}
\`\`\``;

const catalog = {
  components: readdirSync(packagesDir).sort().flatMap(readComponent),
  guides: { setup, design: read(join(root, 'DESIGN.md')).trim(), tokens },
};

const out = join(here, '..', 'dist', 'catalog.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(catalog));
console.log(`  catalog → dist/catalog.json (${catalog.components.length} components)`);

const unguided = catalog.components.filter((component) => !component.usage).map((c) => c.id);
if (unguided.length > 0) {
  console.warn(`  no usage guide (packages/mcp/usage/<name>.md) for: ${unguided.join(', ')}`);
}
