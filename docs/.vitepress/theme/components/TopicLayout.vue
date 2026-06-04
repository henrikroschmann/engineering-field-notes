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
