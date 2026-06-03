<script setup lang="ts">
const items = [
  { label: 'CAP Theorem', done: false },
  { label: 'Raft Consensus', done: false },
  { label: 'LSM Trees vs B-Trees', done: false },
  { label: 'Consistent Hashing', done: false },
  { label: 'Circuit Breaker Pattern', done: false },
  { label: 'OpenTelemetry Fundamentals', done: false },
]
</script>

<template>
  <div class="efn-widget">
    <div class="efn-widget-title">Roadmap</div>
    <ul style="list-style:none;margin:0;padding:0;">
      <li
        v-for="(item, i) in items"
        :key="i"
        style="display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0;font-size:0.82rem;color:var(--vp-c-text-2);"
      >
        <span style="color:var(--vp-c-text-3);font-size:0.75rem;">{{ item.done ? '&#10004;' : '&loz;' }}</span>
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
