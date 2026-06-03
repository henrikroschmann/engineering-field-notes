<script setup lang="ts">
const categories = [
  { icon: '🌐', title: 'Distributed Systems', desc: 'Consensus, replication, vector clocks', count: 2 },
  { icon: '🗄️', title: 'Databases', desc: 'Storage engines, transactions, indexing', count: 0 },
  { icon: '🔌', title: 'Networking', desc: 'TCP, HTTP, DNS, load balancing', count: 0 },
  { icon: '🏗️', title: 'System Design', desc: 'Architecture patterns, scalability', count: 0 },
  { icon: '⚡', title: 'Concurrency', desc: 'Threads, locks, async I/O', count: 0 },
  { icon: '🔍', title: 'Observability', desc: 'Logging, metrics, tracing', count: 0 },
  { icon: '🔒', title: 'Security', desc: 'AuthN/AuthZ, encryption, threats', count: 0 },
  { icon: '🛠️', title: 'Software Engineering', desc: 'Testing, CI/CD, code review', count: 0 },
]

const recent = [
  { title: 'Vector Clocks', category: 'Distributed Systems', level: 'Intermediate', time: '8 min', link: '/topics/distributed-systems/vector-clocks' },
  { title: 'Lamport Clocks', category: 'Distributed Systems', level: 'Beginner', time: '5 min', link: '/topics/distributed-systems/lamport-clocks' },
  { title: 'MVCC in Databases', category: 'Databases', level: 'Intermediate', time: '10 min', link: '#' },
  { title: 'Bloom Filters', category: 'Databases', level: 'Intermediate', time: '7 min', link: '#' },
  { title: 'Circuit Breakers', category: 'System Design', level: 'Beginner', time: '6 min', link: '#' },
  { title: 'Consistent Hashing', category: 'Distributed Systems', level: 'Intermediate', time: '9 min', link: '#' },
]

const progress = [
  { title: 'Vector Clocks', pct: 65 },
  { title: 'CAP Theorem', pct: 40 },
  { title: 'CRDTs', pct: 20 },
  { title: 'Linearizability', pct: 10 },
]

const popular = [
  { title: 'CAP Theorem', category: 'Distributed Systems', time: '12 min' },
  { title: 'Eventual Consistency', category: 'Distributed Systems', time: '8 min' },
  { title: 'CRDTs', category: 'Distributed Systems', time: '15 min' },
  { title: 'Idempotency', category: 'System Design', time: '6 min' },
  { title: 'Database Indexes', category: 'Databases', time: '10 min' },
  { title: 'TLS Handshake', category: 'Networking', time: '9 min' },
  { title: 'NAT & Port Forwarding', category: 'Networking', time: '7 min' },
  { title: 'Write-Ahead Logging', category: 'Databases', time: '11 min' },
]
</script>

<template>
  <div class="efn-dashboard-page">
    <div class="efn-dashboard-shell">
      <!-- Hero -->
      <div class="efn-hero">
        <h1 style="margin:0 0 0.25rem;font-size:1.75rem;font-weight:700;letter-spacing:-0.02em;color:var(--vp-c-text-1);">Engineering Field Notes</h1>
        <p style="margin:0 0 0.5rem;font-size:1rem;color:var(--vp-c-brand-2);font-weight:500;">Deep dives into systems internals</p>
        <p style="margin:0 0 1.25rem;font-size:0.88rem;color:var(--vp-c-text-2);line-height:1.6;max-width:600px;">Daily engineering topics explained from first principles — distributed systems, databases, networking, concurrency, and more.</p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          <a href="/topics/distributed-systems/vector-clocks" class="efn-btn-primary">Browse Topics</a>
          <a href="#today" class="efn-btn-secondary">Today's Topic</a>
        </div>
      </div>

      <!-- Dashboard grid: main + right rail -->
      <div class="efn-dashboard-grid">
        <div class="efn-dashboard-main">
          <!-- Categories -->
          <div class="efn-section">
            <div class="efn-section-title">Categories</div>
            <div class="efn-grid efn-grid--3col">
              <div
                v-for="cat in categories"
                :key="cat.title"
                class="efn-card"
              >
                <div style="font-size:1.25rem;margin-bottom:0.35rem;">{{ cat.icon }}</div>
                <div class="efn-card-title">{{ cat.title }}</div>
                <div class="efn-card-description">{{ cat.desc }}</div>
                <div style="margin-top:0.5rem;">
                  <span v-if="cat.count > 0" class="efn-badge">{{ cat.count }} topics</span>
                  <span v-else style="font-size:0.7rem;color:var(--vp-c-text-3);">Coming soon</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recently Added -->
          <div class="efn-section">
            <div class="efn-section-title">Recently Added</div>
            <div class="efn-grid efn-grid--2col">
              <a
                v-for="topic in recent"
                :key="topic.title"
                :href="topic.link"
                class="efn-topic-card"
              >
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
                  <span class="efn-card-title" style="margin:0;">{{ topic.title }}</span>
                  <span class="efn-badge" style="font-size:0.65rem;padding:0.1em 0.4em;">{{ topic.category }}</span>
                </div>
                <div style="display:flex;gap:0.5rem;font-size:0.72rem;color:var(--vp-c-text-3);">
                  <span class="efn-badge efn-badge--yellow" style="font-size:0.65rem;padding:0.1em 0.4em;">{{ topic.level }}</span>
                  <span>{{ topic.time }}</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Continue Learning -->
          <div class="efn-section">
            <div class="efn-section-title">Continue Learning</div>
            <div class="efn-card">
              <div
                v-for="item in progress"
                :key="item.title"
                class="efn-progress-row"
              >
                <span style="font-size:0.82rem;font-weight:500;color:var(--vp-c-text-1);min-width:120px;">{{ item.title }}</span>
                <div class="efn-progress-bar">
                  <div class="efn-progress-fill" :style="{ width: item.pct + '%' }"></div>
                </div>
                <span style="font-size:0.75rem;color:var(--vp-c-text-3);min-width:2.5em;text-align:right;">{{ item.pct }}%</span>
              </div>
            </div>
          </div>

          <!-- Popular Topics -->
          <div class="efn-section">
            <div class="efn-section-title">Popular Topics</div>
            <div class="efn-grid efn-grid--2col">
              <div
                v-for="topic in popular"
                :key="topic.title"
                class="efn-card"
                style="cursor:pointer;"
              >
                <div class="efn-card-title">{{ topic.title }}</div>
                <div style="display:flex;gap:0.35rem;margin-top:0.35rem;">
                  <span class="efn-badge" style="font-size:0.65rem;padding:0.1em 0.4em;">{{ topic.category }}</span>
                  <span style="font-size:0.72rem;color:var(--vp-c-text-3);align-self:center;">{{ topic.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Rail -->
        <div class="efn-dashboard-rail">
          <TodayTopic id="today" />
          <LearningStreak />
          <TopTags />
          <RoadmapWidget />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.efn-dashboard-page {
  width: 100%;
}

.efn-dashboard-shell {
  max-width: 1440px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

@media (max-width: 1100px) {
  .efn-dashboard-shell {
    padding: 1rem 1rem;
  }
}

.efn-dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.25rem;
  align-items: start;
}

@media (max-width: 1100px) {
  .efn-dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.efn-dashboard-main {
  min-width: 0;
}

.efn-dashboard-rail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.efn-btn-primary {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  background: var(--vp-c-brand-3);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s;
}

.efn-btn-primary:hover {
  opacity: 0.85;
}

.efn-btn-secondary {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  background: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid var(--vp-c-border);
  transition: border-color 0.15s;
}

.efn-btn-secondary:hover {
  border-color: var(--vp-c-brand-1);
}
</style>
