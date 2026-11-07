interface PackageJson {
  name: string;
  description?: string;
  private?: boolean;
}

export interface CatalogEntry {
  title: string;
  description: string;
  storybook: string;
}

export interface CatalogGroup {
  category: string;
  label: string;
  blurb: string;
  entries: CatalogEntry[];
}

const manifests = import.meta.glob<PackageJson>('../../../../packages/*/package.json', {
  eager: true,
  import: 'default',
});
const stories = import.meta.glob<string>('../../../../packages/*/src/*.stories.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const storybookUrl = `${base}/storybook/`;
export const repoUrl = 'https://github.com/PabloViniegra/pixel-ui';

// Same rule Storybook uses to turn a title into a story id.
const toStoryId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const storybookDocs = (id: string) => `${storybookUrl}?path=/docs/${id}--docs`;

const blurbs: Record<string, string> = {
  Components: 'Everyday building blocks: actions, status and feedback.',
  Forms: 'Text entry and selection controls, wired for labels and errors.',
  Navigation: 'Structure and wayfinding for dense product screens.',
  Overlays: 'Floating and modal surfaces with focus management.',
  Signature: 'The deliberate pixel moments that make PixelUI recognisable.',
};
const order = Object.keys(blurbs);

function storyTitle(dir: string): string | undefined {
  const source = Object.entries(stories).find(([path]) => path.includes(`/packages/${dir}/`))?.[1];
  return source?.match(/^\s*title:\s*(['"`])(.+?)\1/m)?.[2];
}

const packages = Object.entries(manifests)
  .map(([path, pkg]) => ({ dir: path.split('/').at(-2) ?? '', ...pkg }))
  .filter((pkg) => !pkg.private);

const entries = packages.flatMap((pkg) => {
  const title = storyTitle(pkg.dir);
  if (!title) return [];
  const [category = 'Components', label = pkg.dir] = title.split('/');
  return [
    {
      category,
      entry: {
        title: label,
        description: pkg.description ?? '',
        storybook: storybookDocs(toStoryId(title)),
      } satisfies CatalogEntry,
    },
  ];
});

export const componentCount = entries.length;

export const catalog: CatalogGroup[] = [...new Set([...order, ...entries.map((e) => e.category)])]
  .map((category) => ({
    category,
    // "Components" would repeat the section heading; Storybook keeps its own title.
    label: category === 'Components' ? 'Essentials' : category,
    blurb: blurbs[category] ?? '',
    entries: entries
      .filter((item) => item.category === category)
      .map((item) => item.entry)
      .sort((a, b) => a.title.localeCompare(b.title)),
  }))
  .filter((group) => group.entries.length > 0);
