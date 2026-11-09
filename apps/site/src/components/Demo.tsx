import {
  Accordion,
  AccordionItem,
  Alert,
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
  Dialog,
  DialogClose,
  DownloadIcon,
  Dropdown,
  Field,
  FolderIcon,
  GlobeIcon,
  GridIcon,
  HomeIcon,
  Input,
  Link,
  ListIcon,
  LogoutIcon,
  MenuGroup,
  MenuItem,
  MenuSeparator,
  MoreIcon,
  MultiSelect,
  Navbar,
  NavbarLink,
  NavbarMenu,
  NavbarMenuLink,
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
  Select,
  Separator,
  SettingsIcon,
  ShareIcon,
  Skeleton,
  Slider,
  Sparkline,
  Switch,
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
  TerminalIcon,
  Textarea,
  Toaster,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  Tooltip,
  TrashIcon,
  toast,
  UserIcon,
} from '@pablo-v/react';
import { type MouseEvent, useEffect, useRef, useState } from 'react';

type View = 'overview' | 'deployments' | 'settings';
type Env = 'production' | 'preview';
type State = 'ready' | 'building' | 'error';

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

export function Demo() {
  const [view, setView] = useState<View>('overview');
  const [rows, setRows] = useState(seed);
  const [query, setQuery] = useState('');
  const [env, setEnv] = useState<'all' | Env>('all');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Deployment | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usageAlert, setUsageAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(0);
  const [tags, setTags] = useState(['react', 'edge', 'beta']);
  const loadTimer = useRef<number | undefined>(undefined);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => window.clearTimeout(loadTimer.current), []);

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

  return (
    <div className="demo">
      <Navbar
        className="demo__nav"
        brand={
          <span className="demo__brand">
            <ScrambleText text="acme" trigger="hover" />
          </span>
        }
        actions={
          <>
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
          </>
        }
      >
        <NavbarLink href="#demo" current={view === 'overview'} onClick={navigate('overview')}>
          Overview
        </NavbarLink>
        <NavbarLink href="#demo" current={view === 'deployments'} onClick={navigate('deployments')}>
          Deployments
        </NavbarLink>
        <NavbarMenu label="Projects">
          <NavbarMenuLink href="#demo" icon={<FolderIcon />} description="Marketing site" current>
            acme-web
          </NavbarMenuLink>
          <NavbarMenuLink href="#demo" icon={<CodeIcon />} description="Public REST API">
            acme-api
          </NavbarMenuLink>
          <NavbarMenuLink href="#demo" icon={<GlobeIcon />} description="Edge redirects">
            acme-edge
          </NavbarMenuLink>
        </NavbarMenu>
      </Navbar>

      <div className="demo__body">
        <div className="demo__head">
          <Breadcrumb>
            <BreadcrumbItem href="#demo" icon={<HomeIcon />} onClick={navigate('overview')}>
              acme
            </BreadcrumbItem>
            <BreadcrumbItem href="#demo" onClick={navigate('overview')}>
              acme-web
            </BreadcrumbItem>
            <BreadcrumbItem current>{titles[view]}</BreadcrumbItem>
          </Breadcrumb>
          <Popover
            label="Share project"
            align="end"
            trigger={
              <Button variant="secondary" size="sm" iconStart={<ShareIcon />}>
                Share
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
                onClick={() => toast.success('Link copied', { description: 'acme-web.pixel.dev' })}
              >
                Copy link
              </Button>
            </div>
          </Popover>
        </div>

        <Tabs value={view} defaultValue="overview" onValueChange={(next) => setView(next as View)}>
          <TabList label="Project sections">
            <Tab value="overview" icon={<HomeIcon />}>
              Overview
            </Tab>
            <Tab value="deployments" icon={<TerminalIcon />}>
              Deployments
            </Tab>
            <Tab value="settings" icon={<SettingsIcon />}>
              Settings
            </Tab>
          </TabList>

          <TabPanel value="overview" className="demo__panel">
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
                <CardContent>
                  <ul className="demo__activity" role="list" aria-busy={loading}>
                    {[
                      ['ada@lovelace.dev', 'promoted a1f9c2e to production'],
                      ['grace@hopper.dev', 'opened feat/billing'],
                      ['alan@turing.dev', 'rotated the API token'],
                      ['katherine@johnson.dev', 'added the domain docs.acme.dev'],
                      ['grace@hopper.dev', 'rolled back e6c90b1'],
                    ].map(([who, what]) => (
                      <li key={what}>
                        {loading ? (
                          <>
                            <Skeleton width={28} height={28} radius="full" />
                            <Skeleton lines={2} />
                          </>
                        ) : (
                          <>
                            <PixelAvatar name={who ?? ''} label="" size={28} />
                            <span>
                              <strong>{who?.split('@')[0]}</strong> {what}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabPanel>

          <TabPanel value="deployments" className="demo__panel">
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
              <Toolbar aria-label="Deployment actions">
                <ToolbarGroup aria-label="Layout">
                  <ToolbarButton pressed aria-label="List view">
                    <ListIcon />
                  </ToolbarButton>
                  <ToolbarButton pressed={false} aria-label="Grid view" disabled>
                    <GridIcon />
                  </ToolbarButton>
                </ToolbarGroup>
                <ToolbarSeparator />
                <ToolbarGroup aria-label="Data">
                  <ToolbarButton aria-label="Export CSV" onClick={() => toast('Export started')}>
                    <DownloadIcon />
                  </ToolbarButton>
                </ToolbarGroup>
              </Toolbar>
            </div>
            <div className="demo__table">
              <Table density="compact">
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
                  {visible.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>No deployments match these filters.</TableCell>
                    </TableRow>
                  )}
                  {visible.map((row) => (
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
                      <TableCell>
                        <Badge
                          tone={stateBadge[row.state].tone}
                          dot={row.state === 'building' ? 'pulse' : true}
                        >
                          {stateBadge[row.state].label}
                        </Badge>
                      </TableCell>
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
                      <TableCell align="end">
                        <Dropdown
                          align="end"
                          aria-label={`Actions for ${row.commit}`}
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              aria-label={`Actions for ${row.commit}`}
                            >
                              <MoreIcon />
                            </Button>
                          }
                        >
                          <MenuItem icon={<RefreshIcon />} onSelect={() => redeploy(row)}>
                            Redeploy
                          </MenuItem>
                          <MenuItem
                            icon={<CopyIcon />}
                            onSelect={() =>
                              toast.success('URL copied', { description: `${row.commit}.acme.dev` })
                            }
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <Pagination
                className="demo__pagination"
                total={totalPages}
                page={currentPage}
                onPageChange={setPage}
                size="sm"
              />
            )}
          </TabPanel>

          <TabPanel value="settings" className="demo__panel">
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
                    <Switch label="Preview deployments" defaultChecked />
                    <Checkbox label="Fail the build on lint warnings" />
                    <Field label="Build concurrency">
                      <Slider defaultValue={4} min={1} max={8} showValue />
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
                <Dialog
                  title="Delete acme-web?"
                  description="Every deployment, domain and environment variable will be removed."
                  size="sm"
                  trigger={
                    <Button variant="danger" iconStart={<TrashIcon />}>
                      Delete project
                    </Button>
                  }
                  footer={
                    <>
                      <DialogClose>
                        <Button variant="secondary">Cancel</Button>
                      </DialogClose>
                      <DialogClose>
                        <Button
                          variant="danger"
                          onClick={() => toast.error('This is a demo: nothing was deleted')}
                        >
                          Delete
                        </Button>
                      </DialogClose>
                    </>
                  }
                />
              </div>
            </form>
          </TabPanel>
        </Tabs>
      </div>

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete deployment ${pendingDelete?.commit ?? ''}?`}
        description="Its preview URL stops working immediately."
        size="sm"
        footer={
          <>
            <DialogClose>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button variant="danger" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogClose>
          </>
        }
      />
      <Toaster position="bottom-right" />
    </div>
  );
}
