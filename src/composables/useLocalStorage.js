import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'shuerte_history'

export function useLocalStorage() {
  const history = ref([])

  onMounted(() => {
    loadHistory()
  })

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        history.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
      history.value = []
    }
  }

  const saveHistory = (newRecord) => {
    history.value.unshift(newRecord)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  }

  const clearHistory = () => {
    history.value = []
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('清除历史记录失败:', error)
    }
  }

  const getHistory = () => {
    return history.value
  }

  const getStats = () => {
    if (history.value.length === 0) {
      return {
        total: 0,
        success: 0,
        fail: 0,
        timeout: 0,
        averageTime: 0,
        bestTime: null,
        worstTime: null,
        unlimited: {
          total: 0,
          success: 0,
          averageTime: 0,
          bestTime: null,
        },
        timed: {
          total: 0,
          success: 0,
          averageTime: 0,
          bestTime: null,
        },
      }
    }

    const successRecords = history.value.filter(r => r.result === 'success')
    const times = successRecords.map(r => r.timeUsed)

    // 不限时模式统计
    const unlimitedRecords = history.value.filter(r => r.isUnlimited)
    const unlimitedSuccess = unlimitedRecords.filter(r => r.result === 'success')
    const unlimitedTimes = unlimitedSuccess.map(r => r.timeUsed)

    // 限时模式统计
    const timedRecords = history.value.filter(r => r.isTimed)
    const timedSuccess = timedRecords.filter(r => r.result === 'success')
    const timedTimes = timedSuccess.map(r => r.timeUsed)

    return {
      total: history.value.length,
      success: history.value.filter(r => r.result === 'success').length,
      fail: history.value.filter(r => r.result === 'fail').length,
      timeout: history.value.filter(r => r.result === 'timeout').length,
      averageTime: times.length > 0 ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2) : 0,
      bestTime: times.length > 0 ? Math.min(...times) : null,
      worstTime: times.length > 0 ? Math.max(...times) : null,
      // 区分模式统计
      unlimited: {
        total: unlimitedRecords.length,
        success: unlimitedSuccess.length,
        averageTime: unlimitedTimes.length > 0 ? (unlimitedTimes.reduce((a, b) => a + b, 0) / unlimitedTimes.length).toFixed(2) : 0,
        bestTime: unlimitedTimes.length > 0 ? Math.min(...unlimitedTimes) : null,
      },
      timed: {
        total: timedRecords.length,
        success: timedSuccess.length,
        averageTime: timedTimes.length > 0 ? (timedTimes.reduce((a, b) => a + b, 0) / timedTimes.length).toFixed(2) : 0,
        bestTime: timedTimes.length > 0 ? Math.min(...timedTimes) : null,
      },
    }
  }

  return {
    history,
    loadHistory,
    saveHistory,
    clearHistory,
    getHistory,
    getStats,
  }
}
