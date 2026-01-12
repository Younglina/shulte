<template>
  <div class="mode-selector">
    <div class="mode-label">选择模式</div>
    <div class="mode-options">
      <button
        v-for="mode in modes"
        :key="mode.value"
        class="mode-button"
        :class="{ active: modelValue === mode.value }"
        @click="selectMode(mode.value)"
      >
        <div class="mode-icon">{{ mode.icon }}</div>
        <div class="mode-title">{{ mode.title }}</div>
        <div class="mode-desc">{{ mode.desc }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const modes = [
  {
    value: '30',
    icon: '🎯',
    title: '30 秒',
    desc: '标准模式',
  },
  {
    value: '25',
    icon: '⚡',
    title: '25 秒',
    desc: '挑战模式',
  },
]

const selectMode = (mode) => {
  emit('update:modelValue', mode)
}
</script>

<style scoped>
.mode-selector {
  margin-bottom: 32px;
}

.mode-label {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.25rem;
  color: #f1f5f9;
  margin-bottom: 16px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.mode-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.mode-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(15, 21, 32, 0.8);
  border: 2px solid rgba(0, 217, 255, 0.2);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.mode-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mode-button:hover {
  border-color: rgba(0, 217, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 217, 255, 0.15);
}

.mode-button:hover::before {
  opacity: 1;
}

.mode-button.active {
  border-color: #00d9ff;
  background: rgba(0, 217, 255, 0.1);
  box-shadow: 
    0 0 30px rgba(0, 217, 255, 0.2),
    inset 0 0 20px rgba(0, 217, 255, 0.05);
}

.mode-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.mode-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 4px;
}

.mode-desc {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(241, 245, 249, 0.6);
}

@media (max-width: 480px) {
  .mode-options {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .mode-button {
    flex-direction: row;
    padding: 16px 20px;
  }

  .mode-icon {
    font-size: 1.5rem;
    margin-bottom: 0;
    margin-right: 16px;
  }

  .mode-title {
    font-size: 1rem;
    margin-bottom: 0;
  }

  .mode-desc {
    display: none;
  }
}
</style>
