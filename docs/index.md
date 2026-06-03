---
layout: home

hero:
  name: "Engineering Field Notes"
  text: "Deep dives into systems internals"
  tagline: Daily engineering topics explained from first principles — distributed systems, databases, networking, concurrency, and more.
  actions:
    - theme: brand
      text: Browse Topics
      link: /topics/distributed-systems/vector-clocks
    - theme: alt
      text: View on GitHub
      link: https://github.com/placeholder/engineering-field-notes

features:
  - icon: 🌐
    title: Distributed Systems
    details: Consensus, replication, vector clocks, partition tolerance, and the hard problems of building systems that span machines.
  - icon: 🗄️
    title: Databases
    details: Storage engines, query optimization, transactions, isolation levels, and what happens when you write a SQL statement.
  - icon: 🔌
    title: Networking
    details: TCP, HTTP, DNS, load balancing, service meshes, and the protocols that glue everything together.
  - icon: 🏗️
    title: System Design
    details: Architecture patterns, scalability tradeoffs, caching strategies, and how to reason about complex systems.
  - icon: ⚡
    title: Concurrency
    details: Threads, locks, async I/O, actor models, and the subtle bugs that appear only under contention.
  - icon: 🔍
    title: Observability
    details: Logging, metrics, tracing, dashboards, and how to understand what your system is doing in production.
  - icon: 🔒
    title: Security
    details: AuthN/AuthZ, encryption, threat modeling, supply chain, and the principles of secure design.
  - icon: 🛠️
    title: Software Engineering
    details: Testing strategies, CI/CD, code review, refactoring, and the craft of building maintainable software.
---

## Recently Added

- **[Vector Clocks](/topics/distributed-systems/vector-clocks)** — How distributed systems track causal ordering without a global clock.
- **[Lamport Clocks](/topics/distributed-systems/lamport-clocks)** — Logical timestamps that give a partial order of events across processes.

## Continue Learning

Explore topics by category in the sidebar, or search for a specific concept. Each page includes explanations, interactive simulations, and quizzes to test your understanding.

## Popular Topics

| Topic | Category | Level |
|-------|----------|-------|
| [Vector Clocks](/topics/distributed-systems/vector-clocks) | Distributed Systems | Intermediate |
| [Lamport Clocks](/topics/distributed-systems/lamport-clocks) | Distributed Systems | Beginner |

## Roadmap

- [ ] CAP theorem deep dive
- [ ] Raft consensus algorithm
- [ ] LSM trees vs B-trees
- [ ] Consistent hashing
- [ ] gRPC and protocol buffers
- [ ] Circuit breaker pattern
- [ ] OpenTelemetry fundamentals
- [ ] Zero-trust architecture
