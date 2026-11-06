import { Button } from '@pablo-v/button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import pkg from '../package.json' with { type: 'json' };
import { PixelTransition, startPixelTransition } from './PixelTransition.js';
import '@pablo-v/button/style.css';
import './pixel-transition.css';

const views = [
  { title: 'Build', body: 'Compiling 128 modules', tone: 'var(--pxl-gray-100)' },
  { title: 'Deploy', body: 'Uploading to 18 regions', tone: 'var(--pxl-accent-subtle)' },
  { title: 'Live', body: 'Serving traffic on pixel-ui.dev', tone: 'var(--pxl-success-subtle)' },
];

const meta = {
  title: 'Signature/PixelTransition',
  component: PixelTransition,
  tags: ['autodocs'],
  parameters: { pixelui: { name: pkg.name, version: pkg.version } },
} satisfies Meta<typeof PixelTransition>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo({ scope }: { scope: 'page' | 'elements' }) {
  const [index, setIndex] = useState(0);
  const view = views[index] ?? views[0];
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <PixelTransition>
        <div
          style={{
            padding: 24,
            borderRadius: 'var(--pxl-radius-lg)',
            border: '1px solid var(--pxl-border)',
            background: view?.tone,
          }}
        >
          <div style={{ fontSize: 'var(--pxl-text-xl)', fontFamily: 'var(--pxl-font-pixel)' }}>
            {view?.title}
          </div>
          <p style={{ margin: '8px 0 0', color: 'var(--pxl-fg-muted)' }}>{view?.body}</p>
        </div>
      </PixelTransition>
      <Button
        variant="secondary"
        style={{ justifySelf: 'start' }}
        onClick={() =>
          startPixelTransition(() => setIndex((i) => (i + 1) % views.length), { scope })
        }
      >
        Next step
      </Button>
    </div>
  );
}

/** Only the card dissolves; the rest of the page uses the default cross-fade. */
export const Region: Story = { render: () => <Demo scope="elements" /> };

/** The whole document dissolves. */
export const Page: Story = { render: () => <Demo scope="page" /> };
