import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const componentSource = readFileSync(
  resolve(__dirname, '../docs/.vitepress/theme/components/FieldJournalHome.vue'),
  'utf-8',
)

describe('FieldJournalHome featured note', () => {
  it('derives the featured note from the first latest note', () => {
    expect(componentSource).toContain('const featuredNote = latestNotes[0]')
  })

  it('features Lease-Based Distributed Locks as the latest field note', () => {
    expect(componentSource).toContain("title: 'Lease-Based Distributed Locks'")
    expect(componentSource).toContain("issue: 'Field Note 009'")
    expect(componentSource).toContain("date: 'Jun 04, 2026'")
    expect(componentSource).toContain("link: '/topics/distributed-systems/lease-based-distributed-locks'")
  })

  it('keeps Vector Clocks after the latest note', () => {
    expect(componentSource.indexOf("title: 'Lease-Based Distributed Locks'")).toBeLessThan(
      componentSource.indexOf("title: 'Vector Clocks'"),
    )
  })
})
