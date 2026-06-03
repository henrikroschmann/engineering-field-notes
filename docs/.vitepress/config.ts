import { defineConfig } from 'vitepress'
import sidebar from './sidebar.generated'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/engineering-field-notes/' : '/',
  title: 'Engineering Field Notes',
  description: 'Daily systems topics, explained deeply.',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: true,

  themeConfig: {
    outline: {
      level: [2, 3],
    },

    search: {
      provider: 'local',
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Topics', link: '/topics/distributed-systems/vector-clocks' },
      { text: 'GitHub', link: 'https://github.com/placeholder/engineering-field-notes' },
    ],

    sidebar: {
      '/topics/': sidebar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/placeholder/engineering-field-notes' },
    ],

    editLink: {
      pattern: 'https://github.com/placeholder/engineering-field-notes/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Last Updated',
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },

    darkMode: true,
  },
})
