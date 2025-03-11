<template>
  <div style="padding: 20px">
    <h1 style="margin-bottom: 20px; font-size: 48px">Список</h1>
    <div
      class="container"
      :style="{
        height: outerContainerHeight + 'px',
      }"
      ref="scrollElementRef"
    >
      <div
        class="innerContainer"
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
          class="item"
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

const scrollElementRef = ref<HTMLDivElement | null>(null)

const startIndex: ComputedRef<number> = computed(() => {
  let start = Math.floor((scrollTop.value / itemHeight) * coef)
  // console.log
  if (start > items.value.length - itemsCount.value) {
    start = items.value.length - itemsCount.value
  }
  return start
})
const endIndex: ComputedRef<number> = computed(() => {
  return Math.min(items.value.length, startIndex.value + itemsCount.value - 1)
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
    scrollTop.value = Math.min(scrollElementRef.value.scrollTop, innerContainerHeight.value)
    translateY.value = scrollTop.value
    // console.log('offsetTop:', scrollTop.value)
    // console.log(startIndex.value + '  ' + endIndex.value)
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

<style scoped>
.container {
  overflow: auto;
  border: 1px solid blue;
  position: relative;
  box-sizing: border-box;
}
.innerContainer {
  position: absolute;
  top: 0;
  width: 100%;
  box-sizing: border-box;
}
.item {
  border-top: 1px solid blue;
  height: 40px;
  display: flex;
  padding: 0px 10px;
  align-items: center;
  box-sizing: border-box;
}
.item:first-of-type {
  border-top: 0;
}

/* border-t-2 border-gray-700 flex h-10 px-3 items-center first-of-type:border-t-0 */
</style>
