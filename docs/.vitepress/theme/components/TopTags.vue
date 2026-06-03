<script setup lang="ts">
const tags = [
  { label: 'distributed-systems', count: 12 },
  { label: 'causality', count: 8 },
  { label: 'databases', count: 7 },
  { label: 'consistency', count: 6 },
  { label: 'networking', count: 5 },
  { label: 'concurrency', count: 4 },
]
</script>

<template>
  <div class="efn-widget">
    <div class="efn-widget-title">Top Tags</div>
    <div style="display:flex;flex-wrap:wrap;gap:0.35rem;">
      <span
        v-for="(tag, i) in tags"
        :key="tag.label"
        class="efn-badge"
        :class="{ 'efn-badge--green': i === 0, 'efn-badge--cyan': i === 2 }"
        style="cursor:pointer;"
      >
        #{{ tag.label }} <span style="opacity:0.6;margin-left:0.2em;">{{ tag.count }}</span>
      </span>
    </div>
  </div>
</template>
