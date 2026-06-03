import { defineConfig } from 'vitepress'

// base: for GitHub Pages project sites, set this to '/repo-name/'
// e.g. base: '/engineering-field-notes/'
export default defineConfig({
  title: 'Engineering Field Notes',
  description: 'Daily systems topics, explained deeply.',
  cleanUrls: true,
  lastUpdated: true,

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

    sidebar: [
      {
        text: 'Distributed Systems',
        items: [
          { text: 'Vector Clocks', link: '/topics/distributed-systems/vector-clocks' },
          { text: 'Lamport Clocks', link: '/topics/distributed-systems/lamport-clocks' },
        ],
      },
      {
        text: 'Databases',
        items: [
          { text: 'Coming Soon', link: '#' },
        ],
      },
      {
        text: 'Networking',
        items: [
          { text: 'Coming Soon', link: '#' },
        ],
      },
      {
        text: 'System Design',
        items: [
          { text: 'Coming Soon', link: '#' },
        ],
      },
      {
        text: 'Concurrency',
        items: [
          { text: 'Coming Soon', link: '#' },
        ],
      },
      {
        text: 'Observability',
        items: [
          { text: 'Coming Soon', link: '#' },
        ],
      },
      {
        text: 'Security',
        items: [
          { text: 'Coming Soon', link: '#' },
        ],
      },
      {
        text: 'Software Engineering',
        items: [
          { text: 'Coming Soon', link: '#' },
        ],
      },
    ],

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
