<template>
  <div class="popular-container">
    <Navbar />

    <div class="content">
      <div class="header-section">
        <h2>대세 콘텐츠</h2>
        <div class="mode-toggle">
          <button
              :class="{ active: viewMode === 'table' }"
              @click="changeMode('table')"
          >
            페이지 보기
          </button>
          <button
              :class="{ active: viewMode === 'infinite' }"
              @click="changeMode('infinite')"
          >
            무한 스크롤
          </button>
        </div>
      </div>

      <div class="grid-container">
        <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
        />
      </div>

      <div v-if="viewMode === 'table'" class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
        <span class="page-num">{{ currentPage }} 페이지</span>
        <button @click="changePage(currentPage + 1)">다음</button>
      </div>

      <div v-if="viewMode === 'infinite'" ref="observerElement" class="observer-sentinel">
        <p v-if="isLoading">로딩 중...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'

const movies = ref<any[]>([])
const currentPage = ref(1)
const viewMode = ref<'table' | 'infinite'>('table')
const isLoading = ref(false)
const observerElement = ref<HTMLElement | null>(null)

const fetchMovies = async (page: number, isAppend: boolean) => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const res = await tmdb.get('/movie/popular', { params: { page: page } })

    if (isAppend) {
      const newMovies = res.data.results.filter((newM: any) =>
          !movies.value.some((oldM: any) => oldM.id === newM.id)
      )
      movies.value = [...movies.value, ...newMovies]
    } else {
      movies.value = res.data.results
    }

    // [핵심 수정] 무한 스크롤 모드이고, 화면이 꽉 차지 않았으면 더 불러오기
    if (viewMode.value === 'infinite') {
      await nextTick() // DOM 업데이트 대기

      // 화면 전체 높이(scrollHeight)가 창 높이(innerHeight)보다 작으면 스크롤바가 없는 상태
      if (document.documentElement.scrollHeight <= window.innerHeight) {
        console.log('화면이 덜 찼습니다. 추가 로드합니다.')
        currentPage.value++
        fetchMovies(currentPage.value, true) // 재귀 호출
      }
    }

  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const changeMode = (mode: 'table' | 'infinite') => {
  viewMode.value = mode
  currentPage.value = 1
  window.scrollTo(0, 0)
  fetchMovies(1, false)
}

const changePage = (page: number) => {
  if (page < 1) return
  currentPage.value = page
  window.scrollTo(0, 0)
  fetchMovies(page, false)
}

let observer: IntersectionObserver | null = null

const initObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading.value) {
      currentPage.value++
      fetchMovies(currentPage.value, true)
    }
  })

  if (observerElement.value) {
    observer.observe(observerElement.value)
  }
}

watch(() => [viewMode.value, observerElement.value], () => {
  if (viewMode.value === 'infinite' && observerElement.value) {
    initObserver()
  } else {
    if (observer) observer.disconnect()
  }
})

onMounted(() => fetchMovies(1, false))
onUnmounted(() => { if (observer) observer.disconnect() })
</script>

<style scoped>
.popular-container { min-height: 100vh; background-color: #141414; color: white; }
.content { padding: 100px 4% 40px; } /* 상단 여백 확보 */
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

.mode-toggle button {
  background: #333; color: #888; border: 1px solid #555; padding: 8px 16px;
  cursor: pointer; margin-left: 10px; border-radius: 4px; transition: 0.3s;
}
.mode-toggle button.active { background: #e50914; color: white; border-color: #e50914; font-weight: bold; }

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.pagination { display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 20px; }
.pagination button { background: #333; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

.observer-sentinel { height: 50px; text-align: center; margin-top: 20px; color: #888; }

@media (max-width: 768px) {
  .grid-container { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
}
</style>