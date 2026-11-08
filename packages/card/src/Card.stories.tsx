import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLink,
  CardTitle,
} from './Card.js';
import './card.css';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardHeader>
        <CardTitle>@pablo-v/card</CardTitle>
        <CardDescription>Bordered container with header, content and footer parts.</CardDescription>
      </CardHeader>
      <CardContent>Add a CardLink when the whole card should be clickable.</CardContent>
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

export const Static: Story = {};

export const Linked: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardHeader>
        <CardTitle>
          <CardLink href="#card">@pablo-v/card</CardLink>
        </CardTitle>
        <CardDescription>The title link covers the whole card.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const PixelTitle: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardHeader>
        <CardTitle pixel>@pablo-v/card</CardTitle>
        <CardDescription>Pixel titles are for one featured card per view.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const Highlight: Story = { args: { highlight: true } };
