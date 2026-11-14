import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { FileUpload } from './FileUpload.js';
import '@pablo-v/pixel-icons/style.css';
import './file-upload.css';

const meta = {
  title: 'Forms/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: {
    multiple: true,
    accept: 'image/*,.pdf',
    maxSize: 5 * 1024 * 1024,
    maxFiles: 4,
    hint: 'PNG, JPG or PDF, up to 5 MB each',
    style: { maxWidth: 420 },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFiles: Story = {
  args: {
    defaultValue: [
      new File([new Uint8Array(182_000)], 'invoice-2026-10.pdf', { type: 'application/pdf' }),
      new File([new Uint8Array(2_400_000)], 'screenshot.png', { type: 'image/png' }),
    ],
  },
};

export const Disabled: Story = { args: { disabled: true } };
