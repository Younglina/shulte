<template>
  <div class="result-card" :class="resultClass">
    <div class="result-icon">{{ icon }}</div>
    <div class="result-title">{{ title }}</div>
    <div class="result-message">{{ message }}</div>
    
    <div v-if="record && record.gridNumbers" class="grid-preview">
      <div class="grid-preview-container">
        <div class="grid-preview-grid">
          <div 
            v-for="(number, index) in record.gridNumbers" 
            :key="index" 
            class="grid-preview-cell"
          >
            {{ number }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="record" class="result-stats">
      <div class="stat-item">
        <div class="stat-label">用时</div>
        <div class="stat-value">{{ record.timeUsed.toFixed(2) }}s</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">模式</div>
        <div class="stat-value">{{ record.mode }}</div>
      </div>
      <div v-if="record.result === 'success'" class="stat-item">
        <div class="stat-label">评级</div>
        <div class="stat-value" :class="ratingClass">{{ rating }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  record: {
    type: Object,
    required: true,
  },
})

const resultClass = computed(() => {
  return `result-${props.record.result}`
})

const icon = computed(() => {
  switch (props.record.result) {
    case 'success':
      return '🎉'
    case 'fail':
      return '❌'
    case 'timeout':
      return '⏰'
    default:
      return '📊'
  }
})

const title = computed(() => {
  switch (props.record.result) {
    case 'success':
      return '挑战成功'
    case 'fail':
      return '挑战失败'
    case 'timeout':
      return '时间到'
    default:
      return '完成'
  }
})

const message = computed(() => {
  switch (props.record.result) {
    case 'success':
      return '恭喜你完成了舒尔特表训练！'
    case 'fail':
      return '点击顺序错误，请继续努力！'
    case 'timeout':
      return '时间耗尽，再试一次吧！'
    default:
      return ''
  }
})

const rating = computed(() => {
  if (props.record.result !== 'success') return '-'
  
  const time = props.record.timeUsed
  if (time <= 8) return 'S级'
  if (time <= 15) return 'A级'
  if (time <= 20) return 'B级'
  if (time <= 25) return 'C级'
  return 'D级'
})

const ratingClass = computed(() => {
  if (props.record.result !== 'success') return ''
  
  const time = props.record.timeUsed
  if (time <= 8) return 'rating-s'
  if (time <= 15) return 'rating-a'
  if (time <= 20) return 'rating-b'
  if (time <= 25) return 'rating-c'
  return 'rating-d'
})
</script>

<style scoped>
.result-card {
  padding: 32px;
  background: rgba(15, 21, 32, 0.9);
  border: 2px solid;
  border-radius: 20px;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

.result-success {
  border-color: #4ade80;
  box-shadow: 
    0 0 40px rgba(74, 222, 128, 0.2),
    inset 0 0 20px rgba(74, 222, 128, 0.05);
}

.result-fail {
  border-color: #ff2d55;
  box-shadow: 
    0 0 40px rgba(255, 45, 85, 0.2),
    inset 0 0 20px rgba(255, 45, 85, 0.05);
}

.result-timeout {
  border-color: #f59e0b;
  box-shadow: 
    0 0 40px rgba(245, 158, 11, 0.2),
    inset 0 0 20px rgba(245, 158, 11, 0.05);
}

.result-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: slideUp 0.5s ease-out 0.1s backwards;
}

.result-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  animation: slideUp 0.5s ease-out 0.2s backwards;
}

.result-success .result-title {
  color: #4ade80;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.result-fail .result-title {
  color: #ff2d55;
  text-shadow: 0 0 20px rgba(255, 45, 85, 0.5);
}

.result-timeout .result-title {
  color: #f59e0b;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}

.result-message {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: rgba(241, 245, 249, 0.8);
  margin-bottom: 24px;
  animation: slideUp 0.5s ease-out 0.3s backwards;
}

.grid-preview {
  margin-bottom: 24px;
  animation: slideUp 0.5s ease-out 0.35s backwards;
}

.grid-preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background: rgba(10, 14, 23, 0.5);
  border-radius: 12px;
}

.grid-preview-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
  padding: 4px;
  background: rgba(241, 245, 249, 0.1);
  border-radius: 8px;
}

.grid-preview-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
  background: rgba(26, 35, 50, 0.95);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(241, 245, 249, 0.9);
}

.result-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  animation: slideUp 0.5s ease-out 0.4s backwards;
}

.stat-item {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: rgba(26, 35, 50, 0.6);
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 12px;
}

.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(241, 245, 249, 0.6);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f1f5f9;
}

.rating-s {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.rating-a {
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.rating-b {
  color: #00d9ff;
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

.rating-c {
  color: #f59e0b;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.rating-d {
  color: #ff2d55;
  text-shadow: 0 0 10px rgba(255, 45, 85, 0.5);
}

@media (max-width: 480px) {
  .result-card {
    padding: 24px 16px;
  }

  .result-icon {
    font-size: 3rem;
  }

  .result-title {
    font-size: 1.5rem;
  }

  .grid-preview-cell {
    font-size: 0.625rem;
  }

  .result-stats {
    grid-template-columns: 1fr;
  }
}
</style>
