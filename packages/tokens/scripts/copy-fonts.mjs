#!/usr/bin/env node
// Copies the Geist Pixel .woff2 files (and the OFL licence) from the `geist`
// npm package into packages/tokens/fonts with stable names:
//   GeistPixel-Square.woff2, -Grid, -Circle, -Triangle, -Line
// The search is path-agnostic so it survives layout changes inside `geist`.
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(here, '..');
const outDir = join(tokensDir, 'fonts');
const variants = ['Square', 'Grid', 'Circle', 'Triangle', 'Line'];

let geistRoot;
try {
  const require = createRequire(join(tokensDir, 'package.json'));
  geistRoot = dirname(require.resolve('geist/package.json'));
} catch {
  console.warn('[pixel-ui] `geist` is not installed yet — skipping font copy.');
  process.exit(0);
}

/** @param {string} dir @param {string[]} acc */
function collect(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry !== 'node_modules') collect(path, acc);
    } else acc.push(path);
  }
  return acc;
}

const files = collect(geistRoot);
mkdirSync(outDir, { recursive: true });

let copied = 0;
for (const variant of variants) {
  const match = files.find((f) => {
    const name = f.toLowerCase();
    return (
      name.endsWith('.woff2') && name.includes('pixel') && name.includes(variant.toLowerCase())
    );
  });
  if (match) {
    copyFileSync(match, join(outDir, `GeistPixel-${variant}.woff2`));
    copied++;
  }
}

const licence = files.find((f) => /licen[cs]e/i.test(f) && /\.(txt|md)$|LICENSE$/i.test(f));
if (licence) copyFileSync(licence, join(outDir, 'OFL.txt'));

if (copied === variants.length) {
  console.log(`[pixel-ui] Geist Pixel: ${copied} fonts copied to packages/tokens/fonts`);
} else {
  console.warn(
    `[pixel-ui] Geist Pixel: found ${copied}/${variants.length} variants in ${geistRoot}.\n` +
      '  Download the .woff2 files from https://github.com/vercel/geist-font/releases/latest\n' +
      '  and place them in packages/tokens/fonts as GeistPixel-<Variant>.woff2',
  );
}
