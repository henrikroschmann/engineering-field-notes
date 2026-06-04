# Editorial Ledger Field Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Engineering Field Notes render successfully and give both the homepage and topic pages a cohesive Editorial Ledger technical-magazine design.

**Architecture:** Keep the existing VitePress theme extension and global component registration. Update the static `FieldJournalHome.vue` homepage component and the shared `TopicLayout.vue` article shell, with supporting global CSS and one Markdown build fix.

**Tech Stack:** VitePress 1.6, Vue 3 SFCs with `<script setup lang="ts">`, Markdown Vue components, CSS custom properties.

---

## File Structure

- Modify `docs/topics/distributed-systems/lease-based-distributed-locks.md`: fix the invalid Vue expression used by `<CodeRunner>` so the site builds.
- Modify `docs/.vitepress/theme/components/FieldJournalHome.vue`: replace dashboard-style markup and styles with the Editorial Ledger homepage.
- Modify `docs/.vitepress/theme/components/TopicLayout.vue`: replace inline-heavy topic shell with semantic classes and editorial article styling.
- Modify `docs/.vitepress/theme/style.css`: adjust global doc typography, code blocks, and layout polish that supports the Editorial Ledger reading experience.
- Verify `docs/index.md` still renders `<FieldJournalHome />` and `docs/.vitepress/theme/index.ts` still registers `FieldJournalHome` and `TopicLayout`.

## Task 1: Fix Build-Blocking CodeRunner Expression

**Files:**
- Modify: `docs/topics/distributed-systems/lease-based-distributed-locks.md:64`

- [ ] **Step 1: Confirm current build failure**

Run: `npm run docs:build`

Expected: FAIL with a Vue compiler error pointing to `docs/topics/distributed-systems/lease-based-distributed-locks.md` and `Error parsing JavaScript expression`.

- [ ] **Step 2: Replace the invalid prop expression**

In `docs/topics/distributed-systems/lease-based-distributed-locks.md`, replace the current line:

```md
<CodeRunner :initial-code="import redis\nr = redis.Redis()\nlock_key = 'order:process:1234'\nacquired = r.set(lock_key, 'worker-7', nx=True, ex=30)\nprint('Lock acquired:', acquired)" />
```

with this valid Vue expression:

```md
<CodeRunner :initial-code="`import redis\nr = redis.Redis()\nlock_key = 'order:process:1234'\nacquired = r.set(lock_key, 'worker-7', nx=True, ex=30)\nprint('Lock acquired:', acquired)`" />
```

- [ ] **Step 3: Verify the build advances past the original error**

Run: `npm run docs:build`

Expected: The original `lease-based-distributed-locks.md` Vue expression error is gone. If another independent build error appears, record the new file and message before changing anything else.

- [ ] **Step 4: Commit the build fix**

Run:

```bash
git add docs/topics/distributed-systems/lease-based-distributed-locks.md
git commit -m "Fix lease lock code runner expression"
```

Expected: Commit succeeds and includes only the Markdown build fix.

## Task 2: Implement Editorial Ledger Homepage

**Files:**
- Modify: `docs/.vitepress/theme/components/FieldJournalHome.vue`
- Verify: `docs/index.md`
- Verify: `docs/.vitepress/theme/index.ts`

- [ ] **Step 1: Verify homepage component wiring**

Check `docs/index.md` contains:

```md
---
layout: page
sidebar: false
aside: false
---

<FieldJournalHome />
```

Check `docs/.vitepress/theme/index.ts` imports and registers `FieldJournalHome`:

```ts
import FieldJournalHome from './components/FieldJournalHome.vue'

app.component('FieldJournalHome', FieldJournalHome)
```

If either is missing, add only the missing import, registration, or Markdown component line.

- [ ] **Step 2: Replace `FieldJournalHome.vue` script data**

Use this script block in `docs/.vitepress/theme/components/FieldJournalHome.vue`:

```vue
<script setup lang="ts">
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
```

- [ ] **Step 3: Replace homepage template**

Use this template block in `docs/.vitepress/theme/components/FieldJournalHome.vue`:

```vue
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
          <a class="field-home__primary" :href="featuredNote.link">Read the featured note</a>
          <a class="field-home__secondary" href="#latest-notes">Browse latest notes</a>
        </div>
      </div>

      <article class="field-home__feature">
        <div class="field-home__feature-meta">
          <span>{{ featuredNote.issue }}</span>
          <span>{{ featuredNote.date }}</span>
        </div>
        <a :href="featuredNote.link">
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
        <a v-for="note in latestNotes.slice(0, 4)" :key="note.title" :href="note.link" class="field-home__rail-item">
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
        <a v-for="note in latestNotes" :key="note.title" :href="note.link" class="field-home__note-card">
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
          <a v-for="item in systemsIndex" :key="item.label" :href="item.link" class="field-home__index-card">
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
```

- [ ] **Step 4: Replace homepage scoped styles**

Use this style block in `docs/.vitepress/theme/components/FieldJournalHome.vue`:

```vue
<style scoped>
.field-home {
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
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.68));
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
  color: var(--vp-c-text-1);
  font-size: clamp(3rem, 8vw, 5.8rem);
  line-height: 0.92;
  letter-spacing: -0.075em;
}

.field-home__dek {
  max-width: 620px;
  color: var(--vp-c-text-2);
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
  color: var(--vp-c-text-1);
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
  color: var(--vp-c-text-3);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.field-home__feature h2 {
  margin: 18px 0 10px;
  color: var(--vp-c-text-1);
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
  color: var(--vp-c-text-2);
  line-height: 1.65;
}

.field-home__rail h2 {
  margin-bottom: 14px;
  color: var(--vp-c-text-1);
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
  color: var(--vp-c-text-3);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.field-home__rail-item strong {
  color: var(--vp-c-text-1);
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
  color: inherit;
  text-decoration: none;
}

.field-home__note-card h3,
.field-home__index-card h3 {
  color: var(--vp-c-text-1);
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
  color: inherit;
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
  color: var(--vp-c-text-2);
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
```

- [ ] **Step 5: Build-check homepage changes**

Run: `npm run docs:build`

Expected: PASS, or fail only with a new unrelated error that was not introduced by `FieldJournalHome.vue`.

- [ ] **Step 6: Commit homepage redesign**

Run:

```bash
git add docs/index.md docs/.vitepress/theme/index.ts docs/.vitepress/theme/components/FieldJournalHome.vue
git commit -m "Redesign homepage as editorial ledger"
```

Expected: Commit succeeds and contains the homepage component plus required wiring only.

## Task 3: Implement Editorial Topic Layout

**Files:**
- Modify: `docs/.vitepress/theme/components/TopicLayout.vue`

- [ ] **Step 1: Replace topic layout template**

Keep the existing `<script setup lang="ts">` prop definitions. Replace only the template with:

```vue
<template>
  <article class="topic-ledger">
    <header class="topic-ledger__header">
      <p v-if="category" class="topic-ledger__eyebrow">{{ category }}</p>
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="topic-ledger__subtitle">{{ subtitle }}</p>

      <div v-if="level || tags.length" class="topic-ledger__meta">
        <span v-if="level">{{ level }}</span>
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
    </header>

    <aside v-if="takeaway" class="topic-ledger__takeaway">
      <span>Sharp Takeaway</span>
      <p>{{ takeaway }}</p>
    </aside>

    <div class="topic-ledger__body">
      <slot />
    </div>

    <section v-if="$slots.interactive" class="topic-ledger__module">
      <p class="topic-ledger__module-label">Lab</p>
      <slot name="interactive" />
    </section>

    <section v-if="$slots.related" class="topic-ledger__module">
      <p class="topic-ledger__module-label">Related Topics</p>
      <slot name="related" />
    </section>
  </article>
</template>
```

- [ ] **Step 2: Replace topic layout scoped styles**

Use this style block in `docs/.vitepress/theme/components/TopicLayout.vue`:

```vue
<style scoped>
.topic-ledger {
  max-width: 840px;
  margin: 0 auto;
}

.topic-ledger__header {
  padding-bottom: 28px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.topic-ledger__eyebrow,
.topic-ledger__module-label,
.topic-ledger__takeaway span {
  display: block;
  margin: 0 0 14px;
  color: #7dd3fc;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.topic-ledger h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(2.9rem, 8vw, 5.2rem);
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.topic-ledger__subtitle {
  max-width: 720px;
  margin: 18px 0 0;
  color: var(--vp-c-text-2);
  font-size: 1.18rem;
  line-height: 1.7;
}

.topic-ledger__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 22px;
}

.topic-ledger__meta span {
  border: 1px solid rgba(125, 211, 252, 0.26);
  padding: 4px 9px;
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.topic-ledger__takeaway {
  margin: 28px 0;
  padding: 22px 24px;
  border: 1px solid rgba(125, 211, 252, 0.24);
  border-left: 4px solid #38bdf8;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(79, 70, 229, 0.08));
}

.topic-ledger__takeaway p {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 1.05rem;
  line-height: 1.7;
}

.topic-ledger__body {
  margin-top: 30px;
}

.topic-ledger__module {
  margin-top: 36px;
  padding: 22px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.56);
}

@media (max-width: 700px) {
  .topic-ledger {
    max-width: 100%;
  }

  .topic-ledger__takeaway,
  .topic-ledger__module {
    padding: 18px;
  }
}
</style>
```

- [ ] **Step 3: Build-check topic layout changes**

Run: `npm run docs:build`

Expected: PASS, or fail with a specific Vue/VitePress error that points to a syntax issue in `TopicLayout.vue`; if it fails, fix only that syntax issue and rerun.

- [ ] **Step 4: Commit topic layout redesign**

Run:

```bash
git add docs/.vitepress/theme/components/TopicLayout.vue
git commit -m "Restyle topic pages as editorial articles"
```

Expected: Commit succeeds and contains only the topic layout redesign.

## Task 4: Tune Global Editorial Reading Styles

**Files:**
- Modify: `docs/.vitepress/theme/style.css`

- [ ] **Step 1: Replace invalid global deep selectors**

In `docs/.vitepress/theme/style.css`, replace selectors using `.VPDoc :deep(...)` with valid global CSS selectors:

```css
.VPDoc h1 {
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--vp-c-text-1);
}

.VPDoc h2 {
  font-weight: 600;
  letter-spacing: -0.01em;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.35em;
  margin-top: 2.5em;
  color: var(--vp-c-text-1);
}

.VPDoc h3 {
  font-weight: 600;
  letter-spacing: -0.005em;
  margin-top: 2em;
  color: var(--vp-c-text-1);
}

.VPDoc p {
  line-height: 1.75;
  color: var(--vp-c-text-2);
}

.VPDoc a {
  color: var(--vp-c-brand-1);
  text-decoration-color: transparent;
}

.VPDoc a:hover {
  text-decoration-color: var(--vp-c-brand-1);
}
```

- [ ] **Step 2: Add Editorial Ledger prose refinements**

Append this section near the existing typography or doc content styles in `docs/.vitepress/theme/style.css`:

```css
/* ------------------------------------------------------------------ */
/*  Editorial Ledger prose                                            */
/* ------------------------------------------------------------------ */

.vp-doc {
  font-size: 1rem;
}

.vp-doc h2 {
  margin-top: 2.8em;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
  color: var(--vp-c-text-1);
  font-size: 1.55rem;
  letter-spacing: -0.035em;
}

.vp-doc h2::before {
  content: 'Field Note';
  display: block;
  margin-bottom: 0.45rem;
  color: #7dd3fc;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.vp-doc h3 {
  color: var(--vp-c-text-1);
}

.vp-doc p,
.vp-doc li {
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.vp-doc blockquote {
  border-left: 3px solid #38bdf8;
  background: rgba(14, 165, 233, 0.08);
  padding: 0.8rem 1.1rem;
}
```

- [ ] **Step 3: Build-check global CSS changes**

Run: `npm run docs:build`

Expected: PASS. CSS selector changes should not create build errors.

- [ ] **Step 4: Commit global reading styles**

Run:

```bash
git add docs/.vitepress/theme/style.css
git commit -m "Tune editorial reading styles"
```

Expected: Commit succeeds and contains only `style.css`.

## Task 5: Final Verification

**Files:**
- Verify: full repository working tree

- [ ] **Step 1: Run production build**

Run: `npm run docs:build`

Expected: PASS with VitePress build output generated under `docs/.vitepress/dist`.

- [ ] **Step 2: Inspect git status**

Run: `git status --short`

Expected: Only expected pre-existing unrelated changes remain. Do not revert unrelated user changes.

- [ ] **Step 3: Report verification evidence**

In the final response, include:

```md
Verified: `npm run docs:build` passed.
Changed: build-breaking CodeRunner expression, Editorial Ledger homepage, Editorial Ledger topic layout, global prose polish.
```

If the build fails, include the exact failing command and error summary instead of claiming completion.

## Self-Review

- Spec coverage: the plan covers the build fix, homepage redesign, topic page redesign, global style tuning, mobile layout behavior, and build verification.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: the plan preserves existing `TopicLayout` props (`title`, `subtitle`, `category`, `level`, `tags`, `takeaway`) and existing global component names (`FieldJournalHome`, `TopicLayout`, `CodeRunner`).
