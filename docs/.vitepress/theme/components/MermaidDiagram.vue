<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

const props = defineProps<{
  code: string
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const rendered = ref(false)
const renderError = ref<string | null>(null)
type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void
  render: (id: string, code: string) => Promise<{ svg: string }>
}

let mermaidApi: MermaidApi | null = null

async function ensureMermaid(): Promise<MermaidApi | null> {
  if (mermaidApi) return mermaidApi
  if (typeof window === 'undefined') {
    renderError.value = 'Mermaid requires a browser environment.'
    return null
  }

  const mod = await import('mermaid/dist/mermaid.js')
  mermaidApi = (mod.default || mod) as MermaidApi
  mermaidApi.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
  })
  return mermaidApi
}

async function render() {
  if (!containerRef.value) return
  renderError.value = null
  rendered.value = false

  try {
    const m = await ensureMermaid()
    if (!m) {
      renderError.value = 'Mermaid library could not be loaded.'
      return
    }

    const id = 'mmd-' + Math.random().toString(36).slice(2, 9)
    const { svg } = await m.render(id, props.code)
    if (containerRef.value) containerRef.value.innerHTML = svg
    rendered.value = true
  } catch (e: unknown) {
    renderError.value = e instanceof Error ? e.message : String(e)
  }
}

onMounted(render)
watch(() => props.code, () => nextTick(render))
</script>

<template>
  <div class="mermaid-diagram">
    <div ref="containerRef"></div>
    <div v-if="renderError" class="mmd-error">
      <strong>Render error:</strong> {{ renderError }}
    </div>
    <div v-if="!rendered && !renderError" class="mmd-loading">Rendering diagram...</div>
  </div>
</template>

<style scoped>
.mermaid-diagram {
  border: 1px solid var(--vp-c-border, #334155);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft, #111827);
  margin: 1.5em 0;
  text-align: center;
  overflow-x: auto;
}

.mermaid-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}

.mmd-error {
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
  font-size: 0.85rem;
  text-align: left;
}

.mmd-loading {
  color: var(--vp-c-text-3, #64748b);
  font-size: 0.85rem;
  padding: 2rem;
}
</style>
