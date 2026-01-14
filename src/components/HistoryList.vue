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
        :class="[`result-${record.result}`, { 'is-replay': record.replayOf }]"
      >
        <div class="history-item-left">
          <div class="history-icon">
            <i :class="`mdi ${getResultIcon(record.result)}`"></i>
          </div>
          <div class="history-info">
            <div class="history-date">
              #{{ record.id }}
              <span v-if="record.replayOf" class="replay-badge">重练</span>
            </div>
            <div class="history-mode">{{ formatDate(record.timestamp) }} · {{ getModeDisplay(record) }}</div>
          </div>
        </div>
        <div class="history-item-right">
          <div class="history-main-info">
            <span class="history-time">{{ record.timeUsed.toFixed(2) }}s</span>
            <span v-if="record.result === 'success'" class="history-rating">
              {{ getRating(record) }}
            </span>
            <button
              class="replay-button"
              @click.stop="handleReplay(record)"
              title="重新训练"
            >
              <i class="mdi mdi-refresh"></i>
            </button>
          </div>
          <!-- 重练关联信息 -->
          <div v-if="record.replayOf" class="replay-info">
            <i class="mdi mdi-link"></i>
            <span>原#{{ record.comparison?.originalId || record.replayOf }}</span>
            <span v-if="record.comparison" class="comparison" :class="`comparison-${record.comparison.improvement}`">
              <i :class="getComparisonIcon(record.comparison.improvement)"></i>
              {{ record.comparison.timeDiff.toFixed(2) }}s
            </span>
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

const emit = defineEmits(['clear', 'replay'])

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

// 评级计算：支持不限时模式
const getRating = (record) => {
  if (record.result !== 'success') return '-'

  const time = record.timeUsed

  if (record.isUnlimited) {
    // 不限时模式：更宽松的评级
    if (time <= 15) return 'S'
    if (time <= 25) return 'A'
    if (time <= 35) return 'B'
    if (time <= 50) return 'C'
    return 'D'
  } else {
    // 限时模式：原有标准
    if (time <= 8) return 'S'
    if (time <= 15) return 'A'
    if (time <= 20) return 'B'
    if (time <= 25) return 'C'
    return 'D'
  }
}

// 模式显示文本
const getModeDisplay = (record) => {
  if (record.isUnlimited) {
    return '不限时'
  }
  return `${record.mode}秒模式`
}

// 获取对比图标
const getComparisonIcon = (improvement) => {
  switch (improvement) {
    case 'up':
      return 'mdi mdi-arrow-up-thin' // 更快，提升
    case 'down':
      return 'mdi mdi-arrow-down-thin' // 更慢，下降
    case 'same':
      return 'mdi mdi-minus' // 相同
    default:
      return 'mdi mdi-help'
  }
}

// 获取对比显示文本
const getComparisonText = (improvement) => {
  switch (improvement) {
    case 'up':
      return '提升'
    case 'down':
      return '下降'
    case 'same':
      return '不变'
    default:
      return ''
  }
}

const handleClear = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    emit('clear')
  }
}

const handleReplay = (record) => {
  emit('replay', record)
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

  &.is-replay {
    background: rgba(15, 21, 32, 0.9);
    border-color: rgba(74, 222, 128, 0.3);
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
  display: flex;
  align-items: center;
  gap: 6px;
}

.replay-badge {
  font-size: 0.625rem;
  padding: 2px 6px;
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  border-radius: 4px;
  font-weight: 500;
}

.history-mode {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(241, 245, 249, 0.5);
}

.history-item-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.history-main-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-time {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #00d9ff;
}

.history-rating {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.replay-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(0, 217, 255, 0.1);
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-radius: 4px;
  color: #00d9ff;
  cursor: pointer;
  transition: all 0.2s ease;
  vertical-align: middle;

  &:hover {
    background: rgba(0, 217, 255, 0.2);
    border-color: #00d9ff;
  }

  i {
    font-size: 0.75rem;
  }
}

.replay-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.625rem;
  color: rgba(241, 245, 249, 0.4);

  i {
    font-size: 0.625rem;
  }
}

.comparison {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;

  i {
    font-size: 0.625rem;
  }

  &.comparison-up {
    background: rgba(74, 222, 128, 0.15);
    color: #4ade80;
  }

  &.comparison-down {
    background: rgba(255, 45, 85, 0.15);
    color: #ff2d55;
  }

  &.comparison-same {
    background: rgba(241, 245, 249, 0.1);
    color: rgba(241, 245, 249, 0.6);
  }
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
