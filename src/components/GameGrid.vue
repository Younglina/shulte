<template>
  <div class="game-grid-container">
    <div 
      class="game-grid"
      :class="{ 'is-playing': isPlaying }"
    >
      <div
        v-for="(number, index) in numbers"
        :key="index"
        class="grid-cell"
        :style="{ animationDelay: `${index * 0.05}s` }"
        @click="handleCellClick(number)"
      >
        <span class="cell-number">{{ number }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  numbers: {
    type: Array,
    required: true,
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

const handleCellClick = (number) => {
  if (props.isPlaying) {
    emit('click', number)
  }
}
</script>

<style scoped lang="scss">
.game-grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(5, 38px);
  grid-template-rows: repeat(5, 38px);
  gap: 0;
  padding: 0;
  background: transparent;
  border: 2px solid #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &.is-playing {
    .grid-cell {
      cursor: pointer;
      transition: background 0.1s ease;

      &:hover {
        background: #f0f0f0;
      }
    }
  }
}

.grid-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 38px;
  height: 38px;
  background: #fff;
  border: 1px solid #000;
  font-family: 'SimSun', 'STSong', 'Songti SC', serif;
  font-size: 16px;
  font-weight: normal;
  color: #000;
  animation: slideUp 0.5s ease-out backwards;
  transition: all 0.3s ease;
}

.cell-number {
  user-select: none;
}

// Mobile styles
@media (max-width: 480px) {
  .game-grid {
    gap: 0;
    padding: 0;
    border-width: 1.5px;
  }
}
</style>
