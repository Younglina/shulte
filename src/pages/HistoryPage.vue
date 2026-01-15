<template>
  <div class="history-page">
    <div class="page-header">
      <h1 class="page-title">历史记录</h1>
      <p class="page-subtitle">查看训练进度</p>
    </div>

    <div class="history-content">
      <HistoryList
        :records="historyList"
        @clear="clearHistory"
        @replay="handleReplay"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLocalStorage } from '../composables/useLocalStorage'
import HistoryList from '../components/HistoryList.vue'

const router = useRouter()
const { clearHistory, getHistory } = useLocalStorage()

const historyList = computed(() => getHistory())

const handleReplay = (record) => {
  // 保存 replay 信息到 sessionStorage
  const replayData = {
    gridNumbers: record.gridNumbers,
    mode: record.mode,
    modeDisplay: record.modeDisplay,
    isTimed: record.isTimed,
    isUnlimited: record.isUnlimited,
    replayOf: record.id,
  }
  sessionStorage.setItem('replayRecord', JSON.stringify(replayData))

  // 跳转到训练页面
  router.push('/shulte?replay=true')
}
</script>

<style scoped lang="scss">
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
