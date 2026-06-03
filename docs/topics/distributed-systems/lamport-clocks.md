---
title: "Lamport Clocks"
description: "Logical timestamps that give a partial order of events across distributed processes."
date: "2025-01-10"
category: "distributed-systems"
tags: ["causality", "ordering", "logical-clocks"]
level: "beginner"
---

# Lamport Clocks

Lamport clocks (also called Lamport timestamps) are a simple mechanism for ordering events in a distributed system. Introduced by Leslie Lamport in his seminal 1978 paper "Time, Clocks, and the Ordering of Events in a Distributed System," they replace physical time with a logical counter that respects causality.

## The False Abstraction

The false abstraction is that you can use wall-clock timestamps to order events across machines. Even perfectly synchronized clocks disagree about event ordering when messages are in flight. Lamport clocks discard physical time entirely and build a consistent partial order from message exchange alone.

## What Actually Happens Underneath

Each process maintains a single integer counter. The rules are:

1. **Local event**: increment counter by 1, then execute the event
2. **Send message**: increment counter by 1, attach the counter value to the message
3. **Receive message**: set counter = `max(local, received) + 1`, then process the message

This guarantees the **happens-before** property: if event A causally precedes event B, then `C(A)` is less than `C(B)`. The converse is not true — a smaller timestamp does not mean the event happened first. Two events with different Lamport timestamps may be concurrent.

## Minimal Example

Two processes P1 and P2, both starting at 0:

1. P1 local event → L=1
2. P1 sends to P2 (L=2), message carries timestamp 2
3. P2 receives → L = max(0, 2) + 1 = 3
4. P2 local event → L=4

P1's send (L=2) correctly precedes P2's receive (L=3). But if P1 had done another local event reaching L=5 independently, we could not conclude it happened after P2's L=4 — they might be concurrent.

## Why This Matters

Lamport clocks are the simplest form of logical time and form the basis for:
- Distributed mutual exclusion algorithms (Ricart-Agrawala)
- Consistent broadcast protocols
- Understanding happens-before relationships
- The foundation upon which vector clocks are built

They're cheap — a single integer per process — but they sacrifice concurrency detection. You can tell if A happened before B, but you cannot distinguish "A happened before B" from "A and B are concurrent but A's counter is smaller."

## Failure Modes

- **No concurrency detection** — a smaller timestamp does not imply causal order. Two independent events may have different timestamps purely by chance.
- **Counter overflow** — in long-running systems, the integer can wrap around. Use 64-bit counters or reset strategies.
- **Not monotonic with physical time** — a later Lamport timestamp doesn't mean a later wall-clock time.

## Sharp Takeaway

Lamport clocks give you a *consistent* partial order at the cost of a single integer per process. They're necessary but not sufficient for full causal reasoning — vector clocks extend them by keeping per-process counters to detect concurrency.

## Rabbit Holes

- [Vector Clocks](/topics/distributed-systems/vector-clocks) — the natural extension that adds concurrency detection
- Hybrid logical clocks (HLC) — combining Lamport counters with physical timestamps
- The original paper: "Time, Clocks, and the Ordering of Events in a Distributed System" (1978)

<MiniQuiz question="What does Lamport's happens-before guarantee?" :options="['If A happened before B, then C(A) is less than C(B)', 'If C(A) is less than C(B), then A happened before B', 'Both directions', 'Neither direction']" :answer="0" explanation="Lamport clocks guarantee the forward direction only: if A happens-before B, then C(A) is less than C(B). The reverse does not hold." />

<CodeRunner />

