import {
  Badge,
  BarChart,
  Button,
  Checkbox,
  FlipCounter,
  Kbd,
  Loader,
  type LogLine,
  PixelAvatar,
  Progress,
  Slider,
  Sparkline,
  Switch,
  Terminal,
} from '@pablo-v/react';
import { useEffect, useRef, useState } from 'react';

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

const TICKS = 20;
const script: Record<number, Omit<LogLine, 'time'>> = {
  0: { text: 'Cloning acme-web@main' },
  4: { text: 'Installing dependencies' },
  9: { text: 'Compiling 36 packages' },
  14: { level: 'warn', text: 'Using cached fonts' },
  [TICKS]: { level: 'success', text: 'Build completed' },
};
const stamp = (tick: number) => `12:04:${String(Math.floor(tick / 2)).padStart(2, '0')}`;
const linesUpTo = (tick: number): LogLine[] =>
  Object.entries(script)
    .filter(([at]) => Number(at) <= tick)
    .map(([at, line]) => ({ id: at, time: stamp(Number(at)), ...line }));

type Status = 'ready' | 'building' | 'canceled';
const statusBadge = {
  ready: { tone: 'success', label: 'Ready' },
  building: { tone: 'warning', label: 'Building' },
  canceled: { tone: 'neutral', label: 'Canceled' },
} as const;

export function Showcase() {
  const [status, setStatus] = useState<Status>('ready');
  const [tick, setTick] = useState(TICKS);
  const [lines, setLines] = useState(() => linesUpTo(TICKS));
  const [count, setCount] = useState(128);
  const [traffic, setTraffic] = useState(25);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const redeployButton = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearInterval(timer.current), []);

  // Cancel turns natively disabled once a build stops; without this, focus would fall back to <body>.
  const keepFocus = () => {
    if (document.activeElement === cancelButton.current) redeployButton.current?.focus();
  };

  const deploy = () => {
    window.clearInterval(timer.current);
    setStatus('building');
    setTick(0);
    setLines(linesUpTo(0));
    let next = 0;
    timer.current = window.setInterval(() => {
      next += 1;
      setTick(next);
      setLines(linesUpTo(next));
      if (next >= TICKS) {
        window.clearInterval(timer.current);
        keepFocus();
        setStatus('ready');
        setCount((value) => value + 1);
      }
    }, 200);
  };

  const cancel = () => {
    window.clearInterval(timer.current);
    keepFocus();
    setStatus('canceled');
    setLines((current) => [
      ...current,
      { id: 'canceled', time: stamp(tick), level: 'error', text: 'Build canceled' },
    ]);
  };

  const badge = statusBadge[status];
  const building = status === 'building';

  return (
    <>
      <div className="showcase__controls">
        <Switch label="Pause animations" checked={paused} onCheckedChange={setPaused} />
      </div>
      <div className="showcase" data-paused={paused || undefined}>
        <div className="scene">
          <div className="scene__bar">
            <PixelAvatar name="acme-web" size={36} />
            <div className="scene__project">
              <span className="scene__name">acme-web</span>
              <span className="scene__meta">main · production</span>
            </div>
            <Badge tone={badge.tone} dot={building ? 'pulse' : true}>
              {badge.label}
            </Badge>
            <div className="scene__actions">
              <Button ref={cancelButton} variant="secondary" disabled={!building} onClick={cancel}>
                Cancel
              </Button>
              <Button ref={redeployButton} loading={building} onClick={deploy}>
                Redeploy
              </Button>
            </div>
          </div>
          <div className="scene__body">
            <div className="scene__main">
              <Progress
                value={(tick / TICKS) * 100}
                label="Build progress"
                showValue
                tone={status === 'canceled' ? 'neutral' : 'accent'}
              />
              <Terminal title="Build logs" lines={lines} streaming={building} maxHeight={168} />
            </div>
            <div className="scene__side">
              <div className="scene__stat">
                <span className="scene__label">Deploys</span>
                <FlipCounter value={count} minDigits={4} size="sm" />
              </div>
              <div className="scene__charts">
                <figure>
                  <BarChart label="Deploys this week" data={deploys} highlight="max" rows={6} />
                  <figcaption className="scene__label" aria-hidden="true">
                    This week
                  </figcaption>
                </figure>
                <figure>
                  <Sparkline label="Requests per hour" data={requests} cellSize={3} />
                  <figcaption className="scene__label" aria-hidden="true">
                    Requests / h
                  </figcaption>
                </figure>
              </div>
              <div className="scene__settings">
                <Switch label="Preview deployments" defaultChecked />
                <Checkbox label="Notify on failure" defaultChecked />
                <div className="scene__slider">
                  <span className="scene__label" aria-hidden="true">
                    Traffic to preview
                  </span>
                  <Slider
                    aria-label="Traffic to preview"
                    value={traffic}
                    onValueChange={setTraffic}
                    showValue
                    format={(value) => `${value}%`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul className="extras" role="list">
          <li>
            <div className="row">
              <Loader pattern="snake" label="Loading, snake pattern" />
              <Loader pattern="pulse" label="Loading, pulse pattern" />
              <Loader pattern="scan" label="Loading, scan pattern" />
            </div>
            <span className="extras__name">Loader</span>
          </li>
          <li>
            <div className="row">
              <Kbd keys={['⌘', 'K']} />
              <Kbd keys={['Shift', 'Enter']} />
            </div>
            <span className="extras__name">Kbd</span>
          </li>
          <li>
            <div className="row">
              {['ada@lovelace.dev', 'grace@hopper.dev', 'alan@turing.dev'].map((name) => (
                <PixelAvatar key={name} name={name} size={28} />
              ))}
            </div>
            <span className="extras__name">PixelAvatar</span>
          </li>
        </ul>
      </div>
    </>
  );
}
