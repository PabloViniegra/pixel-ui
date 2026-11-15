import {
  MoonIcon,
  Navbar,
  NavbarLink,
  NavbarMenu,
  NavbarMenuLink,
  SparkleIcon,
  SunIcon,
  TerminalIcon,
} from '@pablo-v/react';
import { useEffect, useState } from 'react';

interface Props {
  home: string;
  storybookUrl: string;
  repoUrl: string;
}

const sections = ['demo', 'install', 'usage', 'mcp', 'skill', 'components'];

export function SiteNav({ home, storybookUrl, repoUrl }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () =>
      setDark(root.dataset.theme ? root.dataset.theme === 'dark' : prefersDark.matches);
    sync();
    prefersDark.addEventListener('change', sync);
    return () => prefersDark.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const spy = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const id = record.target.id;
          if (record.isIntersecting) setActive(id);
          else setActive((current) => (current === id ? null : current));
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    for (const id of sections) {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    }
    return () => spy.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.setAttribute('content', dark ? '#ffffff' : '#000000');
    }
    try {
      localStorage.setItem('pxl-theme', next);
    } catch {}
    setDark(!dark);
  };

  const link = (id: string, label: string) => (
    <NavbarLink href={`#${id}`} current={active === id}>
      {label}
    </NavbarLink>
  );

  return (
    <Navbar
      aria-label="Sections"
      toggleLabel="Sections"
      brand={
        <a className="brand" href={home} aria-label="PixelUI home">
          PixelUI
        </a>
      }
      actions={
        <>
          <a className="header__link" href={storybookUrl}>
            Storybook
          </a>
          <a className="header__link" href={repoUrl}>
            GitHub
          </a>
          <button
            type="button"
            className="icon-link"
            aria-label="Toggle dark theme"
            aria-pressed={dark}
            onClick={toggleTheme}
          >
            <span className="theme-icon theme-icon--sun">
              <SunIcon size={16} />
            </span>
            <span className="theme-icon theme-icon--moon">
              <MoonIcon size={16} />
            </span>
          </button>
        </>
      }
    >
      {link('demo', 'Demo')}
      {link('install', 'Install')}
      {link('usage', 'Usage')}
      <NavbarMenu label="AI agents" current={active === 'mcp' || active === 'skill'}>
        <NavbarMenuLink
          href="#mcp"
          icon={<TerminalIcon />}
          description="Props, examples and rules for your agent"
          current={active === 'mcp'}
        >
          MCP server
        </NavbarMenuLink>
        <NavbarMenuLink
          href="#skill"
          icon={<SparkleIcon />}
          description="A workflow for building screens"
          current={active === 'skill'}
        >
          Skill
        </NavbarMenuLink>
      </NavbarMenu>
      {link('components', 'Components')}
    </Navbar>
  );
}
