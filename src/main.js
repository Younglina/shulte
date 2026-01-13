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
  { path: '/', redirect: '/training' },
  { path: '/training', component: TrainingPage },
  { path: '/result', component: ResultPage },
  { path: '/history', component: HistoryPage },
  { path: '/stats', component: StatsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
