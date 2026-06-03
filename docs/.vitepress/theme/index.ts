import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import VectorClockSimulator from './components/VectorClockSimulator.vue'
import CausalCompare from './components/CausalCompare.vue'
import MiniQuiz from './components/MiniQuiz.vue'
import CodeRunner from './components/CodeRunner.vue'
import MermaidDiagram from './components/MermaidDiagram.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('VectorClockSimulator', VectorClockSimulator)
    app.component('CausalCompare', CausalCompare)
    app.component('MiniQuiz', MiniQuiz)
    app.component('CodeRunner', CodeRunner)
    app.component('MermaidDiagram', MermaidDiagram)
  },
} satisfies Theme
