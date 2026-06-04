<script setup lang="ts">
import { withBase } from 'vitepress'

const featuredNote = {
  issue: 'Field Note 008',
  title: 'Vector Clocks',
  subtitle: 'How systems track causality without pretending global time exists.',
  category: 'Distributed Systems',
  level: 'Intermediate',
  date: 'Jun 03, 2026',
  readTime: '8 min read',
  summary: 'Vector clocks replace wall-clock certainty with explicit causal history. They tell you when events are ordered, when they are equal, and when the system must admit concurrency.',
  link: '/topics/distributed-systems/vector-clocks',
}

const latestNotes = [
  { title: 'Lease-Based Distributed Locks', date: 'Jun 04', category: 'Distributed Systems', level: 'Intermediate', readTime: '9 min', summary: 'Fast coordination with expiration, renewal, fencing, and the failure modes that make leases dangerous.', link: '/topics/distributed-systems/lease-based-distributed-locks' },
  { title: 'Vector Clocks', date: 'Jun 03', category: 'Distributed Systems', level: 'Intermediate', readTime: '8 min', summary: 'Causal ordering without synchronized clocks using per-process vector timestamps.', link: '/topics/distributed-systems/vector-clocks' },
  { title: 'MVCC in Databases', date: 'Jun 01', category: 'Databases', level: 'Intermediate', readTime: '10 min', summary: 'Multi-version concurrency control lets readers and writers proceed without blocking each other.', link: '/topics/databases/mvcc' },
  { title: 'Bloom Filters', date: 'May 30', category: 'Algorithms', level: 'Intermediate', readTime: '7 min', summary: 'Probabilistic set membership with fixed memory and controlled false positives.', link: '/topics/algorithms/bloom-filter' },
  { title: 'Circuit Breaker', date: 'May 28', category: 'Distributed Systems', level: 'Beginner', readTime: '6 min', summary: 'Stop cascading failures by turning repeated downstream errors into an explicit state machine.', link: '/topics/distributed-systems/circuit-breaker' },
]

const systemsIndex = [
  { label: 'Distributed Systems', count: 3, description: 'Causality, coordination, replication, and failure semantics.', link: '/topics/distributed-systems/vector-clocks' },
  { label: 'Databases', count: 2, description: 'Storage engines, concurrency control, and buffer management.', link: '/topics/databases/mvcc' },
  { label: 'Algorithms', count: 2, description: 'Data structures with operational constraints and tradeoffs.', link: '/topics/algorithms/bloom-filter' },
  { label: 'Networking', count: 1, description: 'Packets, overlays, transport behavior, and network boundaries.', link: '/topics/networking/container-network-overlay' },
]

const upcomingNotes = [
  'CAP Theorem in real incidents',
  'Raft log replication',
  'LSM trees vs B-trees',
  'Write-ahead logging',
]
</script>

<template>
  <main class="field-home">
    <section class="field-home__hero">
      <div class="field-home__masthead">
        <p class="field-home__eyebrow">Engineering Field Notes</p>
        <h1>Systems explained from the metal up.</h1>
        <p class="field-home__dek">
          A technical magazine for engineers who want the mechanism, the failure mode,
          and the operational takeaway in the same place.
        </p>
        <div class="field-home__actions">
          <a class="field-home__primary" :href="withBase(featuredNote.link)">Read the featured note</a>
          <a class="field-home__secondary" href="#latest-notes">Browse latest notes</a>
        </div>
      </div>

      <article class="field-home__feature">
        <div class="field-home__feature-meta">
          <span>{{ featuredNote.issue }}</span>
          <span>{{ featuredNote.date }}</span>
        </div>
        <a :href="withBase(featuredNote.link)">
          <h2>{{ featuredNote.title }}</h2>
        </a>
        <p class="field-home__feature-subtitle">{{ featuredNote.subtitle }}</p>
        <p>{{ featuredNote.summary }}</p>
        <div class="field-home__meta-row">
          <span>{{ featuredNote.category }}</span>
          <span>{{ featuredNote.level }}</span>
          <span>{{ featuredNote.readTime }}</span>
        </div>
      </article>

      <aside class="field-home__rail" aria-label="Latest notes">
        <h2>Latest</h2>
        <a v-for="note in latestNotes.slice(0, 4)" :key="note.title" :href="withBase(note.link)" class="field-home__rail-item">
          <span>{{ note.date }}</span>
          <strong>{{ note.title }}</strong>
        </a>
      </aside>
    </section>

    <section id="latest-notes" class="field-home__section">
      <div class="field-home__section-header">
        <p class="field-home__eyebrow">Latest Field Notes</p>
        <h2>Recent observations</h2>
      </div>
      <div class="field-home__note-grid">
        <a v-for="note in latestNotes" :key="note.title" :href="withBase(note.link)" class="field-home__note-card">
          <span class="field-home__note-category">{{ note.category }}</span>
          <h3>{{ note.title }}</h3>
          <p>{{ note.summary }}</p>
          <div class="field-home__meta-row">
            <span>{{ note.level }}</span>
            <span>{{ note.date }}</span>
            <span>{{ note.readTime }}</span>
          </div>
        </a>
      </div>
    </section>

    <section class="field-home__section field-home__section--split">
      <div>
        <p class="field-home__eyebrow">Systems Index</p>
        <h2>Browse by operating surface</h2>
        <div class="field-home__index-grid">
          <a v-for="item in systemsIndex" :key="item.label" :href="withBase(item.link)" class="field-home__index-card">
            <div>
              <h3>{{ item.label }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <span>{{ item.count }} notes</span>
          </a>
        </div>
      </div>

      <aside class="field-home__queue">
        <p class="field-home__eyebrow">Upcoming Field Notes</p>
        <ul>
          <li v-for="topic in upcomingNotes" :key="topic">{{ topic }}</li>
        </ul>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.field-home {
  --field-home-text: #f8fafc;
  --field-home-muted: #d7e0ec;
  --field-home-faint: #b6c2d1;

  width: min(1180px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 48px 0 72px;
}

.field-home__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.85fr) 260px;
  gap: 28px;
  align-items: stretch;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.field-home__masthead,
.field-home__feature,
.field-home__rail,
.field-home__note-card,
.field-home__index-card,
.field-home__queue {
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.96));
  border: 1px solid rgba(148, 163, 184, 0.18);
  box-shadow: 0 24px 80px rgba(2, 6, 23, 0.26);
}

.field-home__masthead {
  padding: 34px;
}

.field-home__eyebrow {
  margin: 0 0 14px;
  color: #7dd3fc;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.field-home h1,
.field-home h2,
.field-home h3,
.field-home p {
  margin-top: 0;
}

.field-home h1 {
  max-width: 680px;
  margin-bottom: 18px;
  color: var(--field-home-text);
  font-size: clamp(3rem, 8vw, 5.8rem);
  line-height: 0.92;
  letter-spacing: -0.075em;
}

.field-home__dek {
  max-width: 620px;
  color: var(--field-home-muted);
  font-size: 1.1rem;
  line-height: 1.7;
}

.field-home__actions,
.field-home__meta-row,
.field-home__feature-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.field-home__actions {
  margin-top: 30px;
}

.field-home__primary,
.field-home__secondary {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid rgba(125, 211, 252, 0.38);
  color: var(--field-home-text);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
}

.field-home__primary {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}

.field-home__secondary {
  background: rgba(15, 23, 42, 0.72);
}

.field-home__feature,
.field-home__rail {
  padding: 24px;
}

.field-home__feature-meta,
.field-home__meta-row {
  color: var(--field-home-faint);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.field-home__feature h2 {
  margin: 18px 0 10px;
  color: var(--field-home-text);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.field-home__feature-subtitle {
  color: #bae6fd;
  font-size: 1rem;
  line-height: 1.6;
}

.field-home__feature p,
.field-home__note-card p,
.field-home__index-card p {
  color: var(--field-home-muted);
  line-height: 1.65;
}

.field-home__rail h2 {
  margin-bottom: 14px;
  color: var(--field-home-text);
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.field-home__rail-item {
  display: grid;
  gap: 5px;
  padding: 14px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.16);
  color: inherit;
  text-decoration: none;
}

.field-home__rail-item span {
  color: var(--field-home-faint);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.field-home__rail-item strong {
  color: var(--field-home-text);
  font-size: 0.95rem;
}

.field-home__section {
  margin-top: 46px;
}

.field-home__section-header {
  margin-bottom: 18px;
}

.field-home__section h2 {
  color: var(--vp-c-text-1);
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1;
  letter-spacing: -0.06em;
}

.field-home__note-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.field-home__note-card {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  padding: 22px;
  color: var(--field-home-text);
  text-decoration: none;
}

.field-home__note-card h3,
.field-home__index-card h3 {
  color: var(--field-home-text);
}

.field-home__note-card p {
  flex: 1;
}

.field-home__note-category {
  margin-bottom: 16px;
  color: #7dd3fc;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.field-home__section--split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
}

.field-home__index-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field-home__index-card {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 20px;
  color: var(--field-home-text);
  text-decoration: none;
}

.field-home__index-card span {
  color: #7dd3fc;
  white-space: nowrap;
}

.field-home__queue {
  padding: 22px;
}

.field-home__queue ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.field-home__queue li {
  padding: 13px 0;
  border-top: 1px solid rgba(148, 163, 184, 0.16);
  color: var(--field-home-muted);
}

@media (max-width: 1080px) {
  .field-home__hero,
  .field-home__section--split {
    grid-template-columns: 1fr;
  }

  .field-home__note-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .field-home {
    width: min(100% - 28px, 1180px);
    padding-top: 28px;
  }

  .field-home__masthead,
  .field-home__feature,
  .field-home__rail,
  .field-home__note-card,
  .field-home__index-card,
  .field-home__queue {
    padding: 18px;
  }

  .field-home__note-grid,
  .field-home__index-grid {
    grid-template-columns: 1fr;
  }
}
</style>
