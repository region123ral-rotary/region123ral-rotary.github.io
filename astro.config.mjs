import { defineConfig } from 'astro/config';

// GitHub Pages の公開URL。独自ドメインに切り替えたら SITE を変更し、BASE を '/' にする
const SITE = process.env.SITE_URL || 'https://example.github.io';
const BASE = process.env.BASE_PATH || '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
