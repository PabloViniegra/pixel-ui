#!/usr/bin/env node
// Publishes every unpublished workspace package one at a time. `changeset publish`
// sends them all in parallel, which trips npm's rate limit on new packages.
import { execFileSync, spawnSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PAUSE_MS = 20_000;
const packagesDir = 'packages';

const isPublished = (name, version) =>
  spawnSync('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'ignore' }).status === 0;

const dirs = readdirSync(packagesDir).sort((a, b) => (b === 'tokens') - (a === 'tokens'));

for (const dir of dirs) {
  const cwd = join(packagesDir, dir);
  const {
    name,
    version,
    private: isPrivate,
  } = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'));
  if (isPrivate || isPublished(name, version)) continue;

  console.log(`Publishing ${name}@${version}`);
  execFileSync('pnpm', ['publish', '--access', 'public', '--no-git-checks'], {
    cwd,
    stdio: 'inherit',
  });
  await new Promise((resolve) => setTimeout(resolve, PAUSE_MS));
}
