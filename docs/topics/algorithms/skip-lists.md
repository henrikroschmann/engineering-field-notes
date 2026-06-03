---
title: "Skip Lists"
description: "How skip lists achieve O(log n) search, insert, and delete without tree rotations or complex rebalancing."
date: "2026-06-03"
category: "algorithms"
tags: ["skip-lists", "data-structures", "randomization", "concurrency"]
level: "intermediate"
---

<TopicLayout
  title="Skip Lists"
  subtitle="How skip lists achieve O(log n) search, insert, and delete without tree rotations or complex rebalancing."
  category="Algorithms"
  level="Intermediate"
  :tags="['Skip Lists', 'Data Structures', 'Randomization', 'Concurrency']"
  takeaway="Randomization isn't a hack — it's a design primitive that replaces deterministic balancing with probabilistic guarantees that are simpler to implement and easier to parallelize."
>

## The False Abstraction

A sorted data structure that supports search, insert, and delete in O(log n) time — like a balanced BST, but without any tree rotations or complex rebalancing logic. Redis uses skip lists for its sorted sets; Java's ConcurrentSkipListMap uses them for thread-safe ordered maps.

## What Actually Happens Underneath

A skip list is a layered linked structure. The bottom layer is a plain sorted linked list — every element, in order. Above it, a second layer "skips" roughly half the elements. A third layer skips half of those, and so on, up to a top layer with just one or two nodes.

Each node carries a random height — determined by a coin-flip process. When you insert a value, you flip a virtual coin: heads, the node gets promoted to the next level; tails, it stops. On average, half the nodes reach level 1, a quarter reach level 2, an eighth reach level 3, and so on. This geometric distribution naturally creates the logarithmic tower shape without any explicit balancing.

Search works top-down: start at the highest level, move right while the next node is still smaller than your target, then drop down one level and repeat. Because each level roughly halves the search space, you touch O(log n) nodes total — same asymptotic cost as a red-black tree, but with far simpler code.

Insertion follows the same top-down path to find where the new element belongs, then splices it into every level it qualifies for. Deletion removes the node from all levels it occupies. No rotations. No color flips. No parent pointers to maintain.

## Minimal Example

```
Level 3:  10 ──────────────────────→ 90
Level 2:  10 ───────→ 50 ──────────→ 90
Level 1:  10 ──→ 30 ──→ 50 ──→ 70 ──→ 90
Level 0:  10 → 20 → 30 → 40 → 50 → 60 → 70 → 80 → 90

Search for 65:
  Level 3: 10 < 65, next is 90 > 65 → drop down
  Level 2: 50 < 65, next is 90 > 65 → drop down
  Level 1: 50 < 65, next is 70 > 65 → drop down
  Level 0: 60 < 65, next is 70 > 65 → not found (between 60 and 70)
```

## Why This Matters

Skip lists trade a small constant-factor overhead (extra pointers per node) for dramatically simpler implementation and excellent concurrency properties. Because insertions and deletions only affect local links — not global structure — you can lock individual levels or use compare-and-swap operations instead of locking the entire tree. This is why concurrent skip list maps outperform tree-based alternatives under high contention.

## Failure Modes

- **Worst-case height**: With bad luck, a node could get promoted to many levels, degrading search to O(n). Most implementations cap max height to prevent this.
- **Space overhead**: Each node stores pointers for each level it occupies, using more memory than a flat linked list.
- **Cache locality**: Linked structure means poor spatial locality compared to array-based structures like B-trees.

## Sharp Takeaway

Randomization isn't a hack — it's a design primitive that replaces deterministic balancing with probabilistic guarantees that are simpler to implement and easier to parallelize.

## Rabbit Holes

The coin-flip promotion probability doesn't have to be ½. Choosing p = 1/3 or p = 1/4 changes the space-time tradeoff: fewer levels means less pointer overhead but slightly more nodes touched per search. Knuth's original 1987 paper analyzes the optimal p for different workload patterns — and Redis actually uses a fixed max level of 32 with p = 0.25 to cap memory usage while keeping operations fast.

<MiniQuiz
  question="What determines how many levels a new node occupies in a skip list?"
  :options="['The value being inserted', 'A random coin-flip process', 'The current size of the list', 'The position in sorted order']"
  :answer="1"
  explanation="Each insertion uses a random coin-flip process: heads promotes to the next level, tails stops. This geometric distribution naturally creates the logarithmic tower shape without explicit balancing."
/>

</TopicLayout>