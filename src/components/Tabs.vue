<template>
  <div class="tabs-container">
    <div class="tabs-list">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: modelValue === tab.id }"
        @click="selectTab(tab.id)"
      >
        <span class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const selectTab = (tabId) => {
  emit('update:modelValue', tabId)
}
</script>

<style scoped>
.tabs-container {
  margin-bottom: 24px;
}

.tabs-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.tab-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: rgba(241, 245, 249, 0.6);
  background: rgba(15, 21, 32, 0.8);
  border: 2px solid rgba(0, 217, 255, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button:hover {
  border-color: rgba(0, 217, 255, 0.3);
  background: rgba(26, 35, 50, 0.8);
}

.tab-button.active {
  color: #00d9ff;
  background: rgba(0, 217, 255, 0.1);
  border-color: #00d9ff;
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.1);
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-label {
  font-weight: 500;
}

@media (max-width: 480px) {
  .tab-button {
    padding: 12px;
  }

  .tab-label {
    font-size: 0.75rem;
  }
}
</style>
