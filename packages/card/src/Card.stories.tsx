import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card.js';
import './card.css';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { interactive: true },
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardHeader>
        <CardTitle>pixel-ui.vercel.app</CardTitle>
        <CardDescription>Production deployment from main · 2m ago</CardDescription>
      </CardHeader>
      <CardContent>Edge network, 18 regions. Build finished in 41s with zero warnings.</CardContent>
      <CardFooter>
        <span
          style={{ fontFamily: 'var(--pxl-font-mono)', fontSize: 12, color: 'var(--pxl-fg-muted)' }}
        >
          a3f9c21 · feat: pixel cards
        </span>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};

export const Static: Story = { args: { interactive: false } };

export const Highlight: Story = { args: { highlight: true, interactive: false } };
