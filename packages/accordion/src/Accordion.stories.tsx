import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Accordion, AccordionItem } from './Accordion.js';
import '@pixel-ui/pixel-icons/style.css';
import './accordion.css';

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  argTypes: { type: { control: 'inline-radio', options: ['single', 'multiple'] } },
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 560 }}>
      <AccordionItem title="Build & development settings" meta="Next.js" defaultOpen>
        Framework preset, build command and output directory are detected from your repository.
        Override them only if your project needs a custom setup.
      </AccordionItem>
      <AccordionItem title="Root directory" meta="apps/web">
        The directory your code lives in. Other directories are excluded from the build unless they
        are part of the workspace.
      </AccordionItem>
      <AccordionItem title="Environment variables" meta="12">
        Encrypted at rest. Changes take effect on the next deployment.
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Single: Story = { args: { type: 'single' } };
