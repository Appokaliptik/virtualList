<template>
  <div class="p-3">
    <h1 class="mb-10 text-5xl">Список</h1>
    <button
      @click="reverseList"
      class="mb-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
    >
      reverse
    </button>
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
          transform: `translateY(${scrollTop}px)`,
        }"
      >
        <div
          v-for="item in virtList"
          :key="item.index"
          :style="{}"
          class="border-t-2 border-gray-700 flex h-10 px-3 items-center first-of-type:border-t-0"
        >
          <template v-if="isScrolling"> scrolling </template>
          <template v-else> {{ item.index }}. {{ item.text }} </template>
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
  Array.from({ length: 1_000_000 }, (_, index) => ({
    index: index,
    text: 'Element ' + index,
  })),
)

const itemHeight: number = 40
const outerContainerHeight: number = 800
const innerContainerHeight: ComputedRef<number> = computed(() => {
  return items.value.length * itemHeight
})

const overScan: number = 3

const reverseList = (): Ref<Array<itemInterface>> => {
  items.value = [...items.value.slice().reverse()]
  return items
}

const scrollElementRef = ref<HTMLDivElement | null>(null)

const startIndex: ComputedRef<number> = computed(() => {
  const start = Math.floor(scrollTop.value / itemHeight)
  return Math.max(0, start - overScan)
})
const endIndex: ComputedRef<number> = computed(() => {
  const end = Math.ceil((scrollTop.value + outerContainerHeight) / itemHeight)
  return Math.min(items.value.length - 1, end + overScan)
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
const isScrolling: Ref<boolean> = ref(false)
const timeoutId: Ref<number | null> = ref(null)

function debounce(fn, delay?) {
  let timeoutID = null
  return function () {
    clearTimeout(timeoutID)
    const args = arguments
    const that = this
    timeoutID = setTimeout(function () {
      fn.apply(that, args)
    }, delay || 150)
  }
}

const handleScroll = () => {
  isScrolling.value = true
  if (typeof timeoutId.value === 'number') {
    clearTimeout(timeoutId.value)
  }
  timeoutId.value = setTimeout(() => {
    isScrolling.value = false
  }, 150)

  if (scrollElementRef.value) {
    scrollTop.value = scrollElementRef.value.scrollTop
    console.log('offsetTop:', scrollTop.value)
    console.log(startIndex.value + '  ' + endIndex.value)
  }
}

onMounted(() => {
  if (scrollElementRef.value) {
    scrollElementRef.value.addEventListener('scroll', debounce(handleScroll))
  }
})
onUnmounted(() => {
  if (scrollElementRef.value) {
    scrollElementRef.value?.removeEventListener('scroll', debounce(handleScroll))
  }
})
</script>

<style scoped></style>
