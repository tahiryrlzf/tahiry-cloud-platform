import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://tahiry-cloud.com',
  integrations: [sitemap()],
});
