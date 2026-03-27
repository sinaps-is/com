import { defineConfig as config } from 'astro/config';

export default config ({
  site: 'https://sinaps.is',
  trailingSlash: 'never',
  output: 'server',

  // Disable dev toolbar as is not useful for now and causes some issues with the output
  devToolbar: {
    enabled: false
  },
});