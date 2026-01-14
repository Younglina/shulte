import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import '@mdi/font/css/materialdesignicons.css'
import './styles/main.scss'
import './styles/animations.scss'

import TrainingPage from './pages/TrainingPage.vue'
import ResultPage from './pages/ResultPage.vue'
import HistoryPage from './pages/HistoryPage.vue'
import StatsPage from './pages/StatsPage.vue'

const routes = [
  { path: '/shulte', redirect: '/shulte/training' },
  { path: '/shulte/training', component: TrainingPage },
  { path: '/shulte/result', component: ResultPage },
  { path: '/shulte/history', component: HistoryPage },
  { path: '/shulte/stats', component: StatsPage },
]

const router = createRouter({
  base: '/shulte',
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
