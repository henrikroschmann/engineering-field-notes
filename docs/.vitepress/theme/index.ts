import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import VectorClockSimulator from './components/VectorClockSimulator.vue'
import CausalCompare from './components/CausalCompare.vue'
import MiniQuiz from './components/MiniQuiz.vue'
import CodeRunner from './components/CodeRunner.vue'
import MermaidDiagram from './components/MermaidDiagram.vue'
import FieldJournalHome from './components/FieldJournalHome.vue'
import HomeDashboard from './components/HomeDashboard.vue'
import TopicLayout from './components/TopicLayout.vue'
import TodayTopic from './components/TodayTopic.vue'
import LearningStreak from './components/LearningStreak.vue'
import TopTags from './components/TopTags.vue'
import RoadmapWidget from './components/RoadmapWidget.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('VectorClockSimulator', VectorClockSimulator)
    app.component('CausalCompare', CausalCompare)
    app.component('MiniQuiz', MiniQuiz)
    app.component('CodeRunner', CodeRunner)
    app.component('MermaidDiagram', MermaidDiagram)
    app.component('FieldJournalHome', FieldJournalHome)
    app.component('HomeDashboard', HomeDashboard)
    app.component('TopicLayout', TopicLayout)
    app.component('TodayTopic', TodayTopic)
    app.component('LearningStreak', LearningStreak)
    app.component('TopTags', TopTags)
    app.component('RoadmapWidget', RoadmapWidget)
  },
} satisfies Theme
