<template>
  <div class="stats-chart">
    <div class="chart-header">
      <div class="chart-title">{{ title }}</div>
      <div v-if="subtitle" class="chart-subtitle">{{ subtitle }}</div>
    </div>

    <div v-if="!hasData" class="chart-empty">
      <div class="empty-text">暂无数据</div>
    </div>

    <div v-else class="chart-container">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['line', 'bar', 'doughnut'].includes(value),
  },
  data: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})

const chartRef = ref(null)
let chartInstance = null

const hasData = computed(() => {
  return props.data.labels && props.data.labels.length > 0
})

const chartOptions = computed(() => {
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: props.type === 'doughnut',
        position: 'bottom',
        labels: {
          color: '#f1f5f9',
          font: {
            family: 'JetBrains Mono',
            size: 12,
          },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 23, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: 'rgba(241, 245, 249, 0.8)',
        borderColor: 'rgba(0, 217, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: {
          family: 'Orbitron',
          size: 14,
        },
        bodyFont: {
          family: 'JetBrains Mono',
          size: 12,
        },
      },
    },
    scales: {
      x: {
        display: props.type !== 'doughnut',
        grid: {
          color: 'rgba(0, 217, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(241, 245, 249, 0.6)',
          font: {
            family: 'JetBrains Mono',
            size: 10,
          },
        },
      },
      y: {
        display: props.type !== 'doughnut',
        grid: {
          color: 'rgba(0, 217, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(241, 245, 249, 0.6)',
          font: {
            family: 'JetBrains Mono',
            size: 10,
          },
        },
      },
    },
  }

  if (props.type === 'line') {
    baseOptions.elements = {
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
      },
    }
  }

  return baseOptions
})

const createChart = () => {
  if (!chartRef.value || !hasData.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartRef.value, {
    type: props.type,
    data: props.data,
    options: chartOptions.value,
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  if (hasData.value) {
    if (chartInstance) {
      chartInstance.update()
    } else {
      createChart()
    }
  } else if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.stats-chart {
  padding: 20px;
  background: rgba(15, 21, 32, 0.8);
  border: 1px solid rgba(0, 217, 255, 0.15);
  border-radius: 16px;
}

.chart-header {
  margin-bottom: 20px;
}

.chart-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 4px;
}

.chart-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.6);
}

.chart-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.empty-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.5);
}

.chart-container {
  min-height: 200px;
  max-height: 300px;
}
</style>
