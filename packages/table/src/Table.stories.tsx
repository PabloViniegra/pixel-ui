import { Checkbox } from '@pablo-v/checkbox';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableSortDirection,
} from './Table.js';
import '@pablo-v/checkbox/style.css';
import './table.css';

const rows = [
  { id: 'dpl_8kFq2xR', branch: 'main', status: 'Ready', duration: '42s', age: '12m' },
  { id: 'dpl_3nTb7wQ', branch: 'feat/checkout', status: 'Building', duration: '—', age: '1m' },
  { id: 'dpl_9pLm4sZ', branch: 'fix/header', status: 'Error', duration: '18s', age: '2h' },
  { id: 'dpl_1cHv6dK', branch: 'main', status: 'Ready', duration: '39s', age: '1d' },
];

const meta = {
  title: 'Data display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
  subcomponents: { TableHeader, TableRow, TableCell },
  argTypes: { density: { control: 'inline-radio', options: ['default', 'compact'] } },
  render: (args) => (
    <Table {...args} style={{ width: 'min(720px, calc(100vw - 32px))' }}>
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

const usage = [
  { project: 'acme-web', requests: 48210, bandwidth: 12.4 },
  { project: 'docs', requests: 9120, bandwidth: 3.1 },
  { project: 'api', requests: 130450, bandwidth: 0.8 },
  { project: 'blog', requests: 2210, bandwidth: 1.9 },
];

type UsageKey = keyof (typeof usage)[number];

function SortableTable(args: Story['args']) {
  const [sort, setSort] = useState<{ key: UsageKey; direction: TableSortDirection }>({
    key: 'requests',
    direction: 'descending',
  });
  const sorted = [...usage].sort((a, b) => {
    const order = a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0;
    return sort.direction === 'ascending' ? order : -order;
  });
  const header = (key: UsageKey) => ({
    sort: sort.key === key ? sort.direction : ('none' as const),
    onSort: () =>
      setSort({
        key,
        direction: sort.key === key && sort.direction === 'ascending' ? 'descending' : 'ascending',
      }),
  });
  return (
    <Table
      {...args}
      aria-label="Usage by project"
      style={{ width: 'min(560px, calc(100vw - 32px))' }}
    >
      <TableHead>
        <TableRow>
          <TableHeader {...header('project')}>Project</TableHeader>
          <TableHeader align="end" {...header('requests')}>
            Requests
          </TableHeader>
          <TableHeader align="end" {...header('bandwidth')}>
            Bandwidth (GB)
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {sorted.map((r) => (
          <TableRow key={r.project}>
            <TableCell>{r.project}</TableCell>
            <TableCell align="end" mono>
              {r.requests.toLocaleString('en-US')}
            </TableCell>
            <TableCell align="end" mono>
              {r.bandwidth.toFixed(1)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * `onSort` turns a header into a button and `sort` sets its `aria-sort`. The table does not
 * reorder rows: sort your data and pass the new direction back.
 */
export const Sortable: Story = { render: (args) => <SortableTable {...args} /> };

function SelectableTable(args: Story['args']) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['dpl_3nTb7wQ']));
  const all = selected.size === rows.length;
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  return (
    <Table {...args} aria-label="Deployments" style={{ width: 'min(560px, calc(100vw - 32px))' }}>
      <TableHead>
        <TableRow>
          <TableHeader style={{ width: 1 }}>
            <Checkbox
              aria-label="Select all deployments"
              checked={all}
              indeterminate={selected.size > 0 && !all}
              onChange={() => setSelected(all ? new Set() : new Set(rows.map((r) => r.id)))}
            />
          </TableHeader>
          <TableHeader>Deployment</TableHeader>
          <TableHeader>Branch</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id} selected={selected.has(r.id)}>
            <TableCell>
              <Checkbox
                aria-label={`Select ${r.id}`}
                checked={selected.has(r.id)}
                onChange={() => toggle(r.id)}
              />
            </TableCell>
            <TableCell mono>{r.id}</TableCell>
            <TableCell>{r.branch}</TableCell>
            <TableCell>{r.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>
        {selected.size} of {rows.length} selected
      </TableCaption>
    </Table>
  );
}

/**
 * Selection is a checkbox per row plus `TableRow selected` for the highlight. The header
 * checkbox goes `indeterminate` while only some rows are selected.
 */
export const Selectable: Story = { render: (args) => <SelectableTable {...args} /> };
