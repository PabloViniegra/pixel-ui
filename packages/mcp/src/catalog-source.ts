import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string) => readFileSync(path, 'utf8');

interface Manifest {
  name: string;
  exports?: Record<string, unknown>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export const readManifest = (packagesDir: string, dir: string): Manifest =>
  JSON.parse(read(join(packagesDir, dir, 'package.json')));

// A component's CSS does not import the CSS of the PixelUI packages it renders, so an
// app installing packages one by one has to import those stylesheets first.
export function readStyles(packagesDir: string, dir: string, seen = new Set<string>()): string[] {
  if (seen.has(dir)) return [];
  seen.add(dir);
  const pkg = readManifest(packagesDir, dir);
  const inherited = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies })
    .filter((name) => name.startsWith('@pablo-v/') && name !== '@pablo-v/tokens')
    .sort()
    .flatMap((name) => readStyles(packagesDir, name.slice('@pablo-v/'.length), seen));
  const own = Object.keys(pkg.exports ?? {})
    .filter((key) => key.endsWith('.css'))
    .map((key) => `${pkg.name}${key.slice(1)}`);
  return [...inherited, ...own];
}

export function readApi(dist: string): string {
  return readdirSync(dist)
    .filter((file) => file.endsWith('.d.ts'))
    .sort((a, b) => Number(b === 'index.d.ts') - Number(a === 'index.d.ts') || a.localeCompare(b))
    .map((file) => {
      const text = read(join(dist, file))
        .replace(/^\/\/# sourceMappingURL=.*$/m, '')
        .trim();
      return `// ${file}\n${text}`;
    })
    .join('\n\n');
}

export function readExports(dist: string, file = 'index.d.ts'): string[] {
  const source = read(join(dist, file));
  const names: string[] = [];
  for (const [, typeOnly, list = ''] of source.matchAll(/^export (type )?\{([^}]*)\}/gm)) {
    if (typeOnly) continue;
    for (const raw of list.split(',')) {
      const name = raw.trim();
      if (name && !name.startsWith('type ')) names.push(name);
    }
  }
  for (const [, name = ''] of source.matchAll(
    /^export declare (?:const|function|class|enum) (\w+)/gm,
  )) {
    names.push(name);
  }
  for (const [, target = ''] of source.matchAll(/^export \* from '\.\/([\w.-]+)\.js'/gm)) {
    names.push(...readExports(dist, `${target}.d.ts`));
  }
  return [...new Set(names)];
}

// Stories import their own package through relative paths; rewrite them to what an app writes.
export function toExample(story: string, pkgName: string): string {
  return story
    .replace(/^import pkg from '\.\.\/package\.json'.*\n/m, '')
    .replace(/^import '\.\.\/[\w.-]+\.stories\.css';\n/m, '')
    .replace(/pixelui: \{ name: pkg\.name, version: pkg\.version \},?[ ]?/, '')
    .replace(/^\s*parameters: \{\s*\},\n/m, '')
    .replace(/^import '\.\/[\w-]+\.css';$/m, `import '${pkgName}/style.css';`)
    .replace(/from '\.\/[\w.-]+\.js'/g, `from '${pkgName}'`)
    .replace(/from '\.\.\/assets\/([\w.-]+)'/g, "from './$1'")
    .trim();
}
