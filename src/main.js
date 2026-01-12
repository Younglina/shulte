import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/main.css'
import './styles/animations.css'

import TrainingPage from './pages/TrainingPage.vue'
import ResultPage from './pages/ResultPage.vue'
import HistoryPage from './pages/HistoryPage.vue'

const routes = [
  { path: '/', redirect: '/training' },
  { path: '/training', component: TrainingPage },
  { path: '/result', component: ResultPage },
  { path: '/history', component: HistoryPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
