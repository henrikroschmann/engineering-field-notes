<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = withDefaults(defineProps<{
  initialA?: number[]
  initialB?: number[]
}>(), {
  initialA: () => [1, 2, 0],
  initialB: () => [0, 0, 2],
})

const inputA = ref(props.initialA.join(', '))
const inputB = ref(props.initialB.join(', '))

function parseInput(raw: string): number[] | null {
  const parts = raw.split(',').map(s => s.trim())
  const nums = parts.map(Number)
  if (nums.some(n => isNaN(n))) return null
  return nums
}

const relation = computed(() => {
  const a = parseInput(inputA.value)
  const b = parseInput(inputB.value)
  if (!a || !b) return { label: 'Invalid input', detail: 'Enter comma-separated integers for both clocks.', color: '#ef4444' }
  if (a.length !== b.length) return { label: 'Length mismatch', detail: 'Both clocks must have the same number of components.', color: '#ef4444' }

  const allEqual = a.every((v, i) => v === b[i])
  if (allEqual) return { label: 'Equal', detail: 'All components are identical. The two events represent the same logical state.', color: '#22c55e' }

  const aBeforeB = a.every((v, i) => v <= b[i]) && a.some((v, i) => v < b[i])
  if (aBeforeB) return { label: 'A happened before B', detail: 'Every component of A is ≤ the corresponding component of B, with at least one strictly less. This means A causally precedes B.', color: '#6366f1' }

  const bBeforeA = b.every((v, i) => v <= a[i]) && b.some((v, i) => v < a[i])
  if (bBeforeA) return { label: 'B happened before A', detail: 'Every component of B is ≤ the corresponding component of A, with at least one strictly less. This means B causally precedes A.', color: '#6366f1' }

  return { label: 'Concurrent', detail: 'Neither clock dominates the other. Some components of A are greater while others are smaller. These events are causally unrelated — they happened in parallel.', color: '#f59e0b' }
})
</script>

<template>
  <div class="causal-compare">
    <h3>Causal Order Comparator</h3>

    <div class="cc-inputs">
      <div class="cc-field">
        <label for="clock-a">Clock A</label>
        <input id="clock-a" v-model="inputA" type="text" placeholder="e.g. 1, 2, 0" />
      </div>
      <div class="cc-field">
        <label for="clock-b">Clock B</label>
        <input id="clock-b" v-model="inputB" type="text" placeholder="e.g. 0, 0, 2" />
      </div>
    </div>

    <div class="cc-result" :style="{ borderColor: relation.color }">
      <div class="cc-label" :style="{ color: relation.color }">{{ relation.label }}</div>
      <p class="cc-detail">{{ relation.detail }}</p>
    </div>
  </div>
</template>

<style scoped>
.causal-compare {
  border: 1px solid var(--vp-c-border, #334155);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft, #111827);
  margin: 1.5em 0;
}

.causal-compare h3 {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: var(--vp-c-text-1, #e2e8f0);
}

.cc-inputs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cc-field {
  flex: 1;
}

.cc-field label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2, #94a3b8);
  margin-bottom: 0.35rem;
}

.cc-field input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border, #334155);
  border-radius: 6px;
  background: var(--vp-c-bg, #0b0f1a);
  color: var(--vp-c-text-1, #e2e8f0);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.9rem;
  box-sizing: border-box;
}

.cc-field input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1, #6366f1);
}

.cc-result {
  border-left: 4px solid var(--vp-c-brand-1, #6366f1);
  padding: 1rem;
  background: var(--vp-c-bg, #0b0f1a);
  border-radius: 0 8px 8px 0;
}

.cc-label {
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 0.35rem;
}

.cc-detail {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2, #94a3b8);
  line-height: 1.5;
}
</style>
