<script setup lang="ts">
const streak = 7
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>

<template>
  <div class="efn-widget">
    <div class="efn-widget-title">Learning Streak</div>
    <div style="display:flex;align-items:baseline;gap:0.5rem;margin-bottom:0.75rem;">
      <span style="font-size:1.5rem;font-weight:700;color:var(--efn-accent-yellow);">{{ streak }}</span>
      <span style="font-size:0.82rem;color:var(--vp-c-text-2);">day streak</span>
    </div>
    <div style="display:flex;gap:0.35rem;">
      <div
        v-for="(day, i) in days"
        :key="day"
        style="flex:1;text-align:center;padding:0.3rem 0;border-radius:4px;font-size:0.65rem;font-weight:600;"
        :style="{
          background: i < streak ? 'rgba(234,179,8,0.15)' : 'var(--vp-c-bg-elv)',
          color: i < streak ? 'var(--efn-accent-yellow)' : 'var(--vp-c-text-3)',
        }"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>
