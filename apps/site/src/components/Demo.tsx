import {
  Accordion,
  AccordionItem,
  Alert,
  AlertDialog,
  Autocomplete,
  Badge,
  BarChart,
  BellIcon,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  CodeIcon,
  ColorPicker,
  type CommandItem,
  CommandMenu,
  CopyIcon,
  DateRangePicker,
  DownloadIcon,
  Drawer,
  DrawerClose,
  Dropdown,
  EyeIcon,
  Field,
  FolderIcon,
  GlobeIcon,
  GridIcon,
  HelpIcon,
  HomeIcon,
  Input,
  Link,
  ListIcon,
  type LogLine,
  LogoutIcon,
  MenuGroup,
  MenuItem,
  MenuSeparator,
  MoreIcon,
  MultiSelect,
  NumberField,
  Pagination,
  PixelAvatar,
  PixelImage,
  PixelTransition,
  Popover,
  Progress,
  Radio,
  RadioGroup,
  RefreshIcon,
  ScrambleText,
  SearchIcon,
  SegmentedControl,
  Select,
  Separator,
  SettingsIcon,
  ShareIcon,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarItem,
  SidebarToggle,
  Skeleton,
  Sparkline,
  Stepper,
  type StepperStep,
  startPixelTransition,
  Tab,
  TabList,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TabPanel,
  Tabs,
  Terminal,
  TerminalIcon,
  Textarea,
  Timeline,
  TimelineItem,
  Toaster,
  Toolbar,
  ToolbarButton,
  Tooltip,
  TrashIcon,
  toast,
  UserIcon,
} from '@pablo-v/react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';

type View = 'overview' | 'deployments' | 'settings';
type Env = 'production' | 'preview';
type State = 'ready' | 'building' | 'error';
type Layout = 'list' | 'grid';

interface Deployment {
  commit: string;
  branch: string;
  env: Env;
  state: State;
  duration: string;
  author: string;
}

const PAGE_SIZE = 4;
const authors = [
  'ada@lovelace.dev',
  'grace@hopper.dev',
  'alan@turing.dev',
  'katherine@johnson.dev',
];
const seed: Deployment[] = (
  [
    ['a1f9c2e', 'main', 'production', 'ready', '42s'],
    ['7bd03aa', 'feat/billing', 'preview', 'building', '…'],
    ['c4e8101', 'main', 'production', 'ready', '39s'],
    ['91aa7f3', 'fix/navbar-focus', 'preview', 'error', '18s'],
    ['5e2b9d0', 'feat/search', 'preview', 'ready', '51s'],
    ['0fd17c4', 'main', 'production', 'ready', '44s'],
    ['b37e2a8', 'chore/deps', 'preview', 'ready', '1m 02s'],
    ['e6c90b1', 'main', 'production', 'error', '27s'],
    ['3a5d4f6', 'feat/onboarding', 'preview', 'ready', '48s'],
    ['d81c7e2', 'main', 'production', 'ready', '40s'],
  ] as const
).map(([commit, branch, env, state, duration], i) => ({
  commit,
  branch,
  env,
  state,
  duration,
  author: authors[i % authors.length] ?? '',
}));

const stateBadge = {
  ready: { tone: 'success', label: 'Ready' },
  building: { tone: 'warning', label: 'Building' },
  error: { tone: 'danger', label: 'Error' },
} as const;

const requests = [18, 22, 19, 27, 31, 29, 36, 33, 41, 38, 45, 49];
const latency = [
  { label: 'fra', value: 32 },
  { label: 'iad', value: 48 },
  { label: 'sfo', value: 61 },
  { label: 'gru', value: 84 },
  { label: 'hnd', value: 72 },
];
const regions = [
  { code: 'fra1', name: 'Frankfurt', load: 38 },
  { code: 'iad1', name: 'Washington', load: 64 },
  { code: 'hnd1', name: 'Tokyo', load: 52 },
];
const activity = [
  { who: 'ada', what: 'promoted a1f9c2e to production', time: '2m ago', tone: 'success' },
  { who: 'grace', what: 'opened feat/billing', time: '18m ago', tone: 'default' },
  { who: 'alan', what: 'rotated the API token', time: '1h ago', tone: 'default' },
  { who: 'katherine', what: 'added the domain docs.acme.dev', time: '3h ago', tone: 'default' },
  { who: 'grace', what: 'rolled back e6c90b1', time: '5h ago', tone: 'warning' },
] as const;
const frameworks = [
  { value: 'next', label: 'Next.js', description: 'React framework with the App Router' },
  { value: 'astro', label: 'Astro', description: 'Content-first, islands architecture' },
  { value: 'remix', label: 'React Router', description: 'Full-stack routing and data loading' },
  { value: 'vite', label: 'Vite', description: 'Plain SPA build' },
];
const members = authors.map((email) => ({ value: email, label: email.split('@')[0] ?? email }));
const swatches = ['#0f766e', '#2563eb', '#7c3aed', '#db2777', '#ea580c'];
const titles: Record<View, string> = {
  overview: 'Overview',
  deployments: 'Deployments',
  settings: 'Settings',
};
const layouts = [
  { value: 'list', label: 'List', icon: <ListIcon /> },
  { value: 'grid', label: 'Grid', icon: <GridIcon /> },
];

const phases = ['Clone', 'Install', 'Build', 'Deploy'];

function buildSteps(state: State): { steps: StepperStep[]; current: number } {
  return {
    steps: phases.map((label, i) =>
      state === 'error' && i === 2 ? { label, status: 'error' } : { label },
    ),
    current: state === 'ready' ? phases.length : 2,
  };
}

function buildLog(row: Deployment): LogLine[] {
  const lines: LogLine[] = [
    { id: 'clone', time: '12:04:00', text: `Cloning acme-web@${row.branch} (${row.commit})` },
    { id: 'install', time: '12:04:03', text: 'Installing dependencies' },
    { id: 'compile', time: '12:04:11', text: 'Compiling 36 packages' },
  ];
  if (row.state === 'ready') {
    lines.push(
      { id: 'fonts', time: '12:04:19', level: 'warn', text: 'Using cached fonts' },
      {
        id: 'done',
        time: '12:04:24',
        level: 'success',
        text: `Deployed to ${row.commit}.acme.dev`,
      },
    );
  }
  if (row.state === 'error') {
    lines.push(
      {
        id: 'type',
        time: '12:04:15',
        level: 'error',
        text: 'Type error in src/components/Navbar.tsx',
      },
      { id: 'fail', time: '12:04:16', level: 'error', text: 'Build failed' },
    );
  }
  return lines;
}

const outcome = {
  ready: { title: 'Deployment ready', tone: 'success' },
  building: { title: 'Building', tone: 'accent' },
  error: { title: 'Build failed', tone: 'danger' },
} as const;

export function Demo() {
  const [view, setView] = useState<View>('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [rows, setRows] = useState(seed);
  const [query, setQuery] = useState('');
  const [env, setEnv] = useState<'all' | Env>('all');
  const [layout, setLayout] = useState<Layout>('list');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Deployment | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detail, setDetail] = useState<Deployment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [usageAlert, setUsageAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(0);
  const [tags, setTags] = useState(['react', 'edge', 'beta']);
  const loadTimer = useRef<number | undefined>(undefined);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => window.clearTimeout(loadTimer.current), []);
  useEffect(() => {
    if (window.matchMedia('(max-width: 760px)').matches) setCollapsed(true);
  }, []);

  const filtered = rows.filter(
    (row) =>
      (env === 'all' || row.env === env) &&
      `${row.commit} ${row.branch}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const navigate = (next: View) => (event?: MouseEvent) => {
    event?.preventDefault();
    setView(next);
  };

  const refresh = () => {
    window.clearTimeout(loadTimer.current);
    setLoading(true);
    loadTimer.current = window.setTimeout(() => setLoading(false), 1200);
  };

  const redeploy = (row?: Deployment) =>
    toast.success('Redeploy queued', {
      description: row ? `${row.commit} on ${row.branch}` : 'Latest commit on main',
    });

  const openDetails = (row: Deployment) => {
    setDetail(row);
    setDetailOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const removed = pendingDelete;
    const index = rows.findIndex((row) => row.commit === removed.commit);
    setRows((current) => current.filter((row) => row.commit !== removed.commit));
    setPage(Math.min(currentPage, Math.max(1, Math.ceil((filtered.length - 1) / PAGE_SIZE))));
    // The native dialog returns focus to the deleted row's trigger; move it once that has run.
    requestAnimationFrame(() => searchInput.current?.focus());
    toast('Deployment deleted', {
      description: removed.commit,
      action: {
        label: 'Undo',
        onClick: () =>
          setRows((current) => [...current.slice(0, index), removed, ...current.slice(index)]),
      },
    });
  };

  const commands: CommandItem[] = [
    {
      id: 'go-overview',
      group: 'Navigate',
      label: 'Go to Overview',
      icon: <HomeIcon />,
      onSelect: navigate('overview'),
    },
    {
      id: 'go-deployments',
      group: 'Navigate',
      label: 'Go to Deployments',
      icon: <TerminalIcon />,
      onSelect: navigate('deployments'),
    },
    {
      id: 'go-settings',
      group: 'Navigate',
      label: 'Go to Settings',
      icon: <SettingsIcon />,
      onSelect: navigate('settings'),
    },
    {
      id: 'redeploy',
      group: 'Actions',
      label: 'Redeploy production',
      keywords: ['deploy', 'build'],
      icon: <RefreshIcon />,
      onSelect: () => redeploy(),
    },
  ];

  const currentRegion = regions[region] ?? regions[0];
  const otherProject = () => toast('Only acme-web exists in this demo');

  const actionsMenu = (row: Deployment) => (
    <Dropdown
      align="end"
      aria-label={`Actions for ${row.commit}`}
      trigger={
        <Button variant="ghost" size="sm" aria-label={`Actions for ${row.commit}`}>
          <MoreIcon />
        </Button>
      }
    >
      <MenuItem icon={<EyeIcon />} onSelect={() => openDetails(row)}>
        View details
      </MenuItem>
      <MenuItem icon={<RefreshIcon />} onSelect={() => redeploy(row)}>
        Redeploy
      </MenuItem>
      <MenuItem
        icon={<CopyIcon />}
        onSelect={() => toast.success('URL copied', { description: `${row.commit}.acme.dev` })}
      >
        Copy URL
      </MenuItem>
      <MenuSeparator />
      <MenuItem
        icon={<TrashIcon />}
        tone="danger"
        onSelect={() => {
          setPendingDelete(row);
          setDeleteOpen(true);
        }}
      >
        Delete
      </MenuItem>
    </Dropdown>
  );

  const statusBadge = (row: Deployment) => (
    <Badge tone={stateBadge[row.state].tone} dot={row.state === 'building' ? 'pulse' : true}>
      {stateBadge[row.state].label}
    </Badge>
  );

  const detailSteps = detail ? buildSteps(detail.state) : null;

  return (
    <div className="demo">
      <Sidebar className="demo__sidebar" collapsed={collapsed} onCollapsedChange={setCollapsed}>
        <SidebarHeader>
          <span className="demo__brand">
            <ScrambleText text="acme" trigger="hover" />
          </span>
          <SidebarToggle />
        </SidebarHeader>
        <SidebarContent aria-label="Project">
          <SidebarGroup>
            <SidebarItem
              icon={<HomeIcon />}
              current={view === 'overview'}
              onClick={navigate('overview')}
            >
              Overview
            </SidebarItem>
            <SidebarItem
              icon={<TerminalIcon />}
              current={view === 'deployments'}
              badge={String(rows.length)}
              onClick={navigate('deployments')}
            >
              Deployments
            </SidebarItem>
            <SidebarItem
              icon={<SettingsIcon />}
              current={view === 'settings'}
              onClick={navigate('settings')}
            >
              Settings
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Projects">
            <SidebarItem icon={<FolderIcon />} onClick={navigate('overview')}>
              acme-web
            </SidebarItem>
            <SidebarItem icon={<CodeIcon />} onClick={otherProject}>
              acme-api
            </SidebarItem>
            <SidebarItem icon={<GlobeIcon />} onClick={otherProject}>
              acme-edge
            </SidebarItem>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup className="demo__sidebar-footer">
            <SidebarItem href={`${import.meta.env.BASE_URL}storybook/`} icon={<HelpIcon />}>
              Docs
            </SidebarItem>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      <div className="demo__main">
        <div className="demo__top">
          <Breadcrumb>
            <BreadcrumbItem href="#demo" icon={<HomeIcon />} onClick={navigate('overview')}>
              acme
            </BreadcrumbItem>
            <BreadcrumbItem href="#demo" onClick={navigate('overview')}>
              acme-web
            </BreadcrumbItem>
            <BreadcrumbItem current>{titles[view]}</BreadcrumbItem>
          </Breadcrumb>
          <div className="demo__top-actions">
            <CommandMenu
              commands={commands}
              hotkey={false}
              placeholder="Search commands…"
              label="Command menu"
              trigger={
                <Button variant="secondary" size="sm" iconStart={<SearchIcon />}>
                  Search
                </Button>
              }
            />
            <Popover
              label="Share project"
              align="end"
              trigger={
                <Button variant="ghost" size="sm" aria-label="Share project">
                  <ShareIcon />
                </Button>
              }
            >
              <div className="demo__share">
                <Field label="Preview URL">
                  <Input readOnly value="https://acme-web.pixel.dev" />
                </Field>
                <Button
                  size="sm"
                  iconStart={<CopyIcon />}
                  onClick={() =>
                    toast.success('Link copied', { description: 'acme-web.pixel.dev' })
                  }
                >
                  Copy link
                </Button>
              </div>
            </Popover>
            <Tooltip content="No new notifications">
              <Button variant="ghost" size="sm" aria-label="Notifications">
                <BellIcon />
              </Button>
            </Tooltip>
            <Dropdown
              align="end"
              aria-label="Account"
              trigger={
                <button type="button" className="demo__avatar" aria-label="Account menu">
                  <PixelAvatar name="ada@lovelace.dev" size={28} />
                </button>
              }
            >
              <MenuGroup label="ada@lovelace.dev">
                <MenuItem icon={<UserIcon />}>Profile</MenuItem>
                <MenuItem icon={<SettingsIcon />} onSelect={() => setView('settings')}>
                  Settings
                </MenuItem>
              </MenuGroup>
              <MenuSeparator />
              <MenuItem
                icon={<LogoutIcon />}
                tone="danger"
                onSelect={() => toast('Signed out of the demo')}
              >
                Sign out
              </MenuItem>
            </Dropdown>
          </div>
        </div>

        <section className="demo__panel" aria-labelledby="demo-view-title">
          <h3 id="demo-view-title" className="demo__title">
            {titles[view]}
          </h3>

          {view === 'overview' && (
            <>
              {usageAlert && (
                <Alert
                  tone="warning"
                  title="Bandwidth at 82% of your plan"
                  action={
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toast('The demo has no plans page')}
                    >
                      View plans
                    </Button>
                  }
                  onDismiss={() => setUsageAlert(false)}
                >
                  Usage resets in 9 days. Upgrade to avoid throttled previews.
                </Alert>
              )}
              <div className="demo__cards">
                <Card>
                  <CardHeader>
                    <CardTitle pixel>48.2k</CardTitle>
                    <CardDescription>Requests in the last 12 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Sparkline
                      label="Requests per hour"
                      data={requests}
                      rows={10}
                      cellSize={8}
                      area
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Latency by region</CardTitle>
                    <CardDescription>p75 of 52 ms across five regions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      label="Latency by region in milliseconds"
                      data={latency}
                      highlight="max"
                      rows={8}
                      cellSize={10}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Region status</CardTitle>
                    <CardDescription>Edge capacity right now</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PixelTransition className="demo__region">
                      <div className="demo__region-name">
                        <Badge tone="success" dot>
                          {currentRegion?.code}
                        </Badge>
                        <span>{currentRegion?.name}</span>
                      </div>
                      <Progress
                        value={currentRegion?.load ?? 0}
                        label={`${currentRegion?.name} load`}
                        showValue
                      />
                    </PixelTransition>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        startPixelTransition(() => setRegion((i) => (i + 1) % regions.length), {
                          scope: 'elements',
                        })
                      }
                    >
                      Next region
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="demo__split">
                <Card>
                  <CardHeader>
                    <CardTitle>Latest preview</CardTitle>
                    <CardDescription>a1f9c2e · main</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PixelImage
                      className="demo__preview"
                      src={`${import.meta.env.BASE_URL}og.png`}
                      alt="Screenshot of the latest acme-web production deployment"
                      width={1200}
                      height={630}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="demo__activity-head">
                    <div>
                      <CardTitle>Activity</CardTitle>
                      <CardDescription>Team events today</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconStart={<RefreshIcon />}
                      loading={loading}
                      onClick={refresh}
                    >
                      Refresh
                    </Button>
                  </CardHeader>
                  <CardContent aria-busy={loading}>
                    {loading ? (
                      <div className="demo__activity-loading">
                        {activity.map((event) => (
                          <Skeleton key={event.what} lines={2} />
                        ))}
                      </div>
                    ) : (
                      <Timeline aria-label="Team activity">
                        {activity.map((event) => (
                          <TimelineItem
                            key={event.what}
                            title={
                              <>
                                <strong>{event.who}</strong> {event.what}
                              </>
                            }
                            time={event.time}
                            tone={event.tone}
                          />
                        ))}
                      </Timeline>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {view === 'deployments' && (
            <>
              <div className="demo__filters">
                <Input
                  ref={searchInput}
                  aria-label="Search deployments"
                  placeholder="Search commit or branch"
                  prefix={<SearchIcon />}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPage(1);
                  }}
                />
                <Select
                  aria-label="Environment"
                  value={env}
                  onChange={(event) => {
                    setEnv(event.target.value as 'all' | Env);
                    setPage(1);
                  }}
                >
                  <option value="all">All environments</option>
                  <option value="production">Production</option>
                  <option value="preview">Preview</option>
                </Select>
                <SegmentedControl
                  aria-label="Layout"
                  size="sm"
                  options={layouts}
                  value={layout}
                  onValueChange={(next) => setLayout(next as Layout)}
                />
                <Toolbar aria-label="Deployment actions">
                  <ToolbarButton
                    aria-label="Refresh deployments"
                    onClick={refresh}
                    disabled={loading}
                  >
                    <RefreshIcon />
                  </ToolbarButton>
                  <ToolbarButton aria-label="Export CSV" onClick={() => toast('Export started')}>
                    <DownloadIcon />
                  </ToolbarButton>
                </Toolbar>
              </div>

              {layout === 'list' ? (
                <div className="demo__table">
                  <Table density="compact" aria-busy={loading}>
                    <TableCaption className="sr-only">Deployments for acme-web</TableCaption>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Commit</TableHeader>
                        <TableHeader>Branch</TableHeader>
                        <TableHeader>Status</TableHeader>
                        <TableHeader align="end">Duration</TableHeader>
                        <TableHeader>Author</TableHeader>
                        <TableHeader align="end">
                          <span className="sr-only">Actions</span>
                        </TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading &&
                        Array.from({ length: PAGE_SIZE }, (_, i) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows
                          <TableRow key={i}>
                            <TableCell colSpan={6}>
                              <Skeleton height={24} />
                            </TableCell>
                          </TableRow>
                        ))}
                      {!loading && visible.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6}>No deployments match these filters.</TableCell>
                        </TableRow>
                      )}
                      {!loading &&
                        visible.map((row) => (
                          <TableRow key={row.commit}>
                            <TableCell mono>{row.commit}</TableCell>
                            <TableCell>
                              <span className="demo__branch">
                                {row.branch}
                                {row.env === 'production' && (
                                  <Badge tone="accent" appearance="subtle" animateIn={false}>
                                    prod
                                  </Badge>
                                )}
                              </span>
                            </TableCell>
                            <TableCell>{statusBadge(row)}</TableCell>
                            <TableCell align="end" mono>
                              {row.duration}
                            </TableCell>
                            <TableCell>
                              <Tooltip content={row.author}>
                                <span className="demo__author" tabIndex={0}>
                                  <PixelAvatar name={row.author} size={24} />
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="end">{actionsMenu(row)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <ul className="demo__grid" role="list" aria-busy={loading}>
                  {loading &&
                    Array.from({ length: PAGE_SIZE }, (_, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder cards
                      <li key={i}>
                        <Skeleton height={168} />
                      </li>
                    ))}
                  {!loading && visible.length === 0 && <li>No deployments match these filters.</li>}
                  {!loading &&
                    visible.map((row) => (
                      <li key={row.commit}>
                        <Card className="demo__deploy">
                          <CardHeader>
                            <CardTitle>{row.branch}</CardTitle>
                            <CardDescription>
                              {row.commit} · {row.env} · {row.duration}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="demo__deploy-meta">
                            {statusBadge(row)}
                            <PixelAvatar name={row.author} size={24} />
                          </CardContent>
                          <CardFooter className="demo__deploy-footer">
                            <Button variant="secondary" size="sm" onClick={() => openDetails(row)}>
                              View details
                            </Button>
                            {actionsMenu(row)}
                          </CardFooter>
                        </Card>
                      </li>
                    ))}
                </ul>
              )}

              {totalPages > 1 && (
                <Pagination
                  className="demo__pagination"
                  total={totalPages}
                  page={currentPage}
                  onPageChange={setPage}
                  size="sm"
                />
              )}
            </>
          )}

          {view === 'settings' && (
            <form
              className="demo__form"
              onSubmit={(event) => {
                event.preventDefault();
                toast.success('Settings saved', {
                  description: 'Changes apply on the next deploy.',
                });
              }}
            >
              <div className="demo__form-grid">
                <Field label="Project name" required description="Used in URLs and the dashboard.">
                  <Input name="name" defaultValue="acme-web" required />
                </Field>
                <Field label="Framework">
                  <Autocomplete
                    options={frameworks}
                    defaultValue="astro"
                    placeholder="Search frameworks"
                  />
                </Field>
                <Field label="Description" className="demo__span">
                  <Textarea
                    name="description"
                    autoResize
                    defaultValue="Marketing site and docs for Acme."
                  />
                </Field>
                <Field label="Team members" description="They get deploy notifications.">
                  <MultiSelect
                    options={members}
                    defaultValue={['ada@lovelace.dev', 'grace@hopper.dev']}
                  />
                </Field>
                <Field label="Deploy freeze" description="No production deploys in this window.">
                  <DateRangePicker
                    defaultValue={{ start: new Date(2026, 11, 22), end: new Date(2027, 0, 2) }}
                    startLabel="Freeze start"
                    endLabel="Freeze end"
                  />
                </Field>
              </div>

              <RadioGroup label="Default region" defaultValue="fra1" orientation="horizontal">
                <Radio value="fra1" label="Frankfurt" />
                <Radio value="iad1" label="Washington" />
                <Radio value="hnd1" label="Tokyo" />
              </RadioGroup>

              <div className="demo__brand-row">
                <div className="demo__group">
                  <span className="demo__label" aria-hidden="true">
                    Brand colour
                  </span>
                  <ColorPicker label="Brand colour" defaultValue="#0f766e" swatches={swatches} />
                </div>
                <div className="demo__group">
                  <span className="demo__label" id="demo-tags-label">
                    Tags
                  </span>
                  <div className="demo__tags" role="group" aria-labelledby="demo-tags-label">
                    {tags.map((tag) => (
                      <Chip
                        key={tag}
                        onRemove={() => setTags((current) => current.filter((t) => t !== tag))}
                        removeLabel={`Remove ${tag}`}
                      >
                        {tag}
                      </Chip>
                    ))}
                    {tags.length < 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTags(['react', 'edge', 'beta'])}
                      >
                        Reset tags
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Accordion>
                <AccordionItem title="Build" meta="3 options">
                  <div className="demo__options">
                    <Checkbox label="Create preview deployments" defaultChecked />
                    <Checkbox label="Fail the build on lint warnings" />
                    <Field label="Build concurrency" description="Parallel jobs, from 1 to 8.">
                      <NumberField name="concurrency" defaultValue={4} min={1} max={8} />
                    </Field>
                  </div>
                </AccordionItem>
                <AccordionItem title="Notifications" meta="Email">
                  <div className="demo__options">
                    <Checkbox label="Deploy succeeded" defaultChecked />
                    <Checkbox label="Deploy failed" defaultChecked />
                  </div>
                </AccordionItem>
              </Accordion>

              <div className="demo__actions">
                <Link href="#usage" tone="muted">
                  How settings map to tokens
                </Link>
                <Button type="submit">Save changes</Button>
              </div>

              <Separator variant="pixel" label="Danger zone" />
              <div className="demo__danger">
                <p className="muted">
                  Deleting removes every deployment and domain. There is no undo.
                </p>
                <AlertDialog
                  tone="danger"
                  title="Delete acme-web?"
                  description="Every deployment, domain and environment variable will be removed."
                  confirmLabel="Delete project"
                  trigger={
                    <Button variant="danger" iconStart={<TrashIcon />}>
                      Delete project
                    </Button>
                  }
                  onConfirm={() =>
                    new Promise((resolve) => window.setTimeout(resolve, 900)).then(() =>
                      toast.error('This is a demo: nothing was deleted'),
                    )
                  }
                />
              </div>
            </form>
          )}
        </section>
      </div>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        tone="danger"
        title={`Delete deployment ${pendingDelete?.commit ?? ''}?`}
        description="Its preview URL stops working immediately."
        confirmLabel="Delete deployment"
        onConfirm={confirmDelete}
      />

      <Drawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        size="lg"
        title={detail ? `Deployment ${detail.commit}` : 'Deployment'}
        description={detail ? `${detail.branch} · ${detail.env} · by ${detail.author}` : undefined}
        footer={
          <>
            <DrawerClose>
              <Button variant="secondary">Close</Button>
            </DrawerClose>
            <DrawerClose>
              <Button iconStart={<RefreshIcon />} onClick={() => detail && redeploy(detail)}>
                Redeploy
              </Button>
            </DrawerClose>
          </>
        }
      >
        {detail && detailSteps && (
          <div className="demo__detail" key={detail.commit}>
            <div className="demo__detail-status">
              {statusBadge(detail)}
              <span className="muted">Duration {detail.duration}</span>
            </div>
            <Stepper
              aria-label="Build phases"
              steps={detailSteps.steps}
              current={detailSteps.current}
            />
            <Tabs defaultValue="logs">
              <TabList label="Deployment details">
                <Tab value="logs" icon={<TerminalIcon />}>
                  Logs
                </Tab>
                <Tab value="events" icon={<ListIcon />}>
                  Events
                </Tab>
              </TabList>
              <TabPanel value="logs" className="demo__detail-panel">
                <Terminal
                  title="Build logs"
                  lines={buildLog(detail)}
                  streaming={detail.state === 'building'}
                  maxHeight={240}
                />
              </TabPanel>
              <TabPanel value="events" className="demo__detail-panel">
                <Timeline aria-label="Deployment events">
                  <TimelineItem
                    title={outcome[detail.state].title}
                    time="12:04"
                    dateTime="2026-11-15T12:04"
                    tone={outcome[detail.state].tone}
                  />
                  <TimelineItem title="Build started" time="12:04" dateTime="2026-11-15T12:04" />
                  <TimelineItem
                    title={`Pushed to ${detail.branch}`}
                    time="12:03"
                    dateTime="2026-11-15T12:03"
                  >
                    {detail.commit} by {detail.author.split('@')[0]}
                  </TimelineItem>
                </Timeline>
              </TabPanel>
            </Tabs>
          </div>
        )}
      </Drawer>

      <Toaster position="bottom-right" />
    </div>
  );
}
