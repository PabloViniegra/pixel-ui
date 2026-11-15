import { describe, expect, it } from 'vitest';
import { type Catalog, findComponent, renderComponent, renderList } from './catalog.js';

const catalog: Catalog = {
  components: [
    {
      id: 'dialog',
      title: 'Dialog',
      category: 'Overlays',
      package: '@pablo-v/dialog',
      version: '1.2.0',
      description: 'Modal dialog',
      exports: ['Dialog', 'DialogClose'],
      styles: ['@pablo-v/pixel-icons/style.css', '@pablo-v/dialog/style.css'],
      usage: 'Use for a short, focused task.',
      api: 'export declare function Dialog(): void;',
      examples: '<Dialog title="Hi" />',
      storybook: 'https://example.test/dialog',
    },
    {
      id: 'date-picker',
      title: 'DatePicker',
      category: 'Forms',
      package: '@pablo-v/date-picker',
      version: '0.1.0',
      description: 'Date field with a calendar',
      exports: ['DatePicker'],
      styles: ['@pablo-v/date-picker/style.css'],
      usage: '',
      api: '',
      examples: '',
      storybook: null,
    },
  ],
  guides: { setup: '', design: '', tokens: '' },
};

describe('findComponent', () => {
  it.each([
    ['date-picker', 'date-picker'],
    ['DatePicker', 'date-picker'],
    ['Date Picker', 'date-picker'],
    ['@pablo-v/dialog', 'dialog'],
    ['DialogClose', 'dialog'],
  ])('resolves %s', (name, id) => {
    expect(findComponent(catalog, name)?.id).toBe(id);
  });

  it('returns undefined for an unknown name', () => {
    expect(findComponent(catalog, 'carousel')).toBeUndefined();
  });
});

describe('renderList', () => {
  it('groups components by category', () => {
    const list = renderList(catalog);
    expect(list).toContain('## Overlays\n- dialog (Dialog, DialogClose): Modal dialog');
    expect(list).toContain('## Forms');
  });

  it('filters by category regardless of case', () => {
    const list = renderList(catalog, 'forms');
    expect(list).toContain('date-picker');
    expect(list).not.toContain('dialog');
  });

  it('names the valid categories when the filter matches nothing', () => {
    expect(renderList(catalog, 'Charts')).toBe(
      'No category "Charts". Categories: Overlays, Forms.',
    );
  });
});

describe('renderComponent', () => {
  it('shows the imports an app needs', () => {
    const [dialog] = catalog.components;
    if (!dialog) throw new Error('fixture is empty');
    const doc = renderComponent(dialog);
    expect(doc).toContain("import '@pablo-v/dialog/style.css';");
    expect(doc).toContain("import '@pablo-v/pixel-icons/style.css';");
    expect(doc).toContain(
      "import '@pablo-v/pixel-icons/style.css';\nimport '@pablo-v/dialog/style.css';",
    );
    expect(doc).toContain("import { Dialog, DialogClose } from '@pablo-v/dialog';");
  });

  it('installs every package whose stylesheet it imports', () => {
    const [dialog] = catalog.components;
    if (!dialog) throw new Error('fixture is empty');
    expect(renderComponent(dialog)).toContain(
      'pnpm add @pablo-v/dialog @pablo-v/pixel-icons @pablo-v/tokens',
    );
  });

  it('puts the usage guidance before the API and omits the heading without one', () => {
    const [dialog, datePicker] = catalog.components;
    if (!dialog || !datePicker) throw new Error('fixture is incomplete');
    const doc = renderComponent(dialog);
    expect(doc.indexOf('Use for a short, focused task.')).toBeLessThan(doc.indexOf('## API'));
    expect(renderComponent(datePicker)).not.toContain('## When and how to use it');
  });
});
