<script setup lang="ts">
import { computed } from 'vue'

const today = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
})
</script>

<template>
  <div class="efn-widget">
    <div class="efn-widget-title">Today's Topic</div>
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">
      <span style="font-size:1.25rem;">⏱️</span>
      <a href="/topics/distributed-systems/vector-clocks" style="font-weight:600;font-size:0.88rem;color:var(--vp-c-brand-1);text-decoration:none;">Vector Clocks</a>
    </div>
    <p style="font-size:0.78rem;color:var(--vp-c-text-2);margin:0 0 0.5rem;line-height:1.5;">How distributed systems track causality without a global clock.</p>
    <span class="efn-badge">Distributed Systems</span>
    <span class="efn-badge efn-badge--yellow" style="margin-left:0.35rem;">Intermediate</span>
    <div style="margin-top:0.65rem;font-size:0.72rem;color:var(--vp-c-text-3);">{{ today }}</div>
  </div>
</template>
