<template>
  <div class="stats-page">
    <div v-if="!stats || stats.total === 0" class="stats-empty">
      <div class="empty-icon">
        <i class="mdi mdi-chart-bar"></i>
      </div>
      <div class="empty-text">暂无统计数据</div>
    </div>

    <template v-else>
      <!-- 总体统计 -->
      <div class="stats-section">
        <div class="section-title">总体统计</div>
        <div class="stats-summary">
          <div class="summary-card">
            <div class="summary-icon">
              <i class="mdi mdi-bullseye"></i>
            </div>
            <div class="summary-data">
              <div class="summary-value">{{ stats.total }}</div>
              <div class="summary-label">总次数</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">
              <i class="mdi mdi-check-circle"></i>
            </div>
            <div class="summary-data">
              <div class="summary-value success">{{ stats.success }}</div>
              <div class="summary-label">成功</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">
              <i class="mdi mdi-flash"></i>
            </div>
            <div class="summary-data">
              <div class="summary-value">{{ stats.averageTime }}s</div>
              <div class="summary-label">平均用时</div>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon">
              <i class="mdi mdi-trophy"></i>
            </div>
            <div class="summary-data">
              <div class="summary-value highlight">{{ stats.bestTime }}s</div>
              <div class="summary-label">最佳成绩</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 限时模式统计 -->
      <div class="stats-section" v-if="stats.timed && stats.timed.total > 0">
        <div class="section-title">
          <i class="mdi mdi-timer"></i>
          限时模式
        </div>
        <div class="stats-summary">
          <div class="summary-card timed">
            <div class="summary-data">
              <div class="summary-value">{{ stats.timed.total }}</div>
              <div class="summary-label">训练次数</div>
            </div>
          </div>
          <div class="summary-card timed">
            <div class="summary-data">
              <div class="summary-value success">{{ stats.timed.success }}</div>
              <div class="summary-label">成功次数</div>
            </div>
          </div>
          <div class="summary-card timed">
            <div class="summary-data">
              <div class="summary-value">{{ stats.timed.averageTime }}s</div>
              <div class="summary-label">平均用时</div>
            </div>
          </div>
          <div class="summary-card timed">
            <div class="summary-data">
              <div class="summary-value highlight">{{ stats.timed.bestTime || '-' }}s</div>
              <div class="summary-label">最佳成绩</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 不限时模式统计 -->
      <div class="stats-section" v-if="stats.unlimited && stats.unlimited.total > 0">
        <div class="section-title">
          <i class="mdi mdi-infinity"></i>
          不限时模式
        </div>
        <div class="stats-summary">
          <div class="summary-card unlimited">
            <div class="summary-data">
              <div class="summary-value">{{ stats.unlimited.total }}</div>
              <div class="summary-label">练习次数</div>
            </div>
          </div>
          <div class="summary-card unlimited">
            <div class="summary-data">
              <div class="summary-value success">{{ stats.unlimited.success }}</div>
              <div class="summary-label">完成次数</div>
            </div>
          </div>
          <div class="summary-card unlimited">
            <div class="summary-data">
              <div class="summary-value">{{ stats.unlimited.averageTime }}s</div>
              <div class="summary-label">平均用时</div>
            </div>
          </div>
          <div class="summary-card unlimited">
            <div class="summary-data">
              <div class="summary-value highlight">{{ stats.unlimited.bestTime || '-' }}s</div>
              <div class="summary-label">最佳成绩</div>
            </div>
          </div>
        </div>
      </div>

      <StatsChart
        type="bar"
        :data="resultChartData"
        title="训练结果分布"
        subtitle="成功 / 失败 / 超时"
      />

      <StatsChart
        type="line"
        :data="timeChartData"
        title="成绩趋势"
        subtitle="最近 20 次训练"
      />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLocalStorage } from '../composables/useLocalStorage.js'
import StatsChart from '../components/StatsChart.vue'

const { history, getStats, getHistory } = useLocalStorage()

const stats = computed(() => {
  const statsData = getStats()
  return statsData || {
    total: 0,
    success: 0,
    fail: 0,
    timeout: 0,
    averageTime: 0,
    bestTime: null,
    worstTime: null,
    unlimited: { total: 0, success: 0, averageTime: 0, bestTime: null },
    timed: { total: 0, success: 0, averageTime: 0, bestTime: null },
  }
})

const resultChartData = computed(() => {
  if (!stats.value) {
    return {
      labels: ['成功', '失败', '超时'],
      datasets: [],
    }
  }

  return {
    labels: ['成功', '失败', '超时'],
    datasets: [
      {
        data: [stats.value.success, stats.value.fail, stats.value.timeout],
        backgroundColor: [
          'rgba(74, 222, 128, 0.8)',
          'rgba(255, 45, 85, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: [
          '#4ade80',
          '#ff2d55',
          '#f59e0b',
        ],
        borderWidth: 2,
      },
    ],
  }
})

const timeChartData = computed(() => {
  const historyList = getHistory()
  
  if (!historyList || historyList.length === 0) {
    return {
      labels: [],
      datasets: [],
    }
  }

  const successRecords = historyList
    .filter(r => r.result === 'success')
    .slice(-20)
    .reverse()

  return {
    labels: successRecords.map((_, i) => `#${i + 1}`),
    datasets: [
      {
        label: '用时 (秒)',
        data: successRecords.map(r => r.timeUsed),
        borderColor: '#00d9ff',
        backgroundColor: 'rgba(0, 217, 255, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }
})
</script>

<style scoped lang="scss">
.stats-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 24px 20px;
  gap: 24px;
  max-width: 600px;
  margin: 0 auto;
}

.stats-section {
  margin-bottom: 8px;
}

.section-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #00d9ff;
  display: flex;
  align-items: center;
  gap: 8px;
}

.stats-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: rgba(15, 21, 32, 0.6);
  border: 1px dashed rgba(0, 217, 255, 0.2);
  border-radius: 16px;

  &-icon {
    font-size: 4rem;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  &-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    color: rgba(241, 245, 249, 0.6);
  }
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: rgba(15, 21, 32, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 217, 255, 0.3);
    box-shadow: 0 8px 24px rgba(0, 217, 255, 0.1);
  }

  &.timed {
    border-color: rgba(0, 217, 255, 0.25);

    &:hover {
      border-color: rgba(0, 217, 255, 0.4);
      box-shadow: 0 8px 24px rgba(0, 217, 255, 0.15);
    }
  }

  &.unlimited {
    border-color: rgba(74, 222, 128, 0.25);

    &:hover {
      border-color: rgba(74, 222, 128, 0.4);
      box-shadow: 0 8px 24px rgba(74, 222, 128, 0.15);
    }

    .summary-value {
      color: rgba(74, 222, 128, 0.9);
    }
  }
}

.summary-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.summary-data {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;

  &.success {
    color: #4ade80;
    text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  }

  &.highlight {
    color: #00d9ff;
    text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
  }
}

.summary-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(241, 245, 249, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

// Mobile styles
@media (max-width: 480px) {
  .stats-summary {
    grid-template-columns: 1fr;
  }

  .summary-value {
    font-size: 1.25rem;
  }
}
</style>
