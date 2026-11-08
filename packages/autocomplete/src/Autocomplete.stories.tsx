import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Autocomplete } from './Autocomplete.js';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import '@pablo-v/pixel-icons/style.css';
import './autocomplete.css';

const regions = [
  { value: 'fra1', label: 'Frankfurt', description: 'fra1 · Germany' },
  { value: 'iad1', label: 'Washington, D.C.', description: 'iad1 · United States' },
  { value: 'hnd1', label: 'Tokyo', description: 'hnd1 · Japan' },
  { value: 'gru1', label: 'São Paulo', description: 'gru1 · Brazil' },
  { value: 'syd1', label: 'Sydney', description: 'syd1 · Australia' },
  { value: 'cpt1', label: 'Cape Town', description: 'cpt1 · South Africa', disabled: true },
];

const meta = {
  title: 'Forms/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { options: regions, placeholder: 'Search regions' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <div style={{ width: 'min(280px, calc(100vw - 32px))' }}>
      <Field label="Function region" description="Accents are optional: try “sao”.">
        <Autocomplete {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: 'hnd1' } };

export const Strings: Story = {
  args: { options: ['Next.js', 'Remix', 'Astro', 'SvelteKit', 'Nuxt'], placeholder: 'Framework' },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: 'fra1' } };
