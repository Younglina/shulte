<template>
  <div class="training-page">
    <div class="page-header">
      <h1 class="page-title">舒尔特表训练</h1>
      <p class="page-subtitle">航天员级别专注力训练</p>
    </div>

    <div class="training-content">
      <template v-if="!isPlaying && !currentRecord">
        <ModeSelector v-model="selectedMode" />
        
        <div class="start-section">
          <button class="start-button" @click="handleStart">
            <span class="start-icon">🚀</span>
            <span class="start-text">开始训练</span>
          </button>
          
          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">📖</div>
              <div class="info-title">规则说明</div>
              <div class="info-text">按 1-25 顺序点击数字</div>
            </div>
            <div class="info-card">
              <div class="info-icon">⚠️</div>
              <div class="info-title">注意事项</div>
              <div class="info-text">点击错误即失败</div>
            </div>
            <div class="info-card">
              <div class="info-icon">⏱️</div>
              <div class="info-title">时间限制</div>
              <div class="info-text">{{ selectedMode }} 秒内完成</div>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="isPlaying">
        <div class="game-section">
          <TimerDisplay
            :time="timeRemaining"
            :total-time="parseInt(selectedMode)"
            label="剩余时间"
          />
          
          <GameGrid
            :numbers="gridNumbers"
            :is-playing="isPlaying"
            @click="handleGridClick"
          />
          
          <div class="progress-indicator">
            <div class="progress-label">当前数字</div>
            <div class="progress-value">{{ nextNumber }}/25</div>
          </div>
        </div>
      </template>


    </div>

    <!-- 失败弹窗 -->
    <Transition name="modal">
      <div v-if="showFailModal" class="modal-overlay" @click.self="handleModalClose">
        <div class="modal-content">
          <div class="modal-icon">❌</div>
          <div class="modal-title">挑战失败</div>
          <div class="modal-message">点击顺序错误，请继续努力！</div>
          
          <div class="modal-actions">
            <button class="modal-button primary" @click="handleRetry">
              <span class="button-icon">🔄</span>
              <span>立即重试</span>
            </button>
            <button class="modal-button secondary" @click="handleModalClose">
              <span class="button-icon">🏠</span>
              <span>返回首页</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 成功弹窗 -->
    <Transition name="modal">
      <div v-if="showSuccessModal" class="modal-overlay success" @click.self="handleSuccessModalClose">
        <div class="modal-content success">
          <div class="modal-icon">🎉</div>
          <div class="modal-title">挑战成功</div>
          <div class="modal-message">恭喜你完成了舒尔特表训练！</div>
          
          <div v-if="currentRecord?.gridNumbers" class="modal-grid-preview">
            <div class="grid-preview-container">
              <div class="grid-preview-grid">
                <div 
                  v-for="(number, index) in currentRecord.gridNumbers" 
                  :key="index" 
                  class="grid-preview-cell"
                >
                  {{ number }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-stats">
            <div class="stat-item">
              <div class="stat-label">用时</div>
              <div class="stat-value">{{ currentRecord?.timeUsed.toFixed(2) }}s</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">评级</div>
              <div class="stat-value" :class="ratingClass">{{ currentRecord?.result === 'success' ? getRating(currentRecord.timeUsed) : '-' }}</div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="modal-button primary" @click="handleRetry">
              <span class="button-icon">🔄</span>
              <span>再次挑战</span>
            </button>
            <button class="modal-button secondary" @click="handleSuccessModalClose">
              <span class="button-icon">📊</span>
              <span>查看记录</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 超时弹窗 -->
    <Transition name="modal">
      <div v-if="showTimeoutModal" class="modal-overlay timeout" @click.self="handleTimeoutModalClose">
        <div class="modal-content timeout">
          <div class="modal-icon">⏰</div>
          <div class="modal-title">时间到</div>
          <div class="modal-message">时间耗尽，再试一次吧！</div>
          
          <div class="modal-stats">
            <div class="stat-item">
              <div class="stat-label">用时</div>
              <div class="stat-value">{{ currentRecord?.timeUsed }}s</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">模式</div>
              <div class="stat-value">{{ currentRecord?.mode }}</div>
            </div>
          </div>
          
          <div class="modal-actions">
            <button class="modal-button primary" @click="handleRetry">
              <span class="button-icon">🔄</span>
              <span>再次挑战</span>
            </button>
            <button class="modal-button secondary" @click="handleTimeoutModalClose">
              <span class="button-icon">📊</span>
              <span>查看记录</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import confetti from 'canvas-confetti'
import { useGameLogic } from '../composables/useGameLogic'
import { useLocalStorage } from '../composables/useLocalStorage'
import ModeSelector from '../components/ModeSelector.vue'
import TimerDisplay from '../components/TimerDisplay.vue'
import GameGrid from '../components/GameGrid.vue'
import ResultCard from '../components/ResultCard.vue'

const router = useRouter()
const { selectedMode, gridNumbers, nextNumber, isPlaying, timeRemaining, isLowTime, startGame, handleClick, onTimeout } = useGameLogic()
const { saveHistory } = useLocalStorage()

const currentRecord = ref(null)
const showFailModal = ref(false)
const showSuccessModal = ref(false)
const showTimeoutModal = ref(false)

const ratingClass = computed(() => {
  if (!currentRecord.value || currentRecord.value.result !== 'success') return ''
  const time = currentRecord.value.timeUsed
  if (time <= 8) return 'rating-s'
  if (time <= 15) return 'rating-a'
  if (time <= 20) return 'rating-b'
  if (time <= 25) return 'rating-c'
  return 'rating-d'
})

const getRating = (time) => {
  if (time <= 8) return 'S级'
  if (time <= 15) return 'A级'
  if (time <= 20) return 'B级'
  if (time <= 25) return 'C级'
  return 'D级'
}

const fireConfetti = () => {
  const duration = 3000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 }

  function random(min, max) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()
    if (timeLeft <= 0) {
      return clearInterval(interval)
    }
    const particleCount = 50 * (timeLeft / duration)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
}

const handleStart = () => {
  onTimeout.value = (record) => {
    currentRecord.value = record
    saveHistory(record)
    showTimeoutModal.value = true
  }
  startGame()
}

const handleGridClick = (number) => {
  const record = handleClick(number)
  if (record) {
    currentRecord.value = record
    saveHistory(record)
    
    if (record.result === 'fail') {
      showFailModal.value = true
    } else if (record.result === 'success') {
      fireConfetti()
      showSuccessModal.value = true
    }
  }
}

const handleRetry = () => {
  showFailModal.value = false
  showSuccessModal.value = false
  showTimeoutModal.value = false
  currentRecord.value = null
  setTimeout(() => {
    startGame()
  }, 100)
}

const handleModalClose = () => {
  showFailModal.value = false
  currentRecord.value = null
}

const handleSuccessModalClose = () => {
  showSuccessModal.value = false
  handleViewHistory()
}

const handleTimeoutModalClose = () => {
  showTimeoutModal.value = false
  handleViewHistory()
}

const handleViewHistory = () => {
  router.push('/history')
}
</script>

<style scoped>
.training-page {
  min-height: 100vh;
  padding: 24px 20px;
  padding-bottom: 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  animation: slideUp 0.5s ease-out;
}

.page-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
}

.page-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.6);
  letter-spacing: 0.05em;
}

.training-content {
  max-width: 600px;
  margin: 0 auto;
}

.start-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  animation: fadeIn 0.5s ease-out 0.2s backwards;
}

.start-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 48px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f1f5f9;
  background: linear-gradient(135deg, #00d9ff 0%, #00a8cc 100%);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 30px rgba(0, 217, 255, 0.3),
    0 8px 24px rgba(0, 217, 255, 0.2);
}

.start-button:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 0 40px rgba(0, 217, 255, 0.4),
    0 12px 32px rgba(0, 217, 255, 0.3);
}

.start-icon {
  font-size: 1.5rem;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
}

.info-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(15, 21, 32, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 217, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 217, 255, 0.1);
}

.info-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.info-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 8px;
}

.info-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(241, 245, 249, 0.6);
  text-align: center;
}

.game-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  animation: fadeIn 0.5s ease-out;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(15, 21, 32, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 12px;
}

.progress-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.6);
}

.progress-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #00d9ff;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: fadeIn 0.5s ease-out;
}

.result-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.primary {
  color: #f1f5f9;
  background: rgba(0, 217, 255, 0.1);
  border-color: #00d9ff;
}

.action-button.primary:hover {
  background: rgba(0, 217, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 217, 255, 0.2);
  transform: translateY(-2px);
}

.action-button.secondary {
  color: rgba(241, 245, 249, 0.8);
  background: rgba(15, 21, 32, 0.8);
  border-color: rgba(241, 245, 249, 0.2);
}

.action-button.secondary:hover {
  background: rgba(26, 35, 50, 0.8);
  border-color: rgba(241, 245, 249, 0.3);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.25rem;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  padding: 20px;
}

.modal-overlay.success {
  background: rgba(0, 0, 0, 0.7);
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  background: rgba(10, 14, 23, 0.95);
  border: 2px solid rgba(255, 45, 85, 0.3);
  border-radius: 20px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(255, 45, 85, 0.2);
  animation: modalSlideUp 0.3s ease-out;
}

.modal-content.success {
  border-color: rgba(74, 222, 128, 0.3);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(74, 222, 128, 0.2);
}

.modal-content.timeout {
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(245, 158, 11, 0.2);
}

.modal-icon {
  font-size: 4rem;
  animation: modalBounce 0.5s ease-out;
}

.modal-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #ff2d55;
  text-shadow: 0 0 20px rgba(255, 45, 85, 0.5);
  text-align: center;
}

.modal-content.success .modal-title {
  color: #4ade80;
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.5);
}

.modal-content.timeout .modal-title {
  color: #f59e0b;
  text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}

.modal-message {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: rgba(241, 245, 249, 0.8);
  text-align: center;
  line-height: 1.6;
}

.modal-grid-preview {
  margin-bottom: 24px;
  width: 100%;
  display: flex;
  justify-content: center;
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

.modal-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: rgba(15, 21, 32, 0.8);
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

.stat-value.rating-s {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.stat-value.rating-a {
  color: #4ade80;
  text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
}

.stat-value.rating-b {
  color: #00d9ff;
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

.stat-value.rating-c {
  color: #f59e0b;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.stat-value.rating-d {
  color: #ff2d55;
  text-shadow: 0 0 10px rgba(255, 45, 85, 0.5);
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.modal-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.modal-button.primary {
  color: #f1f5f9;
  background: linear-gradient(135deg, #00d9ff 0%, #00a8cc 100%);
  border-color: #00d9ff;
}

.modal-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 217, 255, 0.3);
}

.modal-button.secondary {
  color: rgba(241, 245, 249, 0.8);
  background: rgba(15, 21, 32, 0.8);
  border-color: rgba(241, 245, 249, 0.2);
}

.modal-button.secondary:hover {
  background: rgba(26, 35, 50, 0.8);
  border-color: rgba(241, 245, 249, 0.3);
  transform: translateY(-2px);
}

.button-icon {
  font-size: 1.25rem;
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

@keyframes modalSlideUp {
  from {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes modalBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .result-actions {
    grid-template-columns: 1fr;
  }

  .start-button {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    padding: 32px 24px;
  }

  .modal-title {
    font-size: 1.5rem;
  }

  .modal-icon {
    font-size: 3rem;
  }

  .grid-preview-cell {
    font-size: 0.625rem;
  }
}
</style>
