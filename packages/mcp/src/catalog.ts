export interface CatalogComponent {
  id: string;
  title: string;
  category: string;
  package: string;
  version: string;
  description: string;
  exports: string[];
  styles: string[];
  usage: string;
  api: string;
  examples: string;
  storybook: string | null;
}

export const guideTopics = ['setup', 'design', 'tokens'] as const;
export type GuideTopic = (typeof guideTopics)[number];

export interface Catalog {
  components: CatalogComponent[];
  guides: Record<GuideTopic, string>;
}

const normalise = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

export function findComponent(catalog: Catalog, name: string): CatalogComponent | undefined {
  const wanted = normalise(name.replace(/^@pablo-v\//, ''));
  return (
    catalog.components.find((c) => normalise(c.id) === wanted || normalise(c.title) === wanted) ??
    catalog.components.find((c) => c.exports.some((e) => normalise(e) === wanted))
  );
}

export function renderList(catalog: Catalog, category?: string): string {
  const wanted = category && normalise(category);
  const components = catalog.components.filter((c) => !wanted || normalise(c.category) === wanted);
  const categories = [...new Set(components.map((c) => c.category))];
  if (categories.length === 0) {
    const known = [...new Set(catalog.components.map((c) => c.category))].join(', ');
    return `No category "${category}". Categories: ${known}.`;
  }
  return categories
    .map((name) => {
      const rows = components
        .filter((c) => c.category === name)
        .map((c) => `- ${c.id} (${c.exports.join(', ')}): ${c.description}`);
      return `## ${name}\n${rows.join('\n')}`;
    })
    .join('\n\n');
}

export function renderComponent(component: CatalogComponent): string {
  const imports = [
    "import '@pablo-v/tokens/styles.css'; // once, at the app root",
    ...component.styles.map((style) => `import '${style}';`),
    `import { ${component.exports.join(', ')} } from '${component.package}';`,
  ];

  const packages = new Set([
    component.package,
    ...component.styles.map((style) => style.split('/').slice(0, 2).join('/')),
    '@pablo-v/tokens',
  ]);

  const sections = [
    `# ${component.title}: ${component.package}@${component.version}`,
    component.description,
    `## Install\n\`\`\`bash\npnpm add ${[...packages].join(' ')}\n\`\`\`\nWith the umbrella package, import the same names from \`@pablo-v/react\` and only \`@pablo-v/react/styles.css\`.`,
    component.usage && `## When and how to use it\n${component.usage}`,
    `## Imports\nImport the listed stylesheets in this order: a component's CSS does not pull in the CSS of the PixelUI parts it renders.\n\`\`\`tsx\n${imports.join('\n')}\n\`\`\``,
    `## API\nType declarations; the JSDoc states defaults and behaviour.\n\`\`\`ts\n${component.api}\n\`\`\``,
  ].filter(Boolean);
  if (component.examples) {
    sections.push(
      `## Examples\nThe component's Storybook stories. Each \`args\` or \`render\` is a supported usage; copy the JSX, not the Storybook scaffolding.\n\`\`\`tsx\n${component.examples}\n\`\`\``,
    );
  }
  if (component.storybook) sections.push(`Live docs: ${component.storybook}`);
  return sections.join('\n\n');
}
