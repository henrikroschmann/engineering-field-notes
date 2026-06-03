#!/usr/bin/env node

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'

const topicsDir = resolve('docs', 'topics')
const outputDir = resolve('docs', '.vitepress')
const outputFile = join(outputDir, 'sidebar.generated.ts')

interface SidebarItem {
  text: string
  link: string
  order?: number
}

interface SidebarGroup {
  text: string
  items: SidebarItem[]
}

function scanTopics(): SidebarGroup[] {
  const groups: SidebarGroup[] = []

  if (!dirExists(topicsDir)) return groups

  const categories = readdirSync(topicsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

  for (const category of categories) {
    const catDir = join(topicsDir, category)
    const files = readdirSync(catDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({ file: f, path: join(catDir, f) }))

    const items: SidebarItem[] = []

    for (const { file, path } of files) {
      const slug = file.replace(/\.md$/, '')
      const link = `/topics/${category}/${slug}`

      let text = capitalize(slug.replace(/-/g, ' '))
      let order: number | undefined

      try {
        const content = readFileSync(path, 'utf-8')
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
        if (fmMatch) {
          const fm = fmMatch[1]
          const titleMatch = fm.match(/title:\s*["']?([^"'\n]+)["']?/)
          if (titleMatch) text = titleMatch[1].trim()
          const orderMatch = fm.match(/order:\s*(\d+)/)
          if (orderMatch) order = parseInt(orderMatch[1], 10)
        }
      } catch {
        // skip files that can't be read
      }

      items.push({ text, link, order })
    }

    items.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order
      if (a.order !== undefined) return -1
      if (b.order !== undefined) return 1
      return a.text.localeCompare(b.text)
    })

    groups.push({
      text: capitalize(category.replace(/-/g, ' ')),
      items: items.map(({ text, link }) => ({ text, link })),
    })
  }

  return groups
}

function dirExists(path: string): boolean {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

function capitalize(str: string): string {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}

const groups = scanTopics()

const tsContent = `// Auto-generated sidebar configuration
// Run "npm run topic:sidebar" to regenerate

export const sidebar = ${JSON.stringify(groups, null, 2)}

export default sidebar
`

writeFileSync(outputFile, tsContent, 'utf-8')
console.log(`✓ Generated ${outputFile}`)
console.log(`  ${groups.length} category group(s), ${groups.reduce((n, g) => n + g.items.length, 0)} page(s)`)
