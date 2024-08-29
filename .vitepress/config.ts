import { defineConfig } from 'vitepress'
import { getPosts } from './theme/serverUtils'

const pageSize = 10

export default defineConfig({
  title: 'sakunia',
  head: [["link", { rel: "icon", href: "/favicon.png" }]],
  base: '/',
  cacheDir: './node_modules/vitepress_cache',
  description: 'vitepress,blog,blog-theme',
  ignoreDeadLinks: true,
  themeConfig: {
    posts: await getPosts(pageSize),
    website: 'https://github.com/Sakura1943/Sakura1943.github.io',
    comment: {
      repo: 'Sakura1943/Sakura1943.github.io',
      themes: 'github-light',
      issueTerm: 'pathname'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Category', link: '/pages/category' },
      { text: 'Archives', link: '/pages/archives' },
      { text: 'Tags', link: '/pages/tags' },
      { text: 'About', link: '/pages/about' }
    ],
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },
    outline: {
      label: '文章摘要'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/Sakura1943/Sakura1943.github.io' }]
  } as any,
  srcExclude: ['README.md'],
  vite: {
    build: { minify: false },
    server: { port: 5000 }
  }
})
