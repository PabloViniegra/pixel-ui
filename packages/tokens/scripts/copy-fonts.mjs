#!/usr/bin/env node
// Copies the Geist Pixel .woff2 files, the variable Geist and Geist Mono fonts
// and the OFL licence from the `geist` npm package into packages/tokens/fonts
// with stable names, each split into <name>.latin.woff2 and <name>.ext.woff2:
//   GeistPixel-Square, -Grid, -Circle, -Triangle, -Line,
//   Geist-Variable, GeistMono-Variable
// It then writes the exact coverage of each .ext file into the unicode-range of
// its face in src/fonts.css.
// The search is path-agnostic so it survives layout changes inside `geist`.
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Blob, Face } from 'harfbuzzjs';
import subsetFont from 'subset-font';

const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(here, '..');
const outDir = join(tokensDir, 'fonts');
const variants = ['Square', 'Grid', 'Circle', 'Triangle', 'Line'];

// The .latin faces in src/fonts.css define the split; the .ext file gets every
// other code point so the pair never loses a glyph.
const cssPath = join(tokensDir, 'src/fonts.css');
let css = readFileSync(cssPath, 'utf8');
const latinRange = css.match(/\.latin\.woff2[^}]*unicode-range:\s*([^;]+);/)?.[1];
if (!latinRange) throw new Error('[pixel-ui] No .latin unicode-range found in src/fonts.css');
const latin = latinRange.split(',').map((range) =>
  range
    .trim()
    .slice(2)
    .split('-')
    .map((hex) => Number.parseInt(hex, 16)),
);
const isLatin = (cp) => latin.some(([from, to = from]) => cp >= from && cp <= to);
let latinChars = '';
let extChars = '';
for (let cp = 0; cp <= 0x10ffff; cp++) {
  if (cp >= 0xd800 && cp <= 0xdfff) continue;
  if (isLatin(cp)) latinChars += String.fromCodePoint(cp);
  else extChars += String.fromCodePoint(cp);
}

/** @param {Uint32Array} codePoints */
function toUnicodeRange(codePoints) {
  const runs = [];
  for (const cp of [...codePoints].sort((a, b) => a - b)) {
    const last = runs.at(-1);
    if (last && cp === last[1] + 1) last[1] = cp;
    else runs.push([cp, cp]);
  }
  const hex = (cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
  return runs
    .map(([from, to]) =>
      from === to ? hex(from) : `${hex(from)}-${to.toString(16).toUpperCase().padStart(4, '0')}`,
    )
    .join(', ');
}

// A range wider than the glyphs in the file makes browsers download it for
// characters it cannot render, so the .ext face lists only what it contains.
/** @param {string} source @param {string} name */
async function split(source, name) {
  const font = readFileSync(source);
  const latinFont = await subsetFont(font, latinChars, { targetFormat: 'woff2' });
  writeFileSync(join(outDir, `${name}.latin.woff2`), latinFont);
  const extFont = await subsetFont(font, extChars, { targetFormat: 'sfnt' });
  const covered = new Face(new Blob(extFont)).collectUnicodes();
  writeFileSync(
    join(outDir, `${name}.ext.woff2`),
    await subsetFont(extFont, extChars, { targetFormat: 'woff2' }),
  );
  const face = new RegExp(`(${name}\\.ext\\.woff2[^}]*unicode-range:)[^;]+;`);
  if (!face.test(css)) throw new Error(`[pixel-ui] No ${name}.ext.woff2 face in src/fonts.css`);
  css = css.replace(face, `$1\n    ${toUnicodeRange(covered)};`);
}

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
for (const entry of readdirSync(outDir)) {
  if (entry.endsWith('.woff2')) rmSync(join(outDir, entry));
}

let copied = 0;
for (const variant of variants) {
  const match = files.find((f) => {
    const name = f.toLowerCase();
    return (
      name.endsWith('.woff2') && name.includes('pixel') && name.includes(variant.toLowerCase())
    );
  });
  if (match) {
    await split(match, `GeistPixel-${variant}`);
    copied++;
  }
}

for (const name of ['Geist-Variable', 'GeistMono-Variable']) {
  const match = files.find((f) => basename(f).toLowerCase() === `${name}.woff2`.toLowerCase());
  if (match) await split(match, name);
  else console.warn(`[pixel-ui] ${name}.woff2 not found in \`geist\`.`);
}

writeFileSync(cssPath, css);

const licence = files.find((f) => /licen[cs]e/i.test(f) && /\.(txt|md)$|LICENSE$/i.test(f));
if (licence) copyFileSync(licence, join(outDir, 'OFL.txt'));

if (copied === variants.length) {
  console.log(`[pixel-ui] Geist Pixel: ${copied} fonts copied to packages/tokens/fonts`);
} else {
  console.warn(
    `[pixel-ui] Geist Pixel: found ${copied}/${variants.length} variants in ${geistRoot}.\n` +
      '  Update the `geist` devDependency and run this script again.',
  );
}
