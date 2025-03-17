<template>
  <div style="padding: 20px">
    <h1 style="margin-bottom: 20px; font-size: 48px">Список</h1>
    <input type="text" class="input" v-model="inputRef" />
    <div
      class="table-wrapper"
      :style="{
        height: outerContainerHeight + 'px',
      }"
    >
      <table class="table">
        <thead>
          <tr>
            <th colspan="5">header text</th>
          </tr>
        </thead>
        <tbody
          class="innerContainer"
          :style="{
            height: innerContainerHeight + 'px',
            'max-height': maxHeight + 'px',
          }"
          ref="scrollElementRef"
        >
          <tr
            v-for="item in virtList"
            :key="item.index"
            :style="{
              transform: `translateY(${translateY}px)`,
            }"
            class="item"
          >
            <td>{{ item.index }}</td>
            <td>{{ item.text }}</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
          </tr>
        </tbody>
      </table>
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

const outerContainerHeight: ComputedRef<number> = computed(() => {
  return maxHeight.value + itemHeight
})

const innerContainerHeight: ComputedRef<number> = computed(() => {
  return items.value.length * itemHeight
})

const maxHeight: ComputedRef<number> = computed(() => {
  return (itemsCount.value - 5) * itemHeight
})

const inputRef = ref<string>('10')
const itemsCount: ComputedRef<number> = computed(() => {
  return parseInt(inputRef.value) + 5
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

<style scoped>
.input {
  border: 1px solid grey;
  padding: 5px;
  margin-bottom: 20px;
}
.table-wrapper {
  border: 1px solid blue;
  box-sizing: border-box;
}
.table {
  width: 100%;
  position: relative;
  border-collapse: collapse;
}
th {
  position: sticky;
  height: 40px;
  top: 0;
  background: grey;
}
.innerContainer {
  position: absolute;
  width: 100%;
  display: block;
  box-sizing: border-box;
  overflow: auto;
}
.item {
  border-top: 1px solid blue;
  height: 40px;
  padding: 0px 10px;
  width: 100%;
  display: table;
  table-layout: fixed;
}
.item td {
  padding: 5px 10px;
}
.item:first-of-type {
  border-top: 0;
}

/* border-t-2 border-gray-700 flex h-10 px-3 items-center first-of-type:border-t-0 */
</style>
