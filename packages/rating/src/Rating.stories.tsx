import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Rating } from './Rating.js';
import '@pablo-v/pixel-icons/style.css';
import './rating.css';

const meta = {
  title: 'Forms/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { 'aria-label': 'Rate this template', defaultValue: 3 },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'lg'] } },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = { args: { size: 'lg' } };

export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 3.6 } };

export const Disabled: Story = { args: { disabled: true } };
