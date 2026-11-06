import { Badge } from '@pixel-ui/badge';
import '@pixel-ui/badge/style.css';

interface PackageJson {
  name: string;
  version: string;
  description?: string;
  private?: boolean;
}

// Collected at build time by Vite, so the table is always in sync with the repo.
const manifests = import.meta.glob<PackageJson>('../../../packages/*/package.json', {
  eager: true,
  import: 'default',
});
const changelogs = import.meta.glob<string>('../../../packages/*/CHANGELOG.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/** Extracts the bullet points under the newest "## x.y.z" heading. */
function latestNotes(changelog: string | undefined): string[] {
  if (!changelog) return [];
  const section = changelog.split(/^## /m)[1] ?? '';
  return section
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .slice(0, 3);
}

const rows = Object.entries(manifests)
  .map(([path, pkg]) => ({
    ...pkg,
    notes: latestNotes(changelogs[path.replace('package.json', 'CHANGELOG.md')]),
  }))
  .filter((pkg) => !pkg.private)
  .sort((a, b) => a.name.localeCompare(b.name));

export function VersionTable() {
  return (
    <table className="pxl-docs-table">
      <thead>
        <tr>
          <th>Package</th>
          <th>Version</th>
          <th>Latest changes</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((pkg) => (
          <tr key={pkg.name}>
            <td>
              <code>{pkg.name}</code>
              {pkg.description && <div className="pxl-docs-muted">{pkg.description}</div>}
            </td>
            <td>
              <Badge tone={pkg.version.startsWith('0.') ? 'warning' : 'success'} animateIn={false}>
                v{pkg.version}
              </Badge>
            </td>
            <td>
              <ul>
                {pkg.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
