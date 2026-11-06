#!/usr/bin/env node
// Copies the Geist Pixel .woff2 files, the variable Geist and Geist Mono fonts
// and the OFL licence from the `geist` npm package into packages/tokens/fonts
// with stable names:
//   GeistPixel-Square.woff2, -Grid, -Circle, -Triangle, -Line,
//   Geist-Variable.woff2, GeistMono-Variable.woff2
// The search is path-agnostic so it survives layout changes inside `geist`.
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(here, '..');
const outDir = join(tokensDir, 'fonts');
const variants = ['Square', 'Grid', 'Circle', 'Triangle', 'Line'];

let geistRoot;
try {
  const require = createRequire(join(tokensDir, 'package.json'));
  // `geist` does not export its package.json, so resolve a public entry and
  // walk up to the package root.
  geistRoot = dirname(require.resolve('geist/font'));
  while (!existsSync(join(geistRoot, 'package.json'))) geistRoot = dirname(geistRoot);
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

for (const name of ['Geist-Variable.woff2', 'GeistMono-Variable.woff2']) {
  const match = files.find((f) => basename(f).toLowerCase() === name.toLowerCase());
  if (match) copyFileSync(match, join(outDir, name));
  else console.warn(`[pixel-ui] ${name} not found in \`geist\`.`);
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
