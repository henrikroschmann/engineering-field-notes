#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'

interface TopicSection {
  key: string
  content: string
}

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: ingest-topic.ts <path-to-topic.json>')
  process.exit(1)
}

const absolutePath = resolve(filePath)

let raw: string
try {
  raw = readFileSync(absolutePath, 'utf-8')
} catch {
  console.error(`Error: Cannot read file "${absolutePath}"`)
  process.exit(1)
}

let data: unknown
try {
  data = JSON.parse(raw)
} catch {
  console.error('Error: File is not valid JSON.')
  process.exit(1)
}

if (typeof data !== 'object' || data === null || Array.isArray(data)) {
  console.error('Error: Topic JSON must be an object.')
  process.exit(1)
}

const obj = data as Record<string, unknown>
const errors: string[] = []

if (!obj.title || typeof obj.title !== 'string') errors.push('"title" is required and must be a non-empty string.')
if (!obj.slug || typeof obj.slug !== 'string') {
  errors.push('"slug" is required and must be a non-empty string.')
} else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(obj.slug)) {
  errors.push('"slug" must be kebab-case (lowercase letters, numbers, hyphens).')
}
if (!obj.category || typeof obj.category !== 'string') errors.push('"category" is required and must be a non-empty string.')
if (!obj.summary || typeof obj.summary !== 'string') errors.push('"summary" is required and must be a non-empty string.')
if (!obj.sections || !Array.isArray(obj.sections) || obj.sections.length === 0) {
  errors.push('"sections" is required and must be a non-empty array.')
} else {
  obj.sections.forEach((section, index) => {
    if (typeof section !== 'object' || section === null || Array.isArray(section)) {
      errors.push(`"sections[${index}]" must be an object.`)
      return
    }

    const entry = section as Record<string, unknown>
    if (typeof entry.key !== 'string' || entry.key.trim() === '') {
      errors.push(`"sections[${index}].key" is required and must be a non-empty string.`)
    }
    if (typeof entry.content !== 'string' || entry.content.trim() === '') {
      errors.push(`"sections[${index}].content" is required and must be a non-empty string.`)
    }
  })
}

if (errors.length > 0) {
  console.error('Validation failed:')
  for (const err of errors) console.error(`  - ${err}`)
  process.exit(1)
}

const title = obj.title as string
const slug = obj.slug as string
const category = obj.category as string
const summary = obj.summary as string
const sections = obj.sections as TopicSection[]
const tags = (obj.tags as string[]) || []
const level = obj.level || 'intermediate'
const date = new Date().toISOString().split('T')[0]

const categorySlug = slugify(category)
const targetDir = resolve('docs', 'topics', categorySlug)
const targetFile = join(targetDir, `${slug}.md`)

mkdirSync(targetDir, { recursive: true })

const frontmatterTags = tags.length > 0 ? `tags: [${tags.map(t => `"${t}"`).join(', ')}]` : 'tags: []'

let md = `---\ntitle: "${title.replace(/"/g, '\\"')}"\n`
md += `description: "${summary.replace(/"/g, '\\"').slice(0, 160)}"\n`
md += `date: "${date}"\n`
md += `category: "${category}"\n`
md += `${frontmatterTags}\n`
md += `level: "${String(level).toLowerCase()}"\n---\n\n`

md += `# ${title}\n\n`
md += `${summary}\n\n`

const sectionTitles: Record<string, string> = {
  'false-abstraction': '## The False Abstraction',
  'what-happens-underneath': '## What Actually Happens Underneath',
  'minimal-example': '## Minimal Example',
  'interactive-section': '## Interactive Section',
  'why-this-matters': '## Why This Matters',
  'failure-modes': '## Failure Modes',
  'sharp-takeaway': '## Sharp Takeaway',
  'rabbit-holes': '## Rabbit Holes',
}

const sectionOrder = Object.keys(sectionTitles)
const sectionsByKey = new Map(sections.map(section => [section.key, section.content]))
const interactive = Array.isArray(obj.interactive) ? obj.interactive.filter(item => typeof item === 'string') : []

for (const key of sectionOrder) {
  if (key === 'interactive-section') {
    if (interactive.length === 0) continue

    md += `## Interactive Section\n\n${sectionsByKey.get('interactive-section') || ''}\n\n`
    for (const comp of interactive) {
      switch (comp) {
        case 'vector-clock-simulator':
          md += `<VectorClockSimulator />\n\n`
          break
        case 'causal-compare':
          md += `<CausalCompare :initial-a="[1,2,0]" :initial-b="[0,0,2]" />\n\n`
          break
      }
    }
    continue
  }

  const content = sectionsByKey.get(key) || '_Add notes here._'
  md += `${sectionTitles[key]}\n\n${content}\n\n`
}

for (const section of sections) {
  if (sectionOrder.includes(section.key)) continue
  md += `## ${capitalize(section.key.replace(/-/g, ' '))}\n\n${section.content}\n\n`
}

const quiz = obj.quiz as Record<string, unknown> | undefined
if (quiz) {
  const q = quiz.question as string
  const opts = quiz.options as string[]
  const ans = quiz.answer as number
  const expl = quiz.explanation as string | undefined

  if (typeof q === 'string' && Array.isArray(opts) && opts.every(o => typeof o === 'string') && typeof ans === 'number') {
    const props = {
      question: q,
      options: opts,
      answer: ans,
      ...(typeof expl === 'string' ? { explanation: expl } : {}),
    }
    md += `<MiniQuiz v-bind='${escapeHtmlAttribute(JSON.stringify(props))}' />\n\n`
  }
}

writeFileSync(targetFile, md, 'utf-8')
console.log(`✓ Created ${targetFile}`)

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
