<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  question: string
  options: string[]
  answer: number
  explanation?: string
}>(), {
  explanation: '',
})

const selected = ref<number | null>(null)
const checked = ref(false)

const isCorrect = ref(false)

function check() {
  if (selected.value === null) return
  checked.value = true
  isCorrect.value = selected.value === props.answer
}
</script>

<template>
  <div class="mini-quiz">
    <h4>{{ question }}</h4>

    <div class="mq-options">
      <label
        v-for="(opt, idx) in options"
        :key="idx"
        class="mq-option"
        :class="{
          'mq-selected': selected === idx,
          'mq-correct': checked && idx === answer,
          'mq-wrong': checked && selected === idx && idx !== answer,
        }"
      >
        <input
          type="radio"
          :name="'quiz-' + question.slice(0, 8)"
          :value="idx"
          v-model="selected"
          :disabled="checked"
        />
        <span class="mq-radio"></span>
        <span class="mq-text">{{ opt }}</span>
      </label>
    </div>

    <button v-if="!checked" class="mq-check" @click="check" :disabled="selected === null">
      Check Answer
    </button>

    <div v-if="checked" class="mq-feedback" :class="isCorrect ? 'mq-correct' : 'mq-wrong'">
      <strong>{{ isCorrect ? 'Correct!' : 'Incorrect.' }}</strong>
      <p v-if="explanation">{{ explanation }}</p>
    </div>
  </div>
</template>

<style scoped>
.mini-quiz {
  border: 1px solid var(--vp-c-border, #334155);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft, #111827);
  margin: 1.5em 0;
}

.mini-quiz h4 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: var(--vp-c-text-1, #e2e8f0);
}

.mq-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mq-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--vp-c-border, #334155);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  font-size: 0.9rem;
  color: var(--vp-c-text-1, #e2e8f0);
}

.mq-option:hover {
  background: var(--vp-c-bg-elv, #1e293b);
}

.mq-selected {
  border-color: var(--vp-c-brand-1, #6366f1);
  background: var(--vp-c-brand-soft, rgba(99, 102, 241, 0.1));
}

.mq-correct {
  border-color: #22c55e !important;
  background: rgba(34, 197, 94, 0.1) !important;
}

.mq-wrong {
  border-color: #ef4444 !important;
  background: rgba(239, 68, 68, 0.1) !important;
}

.mq-option input {
  display: none;
}

.mq-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-text-3, #64748b);
  flex-shrink: 0;
  transition: border-color 0.15s;
}

.mq-selected .mq-radio {
  border-color: var(--vp-c-brand-1, #6366f1);
  background: var(--vp-c-brand-1, #6366f1);
  box-shadow: inset 0 0 0 2px var(--vp-c-bg-soft, #111827);
}

.mq-text {
  flex: 1;
}

.mq-check {
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  background: var(--vp-c-brand-3, #4f46e5);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}

.mq-check:hover:not(:disabled) {
  opacity: 0.9;
}

.mq-check:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.mq-feedback {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
}

.mq-feedback strong {
  display: block;
  margin-bottom: 0.25rem;
}

.mq-feedback p {
  margin: 0;
  color: var(--vp-c-text-2, #94a3b8);
}

.mq-feedback.mq-correct {
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.mq-feedback.mq-wrong {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
}
</style>
