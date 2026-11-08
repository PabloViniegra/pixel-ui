import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { DateRangePicker } from './DateRangePicker.js';
import '@pablo-v/calendar/style.css';
import '@pablo-v/date-field/style.css';
import '@pablo-v/date-picker/style.css';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import '@pablo-v/pixel-icons/style.css';
import './date-range-picker.css';

const meta = {
  title: 'Forms/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <div style={{ width: 'min(340px, calc(100vw - 32px))' }}>
      <Field label="Billing period" description="Pick the first and last day.">
        <DateRangePicker {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { defaultValue: { start: new Date(2026, 10, 2), end: new Date(2026, 10, 13) } },
};

export const Bounded: Story = {
  args: { min: new Date(2026, 10, 1), max: new Date(2026, 11, 31) },
};
