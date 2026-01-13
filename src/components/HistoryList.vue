<template>
  <div class="history-list">
    <div class="history-header">
      <div class="history-title">历史记录</div>
      <div class="history-count">{{ records.length }} 条记录</div>
    </div>

    <div v-if="records.length === 0" class="history-empty">
      <div class="empty-icon">
        <i class="mdi mdi-chart-bar"></i>
      </div>
      <div class="empty-text">暂无训练记录</div>
      <div class="empty-hint">开始第一次训练吧！</div>
    </div>

    <div v-else class="history-items">
      <div
        v-for="record in records"
        :key="record.id"
        class="history-item"
        :class="`result-${record.result}`"
      >
          <div class="history-item-left">
            <div class="history-icon">
              <i :class="`mdi ${getResultIcon(record.result)}`"></i>
            </div>
            <div class="history-info">
            <div class="history-date">{{ formatDate(record.timestamp) }}</div>
            <div class="history-mode">{{ record.mode }} 模式</div>
          </div>
        </div>
        <div class="history-item-right">
          <div class="history-time">{{ record.timeUsed.toFixed(2) }}s</div>
          <div v-if="record.result === 'success'" class="history-rating">
            {{ getRating(record.timeUsed) }}
          </div>
        </div>
      </div>
    </div>

    <button 
      v-if="records.length > 0"
      class="clear-button"
      @click="handleClear"
    >
      清空记录
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  records: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['clear'])

const getResultIcon = (result) => {
  switch (result) {
    case 'success':
      return 'mdi-check-circle'
    case 'fail':
      return 'mdi-close-circle'
    case 'timeout':
      return 'mdi-clock-alert'
    default:
      return 'mdi-chart-bar'
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) {
    return '刚刚'
  }
  
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`
  }
  
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`
  }
  
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getRating = (time) => {
  if (time <= 8) return 'S'
  if (time <= 15) return 'A'
  if (time <= 20) return 'B'
  if (time <= 25) return 'C'
  return 'D'
}

const handleClear = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    emit('clear')
  }
}
</script>

<style scoped lang="scss">
.history-list {
  padding: 16px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.history-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
}

.history-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.6);
  background: rgba(26, 35, 50, 0.6);
  padding: 4px 12px;
  border-radius: 12px;
}

.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: rgba(15, 21, 32, 0.6);
  border: 1px dashed rgba(0, 217, 255, 0.2);
  border-radius: 16px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  color: #f1f5f9;
  margin-bottom: 8px;
}

.empty-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.6);
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(15, 21, 32, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    border-color: rgba(0, 217, 255, 0.3);
  }

  &.result-success {
    border-left: 4px solid #4ade80;

    .history-rating {
      background: rgba(74, 222, 128, 0.2);
      color: #4ade80;
    }
  }

  &.result-fail {
    border-left: 4px solid #ff2d55;
  }

  &.result-timeout {
    border-left: 4px solid #f59e0b;
  }
}

.history-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-icon {
  font-size: 1.5rem;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.8);
}

.history-mode {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(241, 245, 249, 0.5);
}

.history-item-right {
  text-align: right;
}

.history-time {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #00d9ff;
  margin-bottom: 4px;
}

.history-rating {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.clear-button {
  width: 100%;
  padding: 16px;
  margin-top: 24px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(255, 45, 85, 0.8);
  background: rgba(255, 45, 85, 0.1);
  border: 1px solid rgba(255, 45, 85, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 45, 85, 0.2);
    border-color: rgba(255, 45, 85, 0.5);
    transform: translateY(-2px);
  }
}

// Mobile styles
@media (max-width: 480px) {
  .history-item {
    padding: 12px;
  }

  .history-time {
    font-size: 1rem;
  }
}
</style>
