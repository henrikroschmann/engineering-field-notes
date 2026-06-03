<script setup lang="ts">
import { ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{
  initialCode?: string
}>(), {
  initialCode: () => `// Tiny trusted demo — run in browser only\nconsole.log("Hello from CodeRunner!")\nconst fib = (n) => n <= 1 ? n : fib(n - 1) + fib(n - 2)\nconsole.log("fib(10) =", fib(10))`,
})

const code = ref(props.initialCode)
const output = shallowRef<string[]>([])
const error = shallowRef<string | null>(null)

function run() {
  output.value = []
  error.value = null

  const logs: string[] = []
  const safeConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '))
    },
    warn: (...args: unknown[]) => {
      logs.push('[WARN] ' + args.join(' '))
    },
    error: (...args: unknown[]) => {
      logs.push('[ERROR] ' + args.join(' '))
    },
  }

  try {
    const fn = new Function('console', code.value)
    fn(safeConsole)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e)
  }

  output.value = logs
}
</script>

<template>
  <div class="code-runner">
    <div class="cr-header">
      <h3>Code Runner</h3>
      <span class="cr-badge">Browser-only · Trusted demos only</span>
    </div>

    <textarea
      v-model="code"
      class="cr-editor"
      spellcheck="false"
    ></textarea>

    <button class="cr-run" @click="run">▶ Run</button>

    <div class="cr-output">
      <div class="cr-output-label">Output</div>
      <pre v-if="error" class="cr-error">{{ error }}</pre>
      <pre v-else-if="output.length === 0 && !error" class="cr-empty">Click "Run" to execute...</pre>
      <pre v-else class="cr-result">{{ output.join('\n') }}</pre>
    </div>
  </div>
</template>

<style scoped>
.code-runner {
  border: 1px solid var(--vp-c-border, #334155);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft, #111827);
  margin: 1.5em 0;
}

.cr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: var(--vp-c-bg-elv, #1e293b);
  border-bottom: 1px solid var(--vp-c-border, #334155);
}

.cr-header h3 {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-1, #e2e8f0);
}

.cr-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: var(--vp-c-warning-soft, rgba(234, 179, 8, 0.15));
  color: var(--vp-c-warning-1, #eab308);
  font-weight: 600;
}

.cr-editor {
  width: 100%;
  min-height: 140px;
  padding: 1rem;
  border: none;
  background: var(--vp-code-block-bg, #0f172a);
  color: var(--vp-c-text-1, #e2e8f0);
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.85rem;
  line-height: 1.6;
  resize: vertical;
  box-sizing: border-box;
}

.cr-editor:focus {
  outline: none;
}

.cr-run {
  display: block;
  margin: 0;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0;
  background: var(--vp-c-brand-3, #4f46e5);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
}

.cr-run:hover {
  background: var(--vp-c-brand-2, #6366f1);
}

.cr-output {
  border-top: 1px solid var(--vp-c-border, #334155);
}

.cr-output-label {
  padding: 0.4rem 1rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3, #64748b);
  background: var(--vp-c-bg-elv, #1e293b);
}

.cr-output pre {
  margin: 0;
  padding: 1rem;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.82rem;
  line-height: 1.5;
  background: var(--vp-code-block-bg, #0f172a);
  color: var(--vp-c-text-1, #e2e8f0);
  min-height: 60px;
  white-space: pre-wrap;
  word-break: break-word;
}

.cr-error {
  color: #ef4444 !important;
}

.cr-empty {
  color: var(--vp-c-text-3, #64748b) !important;
}
</style>
