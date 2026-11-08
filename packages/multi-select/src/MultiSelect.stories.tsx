import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { MultiSelect } from './MultiSelect.js';
import '@pablo-v/autocomplete/style.css';
import '@pablo-v/chip/style.css';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import '@pablo-v/pixel-icons/style.css';
import './multi-select.css';

const environments = [
  { value: 'production', label: 'Production' },
  { value: 'preview', label: 'Preview' },
  { value: 'development', label: 'Development' },
  { value: 'staging', label: 'Staging', description: 'Custom environment' },
  { value: 'qa', label: 'QA', description: 'Custom environment' },
  { value: 'legacy', label: 'Legacy', disabled: true },
];

const meta = {
  title: 'Forms/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { options: environments, placeholder: 'Select environments' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <div style={{ width: 'min(340px, calc(100vw - 32px))' }}>
      <Field label="Environments" description="The variable is exposed in each one.">
        <MultiSelect {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValues: Story = { args: { defaultValue: ['production', 'preview'] } };

export const Wrapping: Story = {
  args: { defaultValue: ['production', 'preview', 'development', 'staging', 'qa'] },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: ['production'] } };
