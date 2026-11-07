import { Tab, TabList, TabPanel, Tabs } from '@pablo-v/react';

const managers = [
  { id: 'pnpm', add: 'pnpm add' },
  { id: 'npm', add: 'npm install' },
  { id: 'yarn', add: 'yarn add' },
  { id: 'bun', add: 'bun add' },
];

export function InstallTabs() {
  return (
    <Tabs defaultValue="pnpm" className="install-tabs">
      <TabList label="Package manager">
        {managers.map((manager) => (
          <Tab key={manager.id} value={manager.id}>
            {manager.id}
          </Tab>
        ))}
      </TabList>
      {managers.map((manager) => {
        const code = [
          '# only what you use',
          `${manager.add} @pablo-v/tokens @pablo-v/button`,
          '',
          '# or every component at once',
          `${manager.add} @pablo-v/react`,
        ].join('\n');
        return (
          <TabPanel key={manager.id} value={manager.id} tabIndex={-1}>
            <div className="code">
              <pre tabIndex={0} translate="no">
                <code>{code}</code>
              </pre>
              <button
                type="button"
                className="code__copy"
                data-copy={code}
                data-copy-label={`${manager.id} install commands`}
              >
                Copy<span className="sr-only"> {manager.id} install commands</span>
              </button>
            </div>
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
