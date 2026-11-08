import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Link } from './Link.js';
import '@pablo-v/pixel-icons/style.css';
import './link.css';

const meta = {
  title: 'Navigation/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { href: '#', children: 'Read the deployment guide' },
  argTypes: {
    tone: { control: 'inline-radio', options: ['default', 'muted'] },
    underline: { control: 'inline-radio', options: ['hover', 'always'] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const External: Story = {
  args: { href: 'https://github.com/PabloViniegra/pixel-ui', external: true, children: 'GitHub' },
};

export const InText: Story = {
  render: () => (
    <p style={{ maxWidth: 420, fontFamily: 'var(--pxl-font-sans)', fontSize: 15 }}>
      Builds run on the closest region. <Link href="#">Change the region</Link> or{' '}
      <Link href="#" tone="muted" underline="always">
        learn how caching works
      </Link>
      .
    </p>
  ),
};
