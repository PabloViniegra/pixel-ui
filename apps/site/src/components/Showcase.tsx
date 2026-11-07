import {
  Badge,
  BarChart,
  Button,
  Checkbox,
  FlipCounter,
  Kbd,
  Loader,
  PixelAvatar,
  Progress,
  Slider,
  Sparkline,
  Switch,
  Terminal,
} from '@pablo-v/react';
import { type ReactNode, useState } from 'react';

const deploys = [
  { label: 'Mon', value: 4 },
  { label: 'Tue', value: 7 },
  { label: 'Wed', value: 5 },
  { label: 'Thu', value: 9 },
  { label: 'Fri', value: 6 },
  { label: 'Sat', value: 2 },
  { label: 'Sun', value: 3 },
];
const requests = [12, 18, 15, 22, 30, 26, 34, 29, 38, 42, 36, 44];
const logs = [
  { time: '12:04:01', text: 'Installing dependencies' },
  { time: '12:04:06', text: 'Compiling 36 packages' },
  { time: '12:04:09', level: 'warn' as const, text: 'Using cached fonts' },
  { time: '12:04:12', level: 'success' as const, text: 'Build completed' },
];
const people = ['ada@lovelace.dev', 'grace@hopper.dev', 'alan@turing.dev', 'linus@torvalds.dev'];

function Tile({ name, wide, children }: { name: string; wide?: boolean; children: ReactNode }) {
  return (
    <figure className="tile" data-wide={wide || undefined}>
      <div className="tile__stage">{children}</div>
      <figcaption className="tile__name">{name}</figcaption>
    </figure>
  );
}

export function Showcase() {
  const [progress, setProgress] = useState(64);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(128);
  const [paused, setPaused] = useState(false);

  const deploy = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCount((value) => value + 1);
    }, 1400);
  };

  return (
    <>
      <div className="showcase__controls">
        <Switch label="Pause animations" checked={paused} onCheckedChange={setPaused} />
      </div>
      <div className="showcase" data-paused={paused || undefined}>
        <Tile name="Button">
          <div className="row">
            <Button loading={loading} onClick={deploy}>
              Deploy
            </Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="ghost">Logs</Button>
          </div>
        </Tile>
        <Tile name="Badge">
          <div className="row">
            <Badge tone="success" dot="pulse">
              Ready
            </Badge>
            <Badge tone="warning">Building</Badge>
            <Badge tone="danger">Failed</Badge>
            <Badge tone="accent">Preview</Badge>
          </div>
        </Tile>
        <Tile name="FlipClock">
          <FlipCounter value={count} minDigits={4} />
        </Tile>
        <Tile name="Progress + Slider" wide>
          <div className="stack">
            <Progress value={progress} label="Build progress" showValue />
            <Slider
              aria-label="Set build progress"
              value={progress}
              onValueChange={setProgress}
              showValue
              format={(value) => `${value}%`}
            />
          </div>
        </Tile>
        <Tile name="Switch + Checkbox">
          <div className="stack">
            <Switch label="Preview deployments" defaultChecked />
            <Checkbox label="Notify on failure" defaultChecked />
          </div>
        </Tile>
        <Tile name="Loader">
          <div className="row">
            <Loader pattern="snake" label="Loading, snake pattern" />
            <Loader pattern="pulse" label="Loading, pulse pattern" />
            <Loader pattern="scan" label="Loading, scan pattern" />
          </div>
        </Tile>
        <Tile name="PixelAvatar">
          <div className="row">
            {people.map((name) => (
              <PixelAvatar key={name} name={name} size={40} />
            ))}
          </div>
        </Tile>
        <Tile name="MiniChart">
          <div className="row row--end">
            <BarChart label="Deploys this week" data={deploys} highlight="max" rows={6} />
            <Sparkline label="Requests per hour" data={requests} cellSize={3} />
          </div>
        </Tile>
        <Tile name="Terminal" wide>
          <Terminal
            title="Build logs"
            lines={logs}
            streaming
            maxHeight={160}
            status={<Badge tone="success">Ready</Badge>}
          />
        </Tile>
        <Tile name="Kbd">
          <div className="row">
            <Kbd keys={['⌘', 'K']} />
            <Kbd keys={['Shift', 'Enter']} />
          </div>
        </Tile>
      </div>
    </>
  );
}
