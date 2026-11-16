import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { SearchInput } from './SearchInput.js';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import './search-input.css';

const meta = {
  title: 'Forms/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { placeholder: 'Search projects', 'aria-label': 'Search projects' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    prefix: { control: false },
    onValueChange: { control: false },
    onClear: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(320px, calc(100vw - 32px))' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The clear button appears once there is text. Escape clears it too. */
export const WithValue: Story = { args: { defaultValue: 'acme' } };

const projects = ['acme-web', 'acme-api', 'docs', 'blog', 'status-page'];

/** Controlled with `value` and `onValueChange` to filter a list as the user types. */
export const Filtering: Story = {
  render: function Render(args) {
    const [query, setQuery] = useState('');
    const matches = projects.filter((p) => p.includes(query.trim().toLowerCase()));
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <SearchInput {...args} value={query} onValueChange={setQuery} />
        <ul style={{ margin: 0, paddingInlineStart: 20 }}>
          {matches.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p role="status" style={{ margin: 0, fontSize: 12 }}>
          {matches.length} of {projects.length} projects
        </p>
      </div>
    );
  },
};

export const InField: Story = {
  render: (args) => (
    <Field label="Search" description="Matches project names and domains.">
      <SearchInput {...args} aria-label={undefined} />
    </Field>
  ),
};

/** Translate the clear button with `clearLabel`. */
export const CustomLabel: Story = {
  args: {
    defaultValue: 'acme',
    placeholder: 'Buscar proyectos',
    'aria-label': 'Buscar proyectos',
    clearLabel: 'Borrar búsqueda',
  },
};
