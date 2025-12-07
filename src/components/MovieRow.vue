<template>
  <div class="movie-row">
    <h3 class="row-title">{{ title }}</h3>

    <div class="slider-wrapper" @mouseenter="showControls = true" @mouseleave="showControls = false">
      <button v-if="showLeft" class="handle left-handle" @click="scroll('left')">
        <i class="fas fa-chevron-left"></i>
      </button>

      <div ref="slider" class="slider" @scroll="checkScroll">
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

const scroll = (direction: 'left' | 'right') => {
  if (!slider.value) return
  const { clientWidth } = slider.value
  const scrollAmount = direction === 'left' ? -clientWidth : clientWidth
  slider.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
}

const checkScroll = () => {
  if (!slider.value) return
  showLeft.value = slider.value.scrollLeft > 0
}

onMounted(() => checkScroll())
</script>

<style scoped>
/* [디자인] 간격 더 넓힘 (60px -> 80px) */
.movie-row { margin-bottom: 80px; padding: 0 4%; position: relative; }
.row-title { color: #e5e5e5; font-size: 1.4rem; font-weight: bold; margin-bottom: 15px; }

.slider-wrapper { position: relative; }

.slider {
  display: flex; gap: 10px; overflow-x: auto; padding: 10px 0;
  scroll-behavior: smooth; scrollbar-width: none;
}
.slider::-webkit-scrollbar { display: none; }

.row-item { flex: 0 0 auto; width: 200px; transition: transform 0.3s; }
.row-item:hover { z-index: 10; }

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
  .handle { display: none; }
}
</style>