import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { DateField } from './DateField.js';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import './date-field.css';

const meta = {
  title: 'Forms/DateField',
  component: DateField,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <div style={{ width: 'min(280px, calc(100vw - 32px))' }}>
      <Field label="Launch date" description="Type the date or use the arrow keys.">
        <DateField {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: new Date(2026, 10, 8) } };

export const Spanish: Story = {
  args: {
    locale: 'es-ES',
    segmentLabels: { day: 'Día', month: 'Mes', year: 'Año' },
    placeholders: { day: 'dd', month: 'mm', year: 'aaaa' },
  },
};

export const Disabled: Story = { args: { disabled: true, defaultValue: new Date(2026, 10, 8) } };
