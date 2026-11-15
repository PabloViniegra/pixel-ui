#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Catalog } from './catalog.js';
import { createServer } from './server.js';

const readJson = (path: string) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));

const catalog: Catalog = readJson('./catalog.json');
const { version }: { version: string } = readJson('../package.json');

await createServer(catalog, version).connect(new StdioServerTransport());
