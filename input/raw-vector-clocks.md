🔧 Vector Clocks: How Systems Track Causality Without Global Time

The abstraction:
Developers think of time as universal. If event A happens before event B, then timestamp(A) < timestamp(B) — always. In distributed systems, we use timestamps to order events, detect conflicts, and maintain consistency.

What happens underneath:
There is no global clock. Each node has its own wall-clock time, which drifts due to hardware differences, OS scheduling, and network delays. NTP can synchronize clocks to within milliseconds, but that's still not enough for causality.

Vector clocks solve this by tracking causal history instead of absolute time. Each process maintains a vector — one counter per process in the system. When process Pᵢ sends a message, it attaches its entire vector. The receiver merges: V[j] = max(V[j], received_V[j]) for all j, then increments its own counter.

The comparison rule is subtle:
- If VC(A)[i] ≤ VC(B)[i] for all i, and at least one is strictly less → A happened before B (A → B)
- If neither dominates → A and B are concurrent (A || B), meaning no causal path exists between them

This captures the "happened-before" relation Lamport defined in 1978, but unlike Lamport timestamps, vector clocks can detect concurrency, not just order events.

Why this matters:
When two writes are concurrent, you have a real conflict — neither causally depends on the other. This is the foundation of:
- Conflict-free replicated data types (CRDTs)
- Operational transformation in collaborative editors
- Causal message delivery in distributed messaging
- Debugging race conditions in distributed traces

Without vector clocks, you'd either need expensive global synchronization or accept that some conflicts slip through undetected.

Tiny example:
Three nodes: A, B, C

Initial state: all vectors = [0, 0, 0]

A sends message to B:
  A's vector before send: [1, 0, 0]
  Message carries: [1, 0, 0]

B receives and updates:
  B's vector = max([0,1,0], [1,0,0]) + increment own = [1, 2, 0]

C operates independently:
  C's vector = [0, 0, 2]

Compare B and C:
  B = [1, 2, 0], C = [0, 0, 2]
  Neither dominates → concurrent! No causal relationship.

One sharp takeaway:
Vector clocks don't tell you when something happened — they tell you what it knew about when it happened.

Rabbit hole:
Dotted version vectors compress vector clocks by storing only the last update per process, reducing space from O(n) to O(log n) on average while preserving causality detection.
