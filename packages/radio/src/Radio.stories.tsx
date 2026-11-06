import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Radio, RadioGroup } from './Radio.js';
import './radio.css';

const meta = {
  title: 'Forms/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { label: 'Runtime', defaultValue: 'node' },
  argTypes: { orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] } },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="node" label="Node.js" description="Full Node.js APIs, regional." />
      <Radio value="edge" label="Edge" description="Runs close to every visitor." />
      <Radio value="static" label="Static" disabled />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = { args: { orientation: 'horizontal' } };

export const WithError: Story = { args: { defaultValue: undefined, error: 'Choose a runtime.' } };
