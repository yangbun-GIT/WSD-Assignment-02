<template>
  <div class="movie-row">
    <h3 class="row-title">{{ title }}</h3>

    <div class="slider-wrapper" @mouseenter="showControls = true" @mouseleave="showControls = false">
      <button v-if="showLeft" class="handle left-handle" @click="scroll('left')">
        <i class="fas fa-chevron-left"></i>
      </button>

      <div
          ref="slider"
          class="slider"
          @scroll="checkScroll"
          @mousedown="startDrag"
          @mouseleave="stopDrag"
          @mouseup="stopDrag"
          @mousemove="onDrag"
      >
        <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            class="row-item"
        />
      </div>

      <button class="handle right-handle" @click="scroll('right')">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MovieCard from './MovieCard.vue'

defineProps<{
  title: string
  movies: any[]
}>()

const slider = ref<HTMLElement | null>(null)
const showControls = ref(false)
const showLeft = ref(false)

// 스크롤 버튼 로직
const scroll = (direction: 'left' | 'right') => {
  if (!slider.value) return
  const { clientWidth } = slider.value
  const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
  slider.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

// 스크롤 위치 감지 (왼쪽 버튼 숨기기/보이기)
const checkScroll = () => {
  if (!slider.value) return
  showLeft.value = slider.value.scrollLeft > 0
}

// === 마우스 드래그 로직 (Optional) ===
let isDown = false
let startX = 0
let scrollLeft = 0

const startDrag = (e: MouseEvent) => {
  if (!slider.value) return
  isDown = true
  slider.value.classList.add('active')
  startX = e.pageX - slider.value.offsetLeft
  scrollLeft = slider.value.scrollLeft
}
const stopDrag = () => {
  isDown = false
  if (slider.value) slider.value.classList.remove('active')
}
const onDrag = (e: MouseEvent) => {
  if (!isDown || !slider.value) return
  e.preventDefault()
  const x = e.pageX - slider.value.offsetLeft
  const walk = (x - startX) * 2 // 드래그 속도 조절
  slider.value.scrollLeft = scrollLeft - walk
}

onMounted(() => checkScroll())
</script>

<style scoped>
.movie-row { margin-bottom: 40px; padding: 0 4%; position: relative; }
.row-title { color: #e5e5e5; font-size: 1.4rem; font-weight: bold; margin-bottom: 10px; }

.slider-wrapper { position: relative; }

.slider {
  display: flex; gap: 10px; overflow-x: auto; padding: 10px 0;
  scroll-behavior: smooth; scrollbar-width: none; /* 파이어폭스 스크롤바 숨김 */
  cursor: grab;
}
.slider::-webkit-scrollbar { display: none; /* 크롬 스크롤바 숨김 */ }
.slider.active { cursor: grabbing; }

.row-item { flex: 0 0 auto; width: 200px; transition: transform 0.3s; }
.row-item:hover { z-index: 10; }

/* 슬라이드 버튼 (핸들) */
.handle {
  position: absolute; top: 0; bottom: 0; width: 50px;
  background: rgba(0,0,0,0.5); border: none; color: white;
  font-size: 2rem; cursor: pointer; z-index: 20;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.3s, background 0.3s;
}
.slider-wrapper:hover .handle { opacity: 1; }
.handle:hover { background: rgba(0,0,0,0.8); transform: scale(1.1); }
.left-handle { left: -50px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; }
.right-handle { right: -50px; border-top-left-radius: 4px; border-bottom-left-radius: 4px; }

@media (max-width: 768px) {
  .row-item { width: 120px; }
  .handle { display: none; } /* 모바일에서는 버튼 숨기고 터치 스크롤 사용 */
}
</style>