---
title: "Vector Clocks"
description: "How distributed systems track causal ordering without a global clock."
date: "2025-01-15"
category: "distributed-systems"
tags: ["causality", "ordering", "distributed-systems"]
level: "intermediate"
---

<TopicLayout
  title="Vector Clocks"
  subtitle="How systems track causality without relying on global time."
  category="Distributed Systems"
  level="Intermediate"
  :tags="['Causality', 'Distributed Systems', 'Clocks']"
  takeaway="Vector clocks do not tell you when something happened — they tell you what it knew about when it happened."
>

## The False Abstraction

The false abstraction is that "time" is universal. In a distributed system, there is no single clock that all nodes agree on. Even with NTP, clock drift and network latency mean that physical timestamps cannot reliably order events. Vector clocks replace the illusion of global time with an explicit causal graph.

## What Actually Happens Underneath

Each process maintains a vector of counters, one per process in the system. When process P<sub>i</sub> performs a local event or sends a message, it increments its own counter `V[i]`. When P<sub>j</sub> receives a message with vector `V_msg`, it merges by taking the element-wise maximum:

```
V[j][k] = max(V[j][k], V_msg[k])  for all k
```

Then it increments its own entry `V[j]`. This means every vector clock encodes the complete causal history of everything that node knows about.

## Minimal Example

Consider three processes P0, P1, P2, each starting with `[0, 0, 0]`:

1. P0 does a local event → `[1, 0, 0]`
2. P0 sends message to P1 (increments first) → P0 is `[2, 0, 0]`, message carries `[2, 0, 0]`
3. P1 receives from P0 → merges: `max([0,0,0], [2,0,0]) = [2,0,0]`, then increments own: `[2, 1, 0]`

P1's clock `[2, 1, 0]` now knows about both P0's two events and its own reception.

## Interactive: Try the Vector Clock Simulator

<VectorClockSimulator />

## Compare Two Events

<CausalCompare :initial-a="[1,2,0]" :initial-b="[0,0,2]" />

## Causal Comparison Rules

Given two vector clocks A and B of the same length:

- **A happened before B**: every component of A is ≤ the corresponding component of B, with at least one strictly less
- **B happened before A**: every component of B is ≤ the corresponding component of A, with at least one strictly less
- **Equal**: all components are identical
- **Concurrent**: neither dominates — some components of A are greater, others smaller

## Code: Causality Check in TypeScript

<CodeRunner :initial-code="`function compareVectors(a, b) {\\n  if (a.length !== b.length) return 'invalid'\\n  let aLeB = true, bLeA = true, equal = true\\n  for (let i = 0; i < a.length; i++) {\\n    if (a[i] > b[i]) aLeB = false\\n    if (b[i] > a[i]) bLeA = false\\n    if (a[i] !== b[i]) equal = false\\n  }\\n  if (equal) return 'equal'\\n  if (aLeB) return 'a before b'\\n  if (bLeA) return 'b before a'\\n  return 'concurrent'\\n}\\n\\nconsole.log(compareVectors([1,2,0], [0,0,2]))\\nconsole.log(compareVectors([1,1], [2,2]))\\nconsole.log(compareVectors([2,2], [2,2]))`" />

## Why This Matters

Vector clocks are the foundation for:

<div class="efn-grid efn-grid--2col" style="margin:1rem 0;">
  <div class="efn-card">
    <div class="efn-card-title">CRDTs</div>
    <div class="efn-card-description">Conflict-free replicated data types use vector clocks to resolve concurrent updates without coordination.</div>
  </div>
  <div class="efn-card">
    <div class="efn-card-title">Collaborative Editors</div>
    <div class="efn-card-description">Real-time collaboration systems track causal order of edits from multiple users across the network.</div>
  </div>
  <div class="efn-card">
    <div class="efn-card-title">Causal Message Delivery</div>
    <div class="efn-card-description">Ensuring messages are delivered in causal order prevents race conditions in distributed applications.</div>
  </div>
  <div class="efn-card">
    <div class="efn-card-title">Distributed Tracing</div>
    <div class="efn-card-description">Trace spans use causal ordering to reconstruct the execution path of requests across services.</div>
  </div>
</div>

Without them, you cannot reliably determine whether two events are causally related or merely happened to have different wall-clock timestamps.

## Failure Modes

- **Vector size grows with process count** — in large systems, full vector clocks become expensive. Lamport timestamps are cheaper but lose concurrency detection.
- **Garbage collection of old entries** — pruning vector entries loses causal information and can cause false concurrency detection.
- **Not a total order** — vector clocks can tell you if A happened before B or if they are concurrent, but they cannot totally order concurrent events without a tiebreaker.

## Rabbit Holes

- [Lamport timestamps](/topics/distributed-systems/lamport-clocks) — simpler but weaker logical clocks
- Hybrid logical clocks (HLC) — combining physical and logical time
- Version vectors in Bayou and Dynamo
- CRDTs and conflict resolution

<MiniQuiz
  question="If vector clock A = [2, 1, 0] and B = [1, 2, 0], what is their causal relationship?"
  :options="['A happened before B', 'B happened before A', 'Concurrent', 'Equal']"
  :answer="2"
  explanation="A[0]=2 is greater than B[0]=1 but A[1]=1 is less than B[1]=2. Neither dominates the other, so they are concurrent."
/>

</TopicLayout>
