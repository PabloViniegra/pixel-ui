import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { readExports, readStyles, toExample } from './catalog-source.js';

const root = mkdtempSync(join(tmpdir(), 'pixel-ui-mcp-'));
afterAll(() => rmSync(root, { recursive: true, force: true }));

function writeFiles(dir: string, files: Record<string, string>) {
  mkdirSync(join(root, dir), { recursive: true });
  for (const [name, content] of Object.entries(files))
    writeFileSync(join(root, dir, name), content);
}

function writePackage(dir: string, manifest: object) {
  writeFiles(dir, { 'package.json': JSON.stringify({ name: `@pablo-v/${dir}`, ...manifest }) });
}

describe('readExports', () => {
  writeFiles('icons-dist', {
    'index.d.ts': [
      "export * from './icons.js';",
      "export { type Options, createIcon, type Icon, pixelPath, } from './create.js';",
      "export type { Hidden } from './types.js';",
    ].join('\n'),
    'icons.d.ts': [
      'export declare const CheckIcon: Icon;',
      'export declare const CloseIcon: Icon;',
      'export type IconName = string;',
    ].join('\n'),
  });

  it('lists value exports, following export * and skipping types', () => {
    expect(readExports(join(root, 'icons-dist')).sort()).toEqual([
      'CheckIcon',
      'CloseIcon',
      'createIcon',
      'pixelPath',
    ]);
  });
});

describe('readStyles', () => {
  const css = { exports: { '.': './dist/index.js', './style.css': './dist/style.css' } };
  writePackage('icons', css);
  writePackage('field', { ...css, peerDependencies: { '@pablo-v/icons': '^1.0.0' } });
  writePackage('input', {
    ...css,
    dependencies: { '@pablo-v/field': '^1.0.0', '@pablo-v/tokens': '^1.0.0' },
  });
  writePackage('picker', {
    ...css,
    dependencies: { '@pablo-v/input': '^1.0.0', '@pablo-v/field': '^1.0.0' },
  });
  writePackage('logic', { exports: { '.': './dist/index.js' } });
  writePackage('loop-a', { ...css, dependencies: { '@pablo-v/loop-b': '^1.0.0' } });
  writePackage('loop-b', { ...css, dependencies: { '@pablo-v/loop-a': '^1.0.0' } });

  it('puts dependency stylesheets first, each once, without tokens', () => {
    expect(readStyles(root, 'picker')).toEqual([
      '@pablo-v/icons/style.css',
      '@pablo-v/field/style.css',
      '@pablo-v/input/style.css',
      '@pablo-v/picker/style.css',
    ]);
  });

  it('returns nothing for a package without CSS', () => {
    expect(readStyles(root, 'logic')).toEqual([]);
  });

  it('stops on dependency cycles', () => {
    expect(readStyles(root, 'loop-a')).toEqual([
      '@pablo-v/loop-b/style.css',
      '@pablo-v/loop-a/style.css',
    ]);
  });
});

describe('toExample', () => {
  const story = [
    "import pkg from '../package.json' with { type: 'json' };",
    "import { Dialog } from './Dialog.js';",
    "import './dialog.css';",
    "import '../dialog.stories.css';",
    "import photo from '../assets/photo.webp';",
    'const meta = {',
    "  title: 'Overlays/Dialog',",
    '  parameters: { pixelui: { name: pkg.name, version: pkg.version } },',
    '};',
  ].join('\n');

  it('rewrites relative imports to what an app writes and drops Storybook scaffolding', () => {
    expect(toExample(story, '@pablo-v/dialog')).toBe(
      [
        "import { Dialog } from '@pablo-v/dialog';",
        "import '@pablo-v/dialog/style.css';",
        "import photo from './photo.webp';",
        'const meta = {',
        "  title: 'Overlays/Dialog',",
        '};',
      ].join('\n'),
    );
  });
});
