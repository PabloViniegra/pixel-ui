import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { DatePicker } from './DatePicker.js';
import '@pablo-v/calendar/style.css';
import '@pablo-v/date-field/style.css';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import '@pablo-v/pixel-icons/style.css';
import './date-picker.css';

const meta = {
  title: 'Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <div style={{ width: 'min(280px, calc(100vw - 32px))' }}>
      <Field label="Launch date" description="Type it, or pick it from the calendar.">
        <DatePicker {...args} />
      </Field>
    </div>
  ),
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: new Date(2026, 10, 8) } };

export const WeekdaysOnly: Story = {
  args: {
    min: new Date(),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

export const Invalid: Story = {
  render: (args) => (
    <div style={{ width: 'min(280px, calc(100vw - 32px))' }}>
      <Field label="Launch date" error="Pick a date after today.">
        <DatePicker {...args} defaultValue={new Date(2020, 0, 1)} />
      </Field>
    </div>
  ),
};
