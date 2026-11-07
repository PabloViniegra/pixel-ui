import { Tab, TabList, TabPanel, Tabs } from '@pablo-v/react';

const managers = [
  { id: 'pnpm', add: 'pnpm add' },
  { id: 'npm', add: 'npm install' },
  { id: 'yarn', add: 'yarn add' },
  { id: 'bun', add: 'bun add' },
];

function Command({ line }: { line: string }) {
  const [bin, ...args] = line.split(' ');
  return (
    <>
      <span className="code__fn">{bin}</span> <span className="code__str">{args.join(' ')}</span>
    </>
  );
}

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
        const lines = [
          '# only what you use',
          `${manager.add} @pablo-v/tokens @pablo-v/button`,
          '',
          '# or every component at once',
          `${manager.add} @pablo-v/react`,
        ];
        const code = lines.join('\n');
        return (
          <TabPanel key={manager.id} value={manager.id} tabIndex={-1}>
            <div className="code">
              <div className="code__bar">
                <span className="code__label">Terminal</span>
                <span className="code__lang" aria-hidden="true">
                  bash
                </span>
                <button
                  type="button"
                  className="code__copy"
                  data-copy={code}
                  data-copy-label={`${manager.id} install commands`}
                >
                  Copy<span className="sr-only"> {manager.id} install commands</span>
                </button>
              </div>
              <pre tabIndex={0} translate="no">
                <code>
                  {lines.map((line, index) => (
                    <span key={line} className="line">
                      {line.startsWith('#') ? (
                        <span className="code__comment">{line}</span>
                      ) : (
                        line && <Command line={line} />
                      )}
                      {index < lines.length - 1 && '\n'}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </TabPanel>
        );
      })}
    </Tabs>
  );
}
