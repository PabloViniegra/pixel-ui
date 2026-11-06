import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tab, TabList, TabPanel, Tabs } from './Tabs.js';

function setup(onValueChange = vi.fn()) {
  render(
    <Tabs defaultValue="logs" onValueChange={onValueChange}>
      <TabList label="Deployment">
        <Tab value="overview">Overview</Tab>
        <Tab value="logs">Logs</Tab>
        <Tab value="source" disabled>
          Source
        </Tab>
        <Tab value="usage">Usage</Tab>
      </TabList>
      <TabPanel value="overview">Overview panel</TabPanel>
      <TabPanel value="logs">Logs panel</TabPanel>
      <TabPanel value="usage">Usage panel</TabPanel>
    </Tabs>,
  );
  return onValueChange;
}

describe('Tabs', () => {
  it('shows the selected panel, labelled by its tab', () => {
    setup();
    const tab = screen.getByRole('tab', { name: 'Logs' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Logs' })).toHaveTextContent('Logs panel');
    expect(screen.queryByText('Overview panel')).not.toBeInTheDocument();
  });

  it('keeps one tab stop and moves selection with arrows, skipping disabled tabs', async () => {
    const onValueChange = setup();
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Logs' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Usage' })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('usage');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Usage panel');

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });
});
