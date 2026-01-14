import { ref, computed, onUnmounted } from 'vue'

// Singleton state - created once at module level
const gridNumbers = ref([])
const nextNumber = ref(1)
const isPlaying = ref(false)
const timeRemaining = ref(0)
const elapsedTime = ref(0) // 正计时，用于不限时模式
const selectedMode = ref('30')
const timerInterval = ref(null)
const onTimeoutCallback = ref(null)

const GAME_SIZE = 5
const TOTAL_NUMBERS = GAME_SIZE * GAME_SIZE

// 检查是否为不限时模式
const isUnlimitedMode = computed(() => selectedMode.value === 'unlimited')

// 检查是否为限时模式
const isTimedMode = computed(() => !isUnlimitedMode.value)

// 获取限时模式的总时间
const timedTotal = computed(() => parseInt(selectedMode.value))

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

const generateGrid = () => {
  const numbers = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1)
  shuffleArray(numbers)
  gridNumbers.value = numbers
  return numbers
}

const startGame = () => {
  generateGrid()
  nextNumber.value = 1
  elapsedTime.value = 0
  isPlaying.value = true

  if (isUnlimitedMode.value) {
    // 不限时模式：使用正计时
    timeRemaining.value = 0
    timerInterval.value = setInterval(() => {
      elapsedTime.value += 0.1
    }, 100)
  } else {
    // 限时模式：使用倒计时
    timeRemaining.value = timedTotal.value
    timerInterval.value = setInterval(() => {
      timeRemaining.value -= 0.1
      if (timeRemaining.value <= 0) {
        const record = endGame('timeout')
        if (onTimeoutCallback.value) {
          onTimeoutCallback.value(record)
        }
      }
    }, 100)
  }
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

  const timeUsed = isUnlimitedMode.value
    ? elapsedTime.value
    : timedTotal.value - timeRemaining.value

  const record = {
    timestamp: Date.now(),
    mode: selectedMode.value,
    modeDisplay: isUnlimitedMode.value ? '不限时' : `${timedTotal.value}秒`,
    isTimed: isTimedMode.value,
    isUnlimited: isUnlimitedMode.value,
    result,
    timeUsed: parseFloat(timeUsed.toFixed(2)),
    errors: result === 'fail' ? 1 : 0,
    gridNumbers: [...gridNumbers.value],
    replayOf: null,
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
  if (isUnlimitedMode.value) {
    // 不限时模式下不显示进度百分比
    return 0
  }
  return ((timedTotal.value - timeRemaining.value) / timedTotal.value) * 100
})

// 不限时模式下显示正计时，否则显示倒计时
const displayTime = computed(() => {
  return isUnlimitedMode.value ? elapsedTime.value : timeRemaining.value
})

const isLowTime = computed(() => {
  return isTimedMode.value && timeRemaining.value <= 5
})

// 重新训练：使用指定的 gridNumbers 开始游戏
const replayGame = (gridNumbersArray, mode) => {
  selectedMode.value = mode
  gridNumbers.value = gridNumbersArray
  nextNumber.value = 1
  elapsedTime.value = 0
  isPlaying.value = true

  if (mode === 'unlimited') {
    // 不限时模式
    timeRemaining.value = 0
    timerInterval.value = setInterval(() => {
      elapsedTime.value += 0.1
    }, 100)
  } else {
    // 限时模式
    timeRemaining.value = parseInt(mode)
    timerInterval.value = setInterval(() => {
      timeRemaining.value -= 0.1
      if (timeRemaining.value <= 0) {
        const record = endGame('timeout')
        if (onTimeoutCallback.value) {
          onTimeoutCallback.value(record)
        }
      }
    }, 100)
  }
}

// Cleanup on unmount
onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

export function useGameLogic() {
  return {
    gridNumbers,
    nextNumber,
    isPlaying,
    timeRemaining,
    elapsedTime,
    displayTime,
    selectedMode,
    isUnlimitedMode,
    isTimedMode,
    GAME_SIZE,
    TOTAL_NUMBERS,
    generateGrid,
    replayGame,
    startGame,
    handleClick,
    endGame,
    formatTime,
    progressPercentage,
    isLowTime,
    onTimeout: onTimeoutCallback,
  }
}
