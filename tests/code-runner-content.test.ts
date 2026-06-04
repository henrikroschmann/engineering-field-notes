import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const topicPath = resolve(__dirname, '../docs/topics/distributed-systems/lease-based-distributed-locks.md')
const topicSource = readFileSync(topicPath, 'utf-8')

describe('CodeRunner topic content', () => {
  it('does not wrap Python Redis examples in the browser JavaScript runner', () => {
    expect(topicSource).not.toMatch(/<CodeRunner[\s\S]*import redis[\s\S]*print\(/)
  })
})
