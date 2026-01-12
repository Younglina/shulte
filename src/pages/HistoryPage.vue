<template>
  <div class="history-page">
    <div class="page-header">
      <h1 class="page-title">历史记录</h1>
      <p class="page-subtitle">查看训练进度</p>
    </div>

    <div class="history-content">
      <Tabs v-model="activeTab" :tabs="tabs" />
      
      <HistoryList v-if="activeTab === 'records'" :records="historyList" @clear="clearHistory" />
      <StatsView v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage'
import Tabs from '../components/Tabs.vue'
import HistoryList from '../components/HistoryList.vue'
import StatsView from './StatsView.vue'

const { history, clearHistory, getHistory } = useLocalStorage()

const historyList = computed(() => getHistory())

const activeTab = ref('records')

const tabs = [
  { id: 'records', label: '记录', icon: '📊' },
  { id: 'stats', label: '统计', icon: '📈' },
]
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  padding: 24px 20px;
  padding-bottom: 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  animation: slideUp 0.5s ease-out;
}

.page-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 8px;
}

.page-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.6);
  letter-spacing: 0.05em;
}

.history-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
