import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://pabloviniegra.github.io',
  base: '/pixel-ui',
  trailingSlash: 'always',
  integrations: [react()],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'none'",
      ],
      scriptDirective: { resources: ["'self'"] },
      // Package components (Progress, Loader, charts, PixelAvatar) render inline style attributes.
      styleDirective: { resources: ["'self'", { resource: "'unsafe-inline'", kind: 'attribute' }] },
    },
  },
  vite: {
    resolve: {
      // Load workspace packages from src/ (the "source" export condition) so the
      // site builds without building every package first.
      conditions: ['source', 'module', 'browser', 'development|production'],
    },
    ssr: {
      resolve: {
        conditions: ['source', 'module', 'node', 'development|production'],
      },
    },
  },
});
