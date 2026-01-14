<template>
  <div class="result-page">
    <div class="page-header">
      <h1 class="page-title">训练结果</h1>
    </div>

    <div class="result-content">
      <ResultCard v-if="record" :record="record" />
      
      <button class="back-button" @click="handleBack">
        <span class="back-icon">🎯</span>
        <span>返回训练</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ResultCard from '../components/ResultCard.vue'

const router = useRouter()
const record = ref(null)

onMounted(() => {
  const savedRecord = sessionStorage.getItem('lastResult')
  if (savedRecord) {
    record.value = JSON.parse(savedRecord)
    sessionStorage.removeItem('lastResult')
  } else {
    router.push('/shulte/training')
  }
})

const handleBack = () => {
  router.push('/shulte/training')
}
</script>

<style scoped lang="scss">
.result-page {
  min-height: 100vh;
  padding: 24px 20px;
  padding-bottom: 120px;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  animation: slideUp 0.5s ease-out;
}

.page-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
}

.result-content {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  background: rgba(0, 217, 255, 0.1);
  border: 2px solid #00d9ff;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 217, 255, 0.2);
    box-shadow: 0 8px 24px rgba(0, 217, 255, 0.2);
    transform: translateY(-2px);
  }
}

.back-icon {
  font-size: 1.25rem;
}
</style>
