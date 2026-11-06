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
        <CardTitle>@pablo-v/card</CardTitle>
        <CardDescription>Bordered container with header, content and footer parts.</CardDescription>
      </CardHeader>
      <CardContent>Set interactive when the whole card is a link or a button.</CardContent>
      <CardFooter>
        <span
          style={{ fontFamily: 'var(--pxl-font-mono)', fontSize: 12, color: 'var(--pxl-fg-muted)' }}
        >
          pnpm add @pablo-v/card
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
