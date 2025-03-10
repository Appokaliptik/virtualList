self.onmessage = function (event) {
  const { action, data, scrollTop, itemHeight, visibleItemCount } = event.data

  if (action === 'calculateVisibleItems') {
    const startIndex = Math.floor(scrollTop / itemHeight) // Индекс первого видимого элемента
    const endIndex = startIndex + visibleItemCount // Индекс последнего видимого элемента

    const visibleItems = data.slice(startIndex, endIndex) // Видимые элементы
    const offset = startIndex * itemHeight // Смещение для позиционирования

    self.postMessage({ visibleItems, offset })
  }
}
