#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Usage: validate-topic.ts <path-to-topic.json>')
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

if (!obj.title || typeof obj.title !== 'string') {
  errors.push('"title" is required and must be a non-empty string.')
}

if (!obj.slug || typeof obj.slug !== 'string') {
  errors.push('"slug" is required and must be a non-empty string.')
} else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(obj.slug)) {
  errors.push('"slug" must be kebab-case (lowercase letters, numbers, hyphens).')
}

if (!obj.category || typeof obj.category !== 'string') {
  errors.push('"category" is required and must be a non-empty string.')
}

if (!obj.summary || typeof obj.summary !== 'string') {
  errors.push('"summary" is required and must be a non-empty string.')
}

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
  for (const err of errors) {
    console.error(`  - ${err}`)
  }
  process.exit(1)
}

console.log(`✓ Topic "${obj.title}" is valid.`)
process.exit(0)
