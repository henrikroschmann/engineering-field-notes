---
title: "Buffer Pool Replacement"
description: "Why naive LRU fails for database caching and how databases engineer around scan interference."
date: "2026-06-03"
category: "databases"
tags: ["buffer-pool", "caching", "lru", "databases"]
level: "intermediate"
---

<TopicLayout
  title="Buffer Pool Replacement"
  subtitle="Why naive LRU fails for database caching and how databases engineer around scan interference."
  category="Databases"
  level="Intermediate"
  :tags="['Buffer Pool', 'Caching', 'LRU', 'Databases']"
  takeaway="LRU assumes reuse is predictable by time alone — but databases know that frequency of access matters more than recency, and they engineer around that insight."
>

## The False Abstraction

You query a database, and it magically returns results — sometimes from memory in microseconds, sometimes from disk in milliseconds. The database just "caches" things intelligently.

## What Actually Happens Underneath

Every major relational database (PostgreSQL, MySQL/InnoDB, SQLite) maintains a buffer pool — a fixed-size chunk of RAM that holds recently-used data pages. When the pool is full and a new page needs to be loaded, the database must evict one existing page. The choice of which page to evict dramatically affects performance.

The obvious answer is Least Recently Used (LRU): evict the page accessed longest ago. But LRU has a fatal flaw in database workloads called the scan interference problem. When you run a sequential full-table scan, every page touched gets marked "recently used." The buffer pool fills with one-time-use scan pages, pushing out genuinely hot data that will be needed again. After the scan completes, your cache is full of garbage — performance tanks until hot pages are reloaded from disk.

Databases solve this with modified replacement policies:

- **CLOCK algorithm** (used by PostgreSQL's buffer manager): Instead of a true LRU queue, pages sit in a circular list with a single "reference bit." A hand sweeps around the circle. When it encounters a page with the reference bit set, it clears the bit and moves on — giving that page one more chance. Pages with the bit cleared get evicted immediately. Sequential scan pages are touched once (bit set), then cleared on the next sweep pass and evicted. Hot pages get re-accessed frequently, so their bits keep getting reset before eviction.

- **Two-Queue LRU** (used by InnoDB): Pages go into a middle queue first. If accessed again, they graduate to the hot queue. The hot queue is protected from eviction — only the middle queue is scanned for victims. A one-time scan page stays in middle and gets evicted quickly; a genuinely reused page graduates to hot and survives.

- **Clock-Pro** (used by Oracle): Adds a "history bit" that tracks whether a page was accessed before its current residence in the buffer pool. This distinguishes between pages that are hot because they're being scanned sequentially versus pages that are hot because they're genuinely reused across queries.

## Minimal Example

```sql
-- This sequential scan poisons a naive LRU buffer pool:
SELECT COUNT(*) FROM orders WHERE created_at > '2026-01-01';

-- After this runs, your buffer pool is full of order pages
-- that will never be accessed again. Your hot customer data
-- has been evicted to disk.

-- With CLOCK or two-queue, those scan pages get evicted
-- quickly, preserving your frequently-accessed indexes.
```

## Why This Matters

A poorly-tuned buffer replacement policy can turn a sub-millisecond query into a 50ms disk read — a 50x slowdown on every subsequent query. In high-throughput systems, scan interference from reporting queries can starve OLTP workloads of cache, causing cascading latency spikes. Understanding this helps you structure queries and indexes to be cache-friendly.

## Failure Modes

- **Scan interference**: Sequential scans poison naive LRU caches, evicting hot pages that will be reused.
- **Wrong policy for workload**: CLOCK works well for mixed workloads but may underperform for purely random access patterns where true LRU is fine.
- **Pool sizing**: An undersized buffer pool amplifies replacement costs — every page load requires an eviction decision.

## Sharp Takeaway

LRU assumes reuse is predictable by time alone — but databases know that frequency of access matters more than recency, and they engineer around that insight.

## Rabbit Holes

- Adaptive replacement cache (ARC) — the algorithm used by ZFS and some modern databases — dynamically partitions memory between hot and cold queues based on observed access patterns, approaching theoretical optimal cache performance without knowing future requests.

<MiniQuiz
  question="What problem does the CLOCK algorithm solve that naive LRU cannot?"
  :options="['Memory fragmentation', 'Scan interference from sequential reads', 'Concurrent access conflicts', 'Disk I/O scheduling']"
  :answer="1"
  explanation="The CLOCK algorithm uses a reference bit to give pages a second chance before eviction. Sequential scan pages are touched once (bit set), then cleared on the next sweep and evicted, while genuinely hot pages keep getting their bits reset by repeated access."
/>

</TopicLayout>