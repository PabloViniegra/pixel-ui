#!/usr/bin/env node
// Scaffolds a new, independently versioned PixelUI component package.
//
//   pnpm new:component tooltip
//   pnpm new:component date-picker --description "Pixel calendar date picker"
//
// Creates packages/<name> (package.json, tsconfig, src/, story, test, README,
// CHANGELOG), registers it in the root tsconfig and in the @pixel-ui/react
// umbrella package. Existing files are never overwritten.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
const descIdx = args.indexOf('--description');
const description = descIdx >= 0 ? args[descIdx + 1] : undefined;

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Usage: pnpm new:component <kebab-case-name> [--description "..."]');
  process.exit(1);
}

const pascal = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
const pkgName = `@pixel-ui/${name}`;
const dir = join(root, 'packages', name);
const umbrella = join(root, 'packages', 'react');

/** @param {string} path @param {string} content */
function write(path, content) {
  if (existsSync(path)) {
    console.log(`  skip   ${path.replace(`${root}/`, '')}`);
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log(`  create ${path.replace(`${root}/`, '')}`);
}

/** @param {string} path @param {(json: any) => void} mutate */
function editJson(path, mutate) {
  if (!existsSync(path)) return;
  const json = JSON.parse(readFileSync(path, 'utf8'));
  mutate(json);
  writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`);
}

/** @param {string} path @param {string} line */
function appendLine(path, line) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  if (!text.includes(line)) writeFileSync(path, `${text.trimEnd()}\n${line}\n`);
}

const json = (o) => `${JSON.stringify(o, null, 2)}\n`;

// ── package files ────────────────────────────────────────────────
write(
  join(dir, 'package.json'),
  json({
    name: pkgName,
    version: '0.0.0',
    description: description ?? `PixelUI ${pascal} component`,
    license: 'MIT',
    type: 'module',
    sideEffects: ['*.css'],
    exports: {
      '.': {
        source: './src/index.ts',
        types: './dist/index.d.ts',
        default: './dist/index.js',
      },
      './style.css': {
        source: `./src/${name}.css`,
        default: `./dist/${name}.css`,
      },
      './package.json': './package.json',
    },
    files: ['dist'],
    scripts: {
      build: 'tsc -b && node ../../scripts/copy-assets.mjs',
      clean: 'rm -rf dist *.tsbuildinfo',
    },
    dependencies: { '@pixel-ui/core': 'workspace:^' },
    peerDependencies: { '@pixel-ui/tokens': 'workspace:^', react: '^19.0.0' },
    publishConfig: { access: 'public' },
  }),
);

write(
  join(dir, 'tsconfig.json'),
  json({
    extends: '../../tsconfig.base.json',
    compilerOptions: { rootDir: 'src', outDir: 'dist' },
    include: ['src'],
    exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
    references: [{ path: '../core' }],
  }),
);

write(join(dir, 'CHANGELOG.md'), `# ${pkgName}\n`);

write(
  join(dir, 'README.md'),
  `# ${pkgName}

${description ?? `PixelUI ${pascal} component.`}

\`\`\`bash
pnpm add ${pkgName} @pixel-ui/tokens
\`\`\`

\`\`\`tsx
import '@pixel-ui/tokens/styles.css';
import '${pkgName}/style.css';
import { ${pascal} } from '${pkgName}';
\`\`\`
`,
);

// ── source files ─────────────────────────────────────────────────
write(
  join(dir, 'src', 'index.ts'),
  `export { ${pascal} } from './${pascal}.js';\nexport type { ${pascal}Props } from './${pascal}.js';\n`,
);

write(
  join(dir, 'src', `${pascal}.tsx`),
  `import { cx } from '@pixel-ui/core';
import type { ComponentPropsWithRef } from 'react';

export interface ${pascal}Props extends ComponentPropsWithRef<'div'> {}

export function ${pascal}({ className, ...rest }: ${pascal}Props) {
  return <div className={cx('pxl-${name}', className)} {...rest} />;
}
`,
);

write(
  join(dir, 'src', `${name}.css`),
  `.pxl-${name} {
  font-family: var(--pxl-font-pixel);
  color: var(--pxl-fg);
}
`,
);

write(
  join(dir, 'src', `${pascal}.stories.tsx`),
  `import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { ${pascal} } from './${pascal}.js';
import './${name}.css';

const meta = {
  title: 'Components/${pascal}',
  component: ${pascal},
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { children: '${pascal}' },
} satisfies Meta<typeof ${pascal}>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`,
);

write(
  join(dir, 'src', `${pascal}.test.tsx`),
  `import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ${pascal} } from './${pascal}.js';

describe('${pascal}', () => {
  it('renders its children', () => {
    render(<${pascal}>hello</${pascal}>);
    expect(screen.getByText('hello')).toBeInTheDocument();
  });
});
`,
);

// ── registrations ────────────────────────────────────────────────
editJson(join(root, 'tsconfig.json'), (j) => {
  const path = `packages/${name}`;
  if (!j.references.some((r) => r.path === path)) {
    const idx = j.references.findIndex((r) => r.path === 'packages/react');
    j.references.splice(idx >= 0 ? idx : j.references.length, 0, { path });
  }
});

if (existsSync(umbrella) && name !== 'react') {
  editJson(join(umbrella, 'package.json'), (j) => {
    j.dependencies[pkgName] = 'workspace:^';
  });
  editJson(join(umbrella, 'tsconfig.json'), (j) => {
    if (!j.references.some((r) => r.path === `../${name}`))
      j.references.push({ path: `../${name}` });
  });
  appendLine(join(umbrella, 'src', 'index.ts'), `export * from '${pkgName}';`);
  appendLine(join(umbrella, 'src', 'styles.css'), `@import "${pkgName}/style.css";`);
}

console.log(`\n✔ ${pkgName} created. Next:
  pnpm install
  pnpm storybook
  pnpm changeset   # describe the first release (minor → 0.1.0)`);
