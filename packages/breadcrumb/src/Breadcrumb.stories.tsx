import { FolderIcon, HomeIcon } from '@pablo-v/pixel-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb.js';
import '@pablo-v/pixel-icons/style.css';
import './breadcrumb.css';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  subcomponents: { BreadcrumbItem },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#" icon={<HomeIcon />}>
        acme
      </BreadcrumbItem>
      <BreadcrumbItem href="#" icon={<FolderIcon />}>
        web
      </BreadcrumbItem>
      <BreadcrumbItem href="#">Deployments</BreadcrumbItem>
      <BreadcrumbItem current>dpl_8kFq2xR</BreadcrumbItem>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Long trails wrap onto several lines instead of overflowing. */
export const LongTrail: Story = {
  render: (args) => (
    <div style={{ maxWidth: 280 }}>
      <Breadcrumb {...args}>
        <BreadcrumbItem href="#">acme</BreadcrumbItem>
        <BreadcrumbItem href="#">web</BreadcrumbItem>
        <BreadcrumbItem href="#">Settings</BreadcrumbItem>
        <BreadcrumbItem href="#">Environment variables</BreadcrumbItem>
        <BreadcrumbItem current>Production</BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
};

/** Translate the landmark name with `label`. */
export const CustomLabel: Story = {
  args: { label: 'Ruta de navegación' },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#">Inicio</BreadcrumbItem>
      <BreadcrumbItem current>Despliegues</BreadcrumbItem>
    </Breadcrumb>
  ),
};
