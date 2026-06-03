<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle?: string
  category?: string
  level?: string
  tags?: string[]
  takeaway?: string
}>(), {
  subtitle: '',
  category: '',
  level: '',
  tags: () => [],
  takeaway: '',
})
</script>

<template>
  <div class="topic-layout">
    <!-- Breadcrumb -->
    <div v-if="category" class="tl-breadcrumb">
      <span style="color:var(--vp-c-text-3);font-size:0.82rem;">{{ category }}</span>
    </div>

    <!-- Title area -->
    <h1 style="margin:0.25rem 0 0.5rem;font-size:2rem;font-weight:700;letter-spacing:-0.02em;color:var(--vp-c-text-1);">{{ title }}</h1>
    <p v-if="subtitle" style="margin:0 0 1rem;font-size:1.05rem;color:var(--vp-c-text-2);line-height:1.6;">{{ subtitle }}</p>

    <!-- Badges -->
    <div v-if="(level || tags?.length)" style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:1.25rem;">
      <span v-if="level" class="efn-badge efn-badge--yellow">{{ level }}</span>
      <span v-for="tag in tags" :key="tag" class="efn-badge">{{ tag }}</span>
    </div>

    <!-- Takeaway callout -->
    <div v-if="takeaway" style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.25);border-left:3px solid var(--efn-accent-blue);border-radius:8px;padding:1rem 1.25rem;margin-bottom:1.5rem;">
      <div style="font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--efn-accent-blue);margin-bottom:0.35rem;">Sharp Takeaway</div>
      <p style="margin:0;font-size:0.92rem;color:var(--vp-c-text-1);line-height:1.6;font-style:italic;">{{ takeaway }}</p>
    </div>

    <!-- Default content slot -->
    <slot />

    <!-- Interactive section -->
    <template v-if="$slots.interactive">
      <div class="efn-section" style="margin-top:2rem;">
        <div class="efn-section-title">Interactive</div>
        <slot name="interactive" />
      </div>
    </template>

    <!-- Related section -->
    <template v-if="$slots.related">
      <div class="efn-section" style="margin-top:2rem;">
        <div class="efn-section-title">Related Topics</div>
        <slot name="related" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.topic-layout {
  max-width: 100%;
}

.tl-breadcrumb {
  font-size: 0.82rem;
  text-transform: capitalize;
}
</style>
