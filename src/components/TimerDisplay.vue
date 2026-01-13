<template>
  <div class="timer-container">
    <div class="timer-content">
      <div class="timer-label" v-if="label">{{ label }}</div>
      <div class="timer-value">
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  time: {
    type: Number,
    required: true,
  },
  totalTime: {
    type: Number,
    default: 30,
  },
  label: {
    type: String,
    default: '',
  },
})

const formattedTime = computed(() => {
  return Math.ceil(props.time)
})
</script>

<style scoped lang="scss">
.timer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 16px;
  background: rgba(15, 21, 32, 0.3);
  border: 1px solid rgba(241, 245, 249, 0.03);
  border-radius: 6px;
}

.timer-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 2px;
}

.timer-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(241, 245, 249, 0.25);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.timer-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(241, 245, 249, 0.35);
  min-width: 50px;
  text-align: center;
}

// Mobile styles
@media (max-width: 480px) {
  .timer-value {
    font-size: 0.9rem;
  }
}
</style>
