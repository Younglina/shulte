<template>
  <nav class="navigation">
    <div class="nav-container">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <div class="nav-icon">
          <i :class="`mdi ${item.icon}`"></i>
        </div>
        <div class="nav-label">{{ item.label }}</div>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/shulte', icon: 'mdi-bullseye', label: '训练' },
  { path: '/shulte/history', icon: 'mdi-chart-bar', label: '记录' },
  { path: '/shulte/stats', icon: 'mdi-chart-line', label: '统计' },
]

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped lang="scss">
.navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 14, 23, 0.95);
  border-top: 1px solid rgba(0, 217, 255, 0.2);
  backdrop-filter: blur(10px);
}

.nav-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 12px 0;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 12px;
  position: relative;

  &:hover {
    background: rgba(0, 217, 255, 0.1);
  }

  &.active {
    background: rgba(0, 217, 255, 0.15);

    .nav-icon {
      transform: translateY(-2px);
      filter: drop-shadow(0 0 8px rgba(0, 217, 255, 0.5));
    }

    .nav-label {
      color: #00d9ff;
      font-weight: 500;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: #00d9ff;
      border-radius: 50%;
      box-shadow: 0 0 10px #00d9ff;
    }
  }
}

.nav-icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.nav-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(241, 245, 249, 0.6);
  transition: color 0.3s ease;
}

// Desktop styles
@media (min-width: 768px) {
  .navigation {
    max-width: 400px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  }

  .nav-container {
    padding: 16px 0;
  }

  .nav-icon {
    font-size: 1.75rem;
  }

  .nav-label {
    font-size: 0.875rem;
  }
}
</style>
