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
      }
    }

    const successRecords = history.value.filter(r => r.result === 'success')
    const times = successRecords.map(r => r.timeUsed)

    return {
      total: history.value.length,
      success: history.value.filter(r => r.result === 'success').length,
      fail: history.value.filter(r => r.result === 'fail').length,
      timeout: history.value.filter(r => r.result === 'timeout').length,
      averageTime: times.length > 0 ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2) : 0,
      bestTime: times.length > 0 ? Math.min(...times) : null,
      worstTime: times.length > 0 ? Math.max(...times) : null,
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
