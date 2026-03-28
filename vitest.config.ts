import { getViteConfig } from 'astro/config';
import { defineConfig as config, mergeConfig } from 'vitest/config';

import { fileURLToPath } from 'node:url';

export default config ((env) => mergeConfig (
  getViteConfig ({})(env), // Inherits main config before test overrides
  config ({
    test: {
      environment: 'node',
      include: ['tests/**/*.{test,spec}.[jt]s'],
      exclude: ['**/node_modules/**', '**/.git/**'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath (new URL ('./src', import.meta.url)),
      },
    },
  }),
));