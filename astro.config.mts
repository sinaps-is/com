import { defineConfig as config } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import { project } from './src/consts';

export default config ({
  site: project.url,
  trailingSlash: 'never',
  output: 'server',

  // Disable dev toolbar as is not useful for now and causes some issues with the output
  devToolbar: {
    enabled: false
  },

  // Cloudflare adapter configuration
  adapter: cloudflare ({
    imageService: { build: 'compile', runtime: 'cloudflare-binding' },
    sessionKVBindingName: 'SESSION',
    imagesBindingName: 'IMAGES',
  }),
});