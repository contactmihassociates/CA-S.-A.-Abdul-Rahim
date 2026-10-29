import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://casaabdulrahim.in',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  devToolbar: { enabled: false },
});
