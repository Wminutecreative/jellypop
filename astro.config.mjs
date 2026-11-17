import { defineConfig } from 'astro/config';
import { copyFile } from 'node:fs/promises';

import sitemap from '@astrojs/sitemap';

// @astrojs/sitemap only writes sitemap-index.xml + sitemap-0.xml;
// also publish the same sitemap at /sitemap.xml.
const sitemapAlias = {
  name: 'sitemap-alias',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      await copyFile(new URL('sitemap-0.xml', dir), new URL('sitemap.xml', dir));
    },
  },
};

export default defineConfig({
  site: 'https://www.jellypop.design',
  integrations: [sitemap(), sitemapAlias],
});
