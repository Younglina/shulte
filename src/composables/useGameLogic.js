import { ref, computed, onUnmounted } from 'vue'

export function useGameLogic() {
  const gridNumbers = ref([])
  const nextNumber = ref(1)
  const isPlaying = ref(false)
  const timeRemaining = ref(0)
  const selectedMode = ref('30')
  const timerInterval = ref(null)
  const onTimeout = ref(null)

  const GAME_SIZE = 5
  const TOTAL_NUMBERS = GAME_SIZE * GAME_SIZE

  const generateGrid = () => {
    const numbers = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1)
    shuffleArray(numbers)
    gridNumbers.value = numbers
    return numbers
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  const startGame = () => {
    generateGrid()
    nextNumber.value = 1
    timeRemaining.value = parseInt(selectedMode.value)
    isPlaying.value = true
    
    timerInterval.value = setInterval(() => {
      timeRemaining.value -= 0.1
      if (timeRemaining.value <= 0) {
        const record = endGame('timeout')
        if (onTimeout.value) {
          onTimeout.value(record)
        }
      }
    }, 100)
  }

  const handleClick = (number) => {
    if (!isPlaying.value) return null

    if (number === nextNumber.value) {
      nextNumber.value += 1

      if (nextNumber.value > TOTAL_NUMBERS) {
        return endGame('success')
      }
    } else {
      return endGame('fail')
    }
    
    return null
  }

  const endGame = (result) => {
    isPlaying.value = false
    clearInterval(timerInterval.value)
    
    const timeUsed = parseInt(selectedMode.value) - timeRemaining.value
    const record = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      mode: `${selectedMode.value}s`,
      result,
      timeUsed: result === 'timeout' ? parseInt(selectedMode.value) : parseFloat(timeUsed.toFixed(2)),
      errors: result === 'fail' ? 1 : 0,
      gridNumbers: [...gridNumbers.value],
    }

    return record
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const milliseconds = Math.floor((time % 1) * 100)
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = computed(() => {
    const total = parseInt(selectedMode.value)
    return ((total - timeRemaining.value) / total) * 100
  })

  const isLowTime = computed(() => {
    return timeRemaining.value <= 5
  })

  onUnmounted(() => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
  })

  return {
    gridNumbers,
    nextNumber,
    isPlaying,
    timeRemaining,
    selectedMode,
    GAME_SIZE,
    TOTAL_NUMBERS,
    generateGrid,
    startGame,
    handleClick,
    endGame,
    formatTime,
    progressPercentage,
    isLowTime,
    onTimeout,
  }
}
