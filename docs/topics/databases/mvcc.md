---
title: "MVCC"
description: "How multi-version concurrency control lets readers and writers proceed without blocking each other."
date: "2026-06-03"
category: "databases"
tags: ["mvcc", "concurrency", "transactions", "databases"]
level: "intermediate"
---

<TopicLayout
  title="MVCC"
  subtitle="How multi-version concurrency control lets readers and writers proceed without blocking each other."
  category="Databases"
  level="Intermediate"
  :tags="['MVCC', 'Concurrency', 'Transactions', 'Databases']"
  takeaway="MVCC trades storage for concurrency — you keep old versions around so readers can see consistent snapshots without blocking anyone."
>

## The False Abstraction

When you run `SELECT * FROM users WHERE id = 1`, you expect to get the current data without blocking writers or being blocked by them. Most developers assume databases just read whatever's in memory.

## What Actually Happens Underneath

Modern databases like PostgreSQL and MySQL InnoDB use Multi-Version Concurrency Control (MVCC). Every row stores not just data, but transaction metadata: a xmin (creating transaction ID) and xmax (deleting transaction ID), plus a freeze bit.

When your SELECT starts, the database captures a snapshot — essentially "transaction X is visible to me." The visibility rules are brutal but elegant:

- A row is visible if xmin <= snapshot AND (xmax > snapshot OR xmax = 0)
- If xmin > snapshot, the row didn't exist yet when you started reading
- If xmax <= snapshot, the row was already deleted when you started reading

The database maintains a "committed transaction map" in shared memory. When checking visibility, it doesn't need to lock anything — it just compares integers.

## Minimal Example

```
-- Transaction A starts (snapshot = 100)
-- Transaction B inserts row with xmin=101, commits
-- Transaction A SELECTs -> row NOT visible (101 > 100)
-- Transaction A sees a consistent view of the past
```

## Why This Matters

Readers never block writers, and writers never block readers. A long-running analytical query won't stall your checkout page. This is why PostgreSQL can handle thousands of concurrent connections without the read/write contention that plagues lock-based systems.

## Failure Modes

- **Table bloat**: Dead tuple versions accumulate until vacuuming reclaims them. Without regular vacuuming, tables grow indefinitely and queries slow down as they scan dead rows.
- **Transaction ID wraparound**: Transaction IDs are finite integers. If they wrap around to zero without proper maintenance, the database can't distinguish old from new transactions, risking data corruption.
- **Snapshot too old**: Long-running transactions prevent vacuuming of rows they still need to see, causing table bloat and eventually "could not serialize access" errors.

## Sharp Takeaway

MVCC trades storage for concurrency — you keep old versions around so readers can see consistent snapshots without blocking anyone.

## Rabbit Holes

Vacuuming — how databases reclaim space from dead tuple versions without breaking active transactions' visibility windows.

<MiniQuiz
  question="Why doesn't Transaction A see a row inserted by Transaction B after A started?"
  :options="['Because B has not committed yet', 'Because the row creation ID is greater than A snapshot', 'Because MVCC uses row-level locks', 'Because the row is stored in a separate tablespace']"
  :answer="1"
  explanation="MVCC assigns each row a creating transaction ID. A row is only visible if its creation ID is less than or equal to the reader snapshot. Since B row has ID 101 and A snapshot is 100, the row is invisible to A."
/>

</TopicLayout>