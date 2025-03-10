<template>
  <div class="p-3">
    <h1 class="mb-10 text-5xl">Список</h1>
    <div
      class="w-full overflow-auto border-2 border-blue-700 relative"
      :style="{
        height: outerContainerHeight + 'px',
      }"
      ref="scrollElementRef"
    >
      <div
        class="absolute top-0 w-full"
        :style="{
          height: innerContainerHeight + 'px',
        }"
      >
        <div
          v-for="item in virtList"
          :key="item.index"
          :style="{
            transform: `translateY(${translateY}px)`,
          }"
          class="border-t-2 border-gray-700 flex h-10 px-3 items-center first-of-type:border-t-0"
        >
          {{ item.index }}. {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type ComputedRef, type Ref } from 'vue'

interface itemInterface {
  index: number
  text: string
}

const items: Ref<Array<itemInterface>> = ref(
  Array.from({ length: 3_000_000 }, (_, index) => ({
    index: index,
    text: 'Element ' + index,
  })),
)

const itemHeight: number = 40
const coef = 1000

const outerContainerHeight: number = 800
const innerContainerHeight: ComputedRef<number> = computed(() => {
  return (items.value.length * itemHeight) / coef
})
const itemsCount: ComputedRef<number> = computed(() => {
  return outerContainerHeight / itemHeight
})

const overScan: number = 0

const scrollElementRef = ref<HTMLDivElement | null>(null)

const startIndex: ComputedRef<number> = computed(() => {
  const start = Math.floor((scrollTop.value / itemHeight) * coef)
  return Math.max(0, start - overScan)
})
const endIndex: ComputedRef<number> = computed(() => {
  return Math.min(items.value.length - 1, startIndex.value + itemsCount.value - 1)
})

const virtList: ComputedRef<Array<itemInterface>> = computed(() => {
  const virtArr: Array<itemInterface> = []
  for (let i = startIndex.value; i <= endIndex.value; i++) {
    virtArr.push({
      index: i,
      text: items.value[i].text,
    })
  }
  return virtArr
})

const scrollTop: Ref<number> = ref(0)
const translateY = ref(0)

const handleScroll = () => {
  if (scrollElementRef.value) {
    if (scrollElementRef.value.scrollTop > innerContainerHeight.value) {
      return
    }
    scrollTop.value = Math.min(scrollElementRef.value.scrollTop, innerContainerHeight.value)
    translateY.value = scrollTop.value
    console.log('offsetTop:', scrollTop.value)
    console.log(startIndex.value + '  ' + endIndex.value)
  }
}

onMounted(() => {
  if (scrollElementRef.value) {
    scrollElementRef.value.addEventListener('scroll', handleScroll)
  }
})
onUnmounted(() => {
  if (scrollElementRef.value) {
    scrollElementRef.value?.removeEventListener('scroll', handleScroll)
  }
})
</script>

<style scoped></style>
