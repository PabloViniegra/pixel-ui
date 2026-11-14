import { Field } from '@pablo-v/field';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { TimeField } from './TimeField.js';
import { TimePicker } from './TimePicker.js';
import '@pablo-v/field/style.css';
import '@pablo-v/input/style.css';
import '@pablo-v/pixel-icons/style.css';
import './time-field.css';

const meta = {
  title: 'Forms/TimeField',
  component: TimeField,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { 'aria-label': 'Start time', defaultValue: '09:30', style: { width: 160 } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    hourCycle: { control: 'inline-radio', options: [undefined, 12, 24] },
    granularity: { control: 'inline-radio', options: ['minute', 'second'] },
  },
} satisfies Meta<typeof TimeField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwelveHour: Story = { args: { hourCycle: 12, defaultValue: '14:05' } };

export const Seconds: Story = { args: { granularity: 'second', defaultValue: '23:59:30' } };

export const Picker: Story = {
  render: (args) => (
    <Field
      label="Meeting time"
      description="Office hours, 08:00 to 18:00."
      style={{ maxWidth: 200 }}
    >
      <TimePicker {...args} aria-label={undefined} min="08:00" max="18:00" interval={15} />
    </Field>
  ),
};
