<template>
  <div class="app-container">
    <div class="background-effects" v-show="!isPlaying">
      <div class="grid-pattern absolute inset-0"></div>
      <div class="radial-gradient absolute inset-0"></div>
      <div class="particles-container"></div>
    </div>
    
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <Navigation />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from './components/Navigation.vue'
import { useGameLogic } from './composables/useGameLogic'
const route = useRoute()
const { isPlaying } = useGameLogic()
onMounted(() => {
  createParticles()
})

const createParticles = () => {
  const container = document.querySelector('.particles-container')
  if (!container) return

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div')
    particle.className = 'floating-particle'
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.animationDelay = `${Math.random() * 10}s`
    particle.style.animationDuration = `${8 + Math.random() * 6}s`
    container.appendChild(particle)
  }
}
</script>

<style scoped lang="scss">
.app-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.background-effects {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &.hide-particles {
    opacity: 0;
  }
}

.particles-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.main-content {
  position: relative;
  z-index: 1;
  flex: 1;
  padding-bottom: 80px;
}

// Page transitions
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
