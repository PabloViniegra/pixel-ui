import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import { Tab, TabList, TabPanel, Tabs } from './Tabs.js';
import './tabs.css';

const panel = { color: 'var(--pxl-fg-muted)', margin: 0 };

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  args: { defaultValue: 'deployments' },
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
  render: (args) => (
    <Tabs {...args} style={{ maxWidth: 560 }}>
      <TabList label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="deployments">Deployments</Tab>
        <Tab value="analytics">Analytics</Tab>
        <Tab value="storage" disabled>
          Storage
        </Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="overview">
        <p style={panel}>Production is healthy. Last deployment 12 minutes ago.</p>
      </TabPanel>
      <TabPanel value="deployments">
        <p style={panel}>214 deployments across 3 environments.</p>
      </TabPanel>
      <TabPanel value="analytics">
        <p style={panel}>48.2k page views in the last 7 days.</p>
      </TabPanel>
      <TabPanel value="settings">
        <p style={panel}>Build, domains and environment variables.</p>
      </TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = { args: { orientation: 'vertical' } };
