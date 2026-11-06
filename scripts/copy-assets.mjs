#!/usr/bin/env node
// Copies every .css file from ./src to ./dist, preserving folders.
// Run from a package directory: `node ../../scripts/copy-assets.mjs`
import { cpSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const src = join(root, 'src');
const dist = join(root, 'dist');

if (!existsSync(src)) process.exit(0);

/** @param {string} dir */
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (entry.endsWith('.css')) {
      const target = join(dist, relative(src, path));
      cpSync(path, target);
      console.log(`  css → ${relative(root, target)}`);
    }
  }
}

walk(src);
