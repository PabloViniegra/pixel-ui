import type { Meta, StoryObj } from '@storybook/react-vite';
import pkg from '../package.json' with { type: 'json' };
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table.js';
import './table.css';

const rows = [
  { id: 'dpl_8kFq2xR', branch: 'main', status: 'Ready', duration: '42s', age: '12m' },
  { id: 'dpl_3nTb7wQ', branch: 'feat/checkout', status: 'Building', duration: '—', age: '1m' },
  { id: 'dpl_9pLm4sZ', branch: 'fix/header', status: 'Error', duration: '18s', age: '2h' },
  { id: 'dpl_1cHv6dK', branch: 'main', status: 'Ready', duration: '39s', age: '1d' },
];

const meta = {
  title: 'Navigation/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  argTypes: { density: { control: 'inline-radio', options: ['default', 'compact'] } },
  render: (args) => (
    <Table {...args} style={{ maxWidth: 720 }}>
      <TableCaption>Deployments of acme-web in the last 24 hours.</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeader>Deployment</TableHeader>
          <TableHeader>Branch</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader align="end">Duration</TableHeader>
          <TableHeader align="end">Age</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={r.id} selected={i === 1}>
            <TableCell mono>{r.id}</TableCell>
            <TableCell>{r.branch}</TableCell>
            <TableCell>{r.status}</TableCell>
            <TableCell align="end" mono>
              {r.duration}
            </TableCell>
            <TableCell align="end" mono>
              {r.age}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Compact: Story = { args: { density: 'compact' } };
