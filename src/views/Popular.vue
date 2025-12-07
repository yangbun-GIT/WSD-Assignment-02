<template>
  <div class="popular-container">
    <Navbar />

    <div class="content">
      <div class="header-section">
        <h2>인기 콘텐츠</h2>
        <div class="mode-toggle">
          <button
              :class="{ active: viewMode === 'table' }"
              @click="changeMode('table')"
              title="페이지 보기"
          >
            <i class="fas fa-th-large"></i>
          </button>
          <button
              :class="{ active: viewMode === 'infinite' }"
              @click="changeMode('infinite')"
              title="무한 스크롤"
          >
            <i class="fas fa-infinity"></i>
          </button>
        </div>
      </div>

      <div class="grid-container">
        <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            @click="openModal(movie)"
        />
      </div>

      <div v-if="viewMode === 'table'" class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
        <span class="page-num">{{ currentPage }} 페이지</span>
        <button @click="changePage(currentPage + 1)">다음</button>
      </div>

      <div v-if="viewMode === 'infinite'" ref="observerElement" class="observer-sentinel">
        <p v-if="isLoading" class="loading-text">
          <i class="fas fa-spinner fa-spin"></i> 로딩 중...
        </p>
      </div>
    </div>

    <MovieModal v-if="showModal" :movie="selectedMovie" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'
import MovieModal from '../components/MovieModal.vue'

const movies = ref<any[]>([])
const currentPage = ref(1)
const viewMode = ref<'table' | 'infinite'>('table')
const isLoading = ref(false)
const observerElement = ref<HTMLElement | null>(null)

// 모달 상태
const showModal = ref(false)
const selectedMovie = ref<any>(null)
const openModal = (movie: any) => {
  selectedMovie.value = movie
  showModal.value = true
}

// [핵심 수정] 화면이 꽉 찰 때까지 재귀적으로 데이터 로드
const checkAndLoadMore = async () => {
  if (viewMode.value !== 'infinite') return

  await nextTick() // DOM 렌더링 대기

  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = window.innerHeight

  // 스크롤바가 아직 안 생겼거나, 하단 여유 공간이 너무 많으면 추가 로드
  if (!isLoading.value && scrollHeight <= clientHeight + 200) {
    console.log('화면이 비어있어 추가 로드합니다.')
    currentPage.value++
    await fetchMovies(currentPage.value, true)
  }
}

const fetchMovies = async (page: number, isAppend: boolean) => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const res = await tmdb.get('/movie/popular', { params: { page: page } })

    if (isAppend) {
      // 중복 제거 후 추가
      const newMovies = res.data.results.filter((newM: any) =>
          !movies.value.some((oldM: any) => oldM.id === newM.id)
      )
      movies.value = [...movies.value, ...newMovies]
    } else {
      movies.value = res.data.results
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    // [중요] 로딩이 끝난 후 화면 높이 체크 (재귀 호출 트리거)
    if (isAppend) {
      checkAndLoadMore()
    }
  }
}

const changeMode = (mode: 'table' | 'infinite') => {
  viewMode.value = mode
  currentPage.value = 1
  window.scrollTo(0, 0)

  // 모드 변경 시 초기화 후 로드
  fetchMovies(1, false).then(() => {
    if (mode === 'infinite') checkAndLoadMore()
  })
}

const changePage = (page: number) => {
  if (page < 1) return
  currentPage.value = page
  window.scrollTo(0, 0)
  fetchMovies(page, false)
}

// Intersection Observer (스크롤 감지)
let observer: IntersectionObserver | null = null

const initObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver((entries) => {
    // 센서가 화면에 보이고, 로딩 중이 아닐 때
    if (entries[0].isIntersecting && !isLoading.value) {
      currentPage.value++
      fetchMovies(currentPage.value, true)
    }
  })

  if (observerElement.value) {
    observer.observe(observerElement.value)
  }
}

// 모드 변경 감지 및 옵저버 재설정
watch(() => [viewMode.value, observerElement.value], async () => {
  if (viewMode.value === 'infinite' && observerElement.value) {
    initObserver()
    await checkAndLoadMore() // 진입 시 즉시 체크
  } else {
    if (observer) observer.disconnect()
  }
})

onMounted(() => fetchMovies(1, false))
onUnmounted(() => { if (observer) observer.disconnect() })
</script>

<style scoped>
.popular-container { min-height: 100vh; background-color: #141414; color: white; }
.content { padding: 100px 4% 40px; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

.mode-toggle button {
  background: transparent; color: #888; border: 1px solid #555;
  padding: 8px 12px; font-size: 1.2rem; cursor: pointer; margin-left: 10px; border-radius: 4px; transition: 0.3s;
}
.mode-toggle button:hover { color: white; border-color: white; }
.mode-toggle button.active { background: #e50914; color: white; border-color: #e50914; }

.grid-container {
  display: grid;
  /* [유지] 200px 최소 너비로 대화면에서 꽉 차게 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.pagination { display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 20px; }
.pagination button { background: #333; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

.observer-sentinel { height: 80px; text-align: center; margin-top: 20px; color: #888; display: flex; align-items: center; justify-content: center; }
.loading-text { font-size: 1.2rem; }

@media (max-width: 768px) {
  .grid-container { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
}
</style>