<template>
  <div ref="container" class="virtual-list-container">
    <div :style="{ height: totalHeight + 'px' }" @scroll="handleScroll">
      <div
        v-for="item in visibleItems"
        :key="item"
        class="virtual-list-item"
        :style="{ transform: `translateY(${offset}px)` }"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref<HTMLDivElement | null>(null) // Ссылка на контейнер списка
const scrollTop = ref(0) // Текущая позиция прокрутки
const itemHeight = 50 // Высота одного элемента
const visibleItemCount = 20 // Количество видимых элементов
const totalItems = 1000000 // Общее количество элементов
const totalHeight = totalItems * itemHeight // Общая высота списка
const visibleItems = ref([]) // Видимые элементы
const offset = ref(0) // Смещение для позиционирования

// Создаём Worker
const worker = new Worker(new URL('./worker.js', import.meta.url))

// Обработчик прокрутки
const handleScroll = () => {
  if (container.value) {
    scrollTop.value = container.value.scrollTop
  }

  // Отправляем данные в Worker
  worker.postMessage({
    action: 'calculateVisibleItems',
    data: Array.from({ length: totalItems }, (_, i) => `Item ${i + 1}`),
    scrollTop: scrollTop.value,
    itemHeight,
    visibleItemCount,
  })
}

// Получаем результат от Worker
worker.onmessage = function (event) {
  const { visibleItems: newVisibleItems, offset: newOffset } = event.data
  visibleItems.value = newVisibleItems
  offset.value = newOffset
}

// Устанавливаем обработчик прокрутки
onMounted(() => {
  if (container.value) {
    container.value.addEventListener('scroll', handleScroll)
  }
})

// Убираем обработчик при уничтожении компонента
onUnmounted(() => {
  if (container.value) {
    container.value.removeEventListener('scroll', handleScroll)
  }
  worker.terminate() // Завершаем работу Worker
})
</script>

<style scoped>
.virtual-list-container {
  height: 500px; /* Высота видимой области */
  overflow-y: auto; /* Включаем прокрутку */
  border: 1px solid #ccc;
  position: relative;
}

.virtual-list-item {
  height: 50px; /* Высота элемента */
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}
</style>
