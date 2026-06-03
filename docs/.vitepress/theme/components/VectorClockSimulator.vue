<script setup lang="ts">
import { reactive, computed } from 'vue'

interface NodeState {
  name: string
  clock: number[]
}

interface LogEntry {
  action: string
  result: string
}

const numNodes = 3

const nodes = reactive<NodeState[]>([
  { name: 'A', clock: [0, 0, 0] },
  { name: 'B', clock: [0, 0, 0] },
  { name: 'C', clock: [0, 0, 0] },
])

const log = reactive<LogEntry[]>([])

function localEvent(nodeIdx: number) {
  const node = nodes[nodeIdx]
  node.clock[nodeIdx]++
  log.push({
    action: `Local event at ${node.name}`,
    result: `${node.name}: [${node.clock.join(', ')}]`,
  })
}

function sendMsg(fromIdx: number, toIdx: number) {
  const sender = nodes[fromIdx]
  sender.clock[fromIdx]++
  const msgClock = [...sender.clock]
  const receiver = nodes[toIdx]
  for (let i = 0; i < numNodes; i++) {
    receiver.clock[i] = Math.max(receiver.clock[i], msgClock[i])
  }
  receiver.clock[toIdx]++
  log.push({
    action: `Send ${sender.name} → ${receiver.name}`,
    result: `${receiver.name}: [${receiver.clock.join(', ')}]`,
  })
}

function reset() {
  for (const node of nodes) {
    node.clock = [0, 0, 0]
  }
  log.length = 0
}

const nodeColors = ['#6366f1', '#22c55e', '#f59e0b']
</script>

<template>
  <div class="vector-clock-simulator">
    <div class="vc-header">
      <h3>Vector Clock Simulator</h3>
      <p class="vc-subtitle">Three nodes A, B, C — simulate events and messages</p>
    </div>

    <div class="vc-nodes">
      <div
        v-for="(node, idx) in nodes"
        :key="node.name"
        class="vc-node-card"
        :style="{ borderColor: nodeColors[idx] }"
      >
        <div class="vc-node-name" :style="{ color: nodeColors[idx] }">
          Node {{ node.name }}
        </div>
        <div class="vc-clock">
          <span v-for="(val, i) in node.clock" :key="i" class="vc-val">
            <span class="vc-label">V[{{ ['A', 'B', 'C'][i] }}]</span>
            <span class="vc-num">{{ val }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="vc-actions">
      <div class="vc-action-group">
        <h4>Local Events</h4>
        <button @click="localEvent(0)">Event at A</button>
        <button @click="localEvent(1)">Event at B</button>
        <button @click="localEvent(2)">Event at C</button>
      </div>

      <div class="vc-action-group">
        <h4>Messages</h4>
        <button @click="sendMsg(0, 1)">Send A → B</button>
        <button @click="sendMsg(1, 2)">Send B → C</button>
        <button @click="sendMsg(2, 0)">Send C → A</button>
      </div>

      <div class="vc-action-group">
        <h4>Control</h4>
        <button class="vc-reset" @click="reset">Reset</button>
      </div>
    </div>

    <div v-if="log.length > 0" class="vc-log">
      <h4>Event Log</h4>
      <ul>
        <li v-for="(entry, i) in log" :key="i" class="vc-log-entry">
          <span class="vc-log-action">{{ entry.action }}</span>
          <span class="vc-log-result">{{ entry.result }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.vector-clock-simulator {
  border: 1px solid var(--vp-c-border, #334155);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft, #111827);
  margin: 1.5em 0;
}

.vc-header h3 {
  margin: 0 0 0.25rem;
  font-size: 1.2rem;
  color: var(--vp-c-text-1, #e2e8f0);
}

.vc-subtitle {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2, #94a3b8);
}

.vc-nodes {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.vc-node-card {
  flex: 1;
  min-width: 140px;
  border: 2px solid var(--vp-c-border, #334155);
  border-radius: 8px;
  padding: 1rem;
  background: var(--vp-c-bg, #0b0f1a);
}

.vc-node-name {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.vc-clock {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.vc-val {
  display: flex;
  justify-content: space-between;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.85rem;
}

.vc-label {
  color: var(--vp-c-text-2, #94a3b8);
}

.vc-num {
  font-weight: 700;
  color: var(--vp-c-text-1, #e2e8f0);
}

.vc-actions {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.vc-action-group {
  flex: 1;
  min-width: 160px;
}

.vc-action-group h4 {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2, #94a3b8);
}

.vc-actions button {
  display: block;
  width: 100%;
  margin-bottom: 0.35rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--vp-c-border, #334155);
  border-radius: 6px;
  background: var(--vp-c-bg-elv, #1e293b);
  color: var(--vp-c-text-1, #e2e8f0);
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.vc-actions button:hover {
  background: var(--vp-c-bg-elv-up, #334155);
  border-color: var(--vp-c-brand-1, #6366f1);
}

.vc-reset {
  color: var(--vp-c-danger-1, #ef4444) !important;
}

.vc-log {
  border-top: 1px solid var(--vp-c-border, #334155);
  padding-top: 1rem;
}

.vc-log h4 {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2, #94a3b8);
}

.vc-log ul {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.vc-log-entry {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0.5rem;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.78rem;
  border-bottom: 1px solid var(--vp-c-divider, #1e293b);
}

.vc-log-action {
  color: var(--vp-c-text-2, #94a3b8);
}

.vc-log-result {
  color: var(--vp-c-brand-1, #818cf8);
  font-weight: 600;
}
</style>
