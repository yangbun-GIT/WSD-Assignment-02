<template>
  <div class="popular-container">
    <Navbar />

    <div class="content">
      <div class="header-section">
        <h2>인기 콘텐츠</h2>
        <div class="mode-toggle">
          <button :class="{ active: viewMode === 'table' }" @click="handleChangeMode('table')" title="페이지 보기">
            <i class="fas fa-th-large"></i>
          </button>
          <button :class="{ active: viewMode === 'infinite' }" @click="handleChangeMode('infinite')" title="무한 스크롤">
            <i class="fas fa-infinity"></i>
          </button>
        </div>
      </div>

      <div class="grid-container">
        <template v-if="isLoading && movies.length === 0">
          <SkeletonCard v-for="n in 10" :key="`skeleton-${n}`" />
        </template>

        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" @click="openModal(movie)" />
      </div>

      <div v-if="viewMode === 'table' && !isLoading" class="pagination">
        <button :disabled="currentPage === 1" @click="changePage(1)"><i class="fas fa-angle-double-left"></i></button>
        <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">이전</button>
        <span class="page-num">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)">다음</button>
        <button @click="changePage(totalPages)"><i class="fas fa-angle-double-right"></i></button>
      </div>

      <div v-if="viewMode === 'infinite'" ref="observerElement" class="observer-sentinel">
        <div v-if="isLoadingMore" class="loading-more">
          <i class="fas fa-spinner fa-spin"></i> 콘텐츠를 불러오는 중...
        </div>
      </div>
    </div>

    <transition name="fade">
      <button v-show="showTopBtn" class="top-btn" @click="scrollToTop"><i class="fas fa-arrow-up"></i></button>
    </transition>
    <MovieModal v-if="showModal" :movie="selectedMovie" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import tmdb from '../api/tmdb'
import { useMovieStore } from '../stores/movieStore'
import { storeToRefs } from 'pinia'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'
import MovieModal from '../components/MovieModal.vue'
import SkeletonCard from '../components/SkeletonCard.vue'

const store = useMovieStore()
const { viewMode } = storeToRefs(store)

const movies = ref<any[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)     // 초기 로딩용
const isLoadingMore = ref(false) // 추가 로딩용
const observerElement = ref<HTMLElement | null>(null)
const showTopBtn = ref(false)
const showModal = ref(false)
const selectedMovie = ref<any>(null)

const openModal = (movie: any) => { selectedMovie.value = movie; showModal.value = true }
const handleScroll = () => { showTopBtn.value = window.scrollY > 500 }
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

// 데이터 가져오기 함수
const fetchMovies = async (page: number, isAppend: boolean) => {
  if (isAppend) isLoadingMore.value = true
  else isLoading.value = true

  try {
    const res = await tmdb.get('/movie/popular', { params: { page: page } })
    totalPages.value = res.data.total_pages > 500 ? 500 : res.data.total_pages

    if (isAppend) {
      // 중복 제거 후 추가
      const newMovies = res.data.results.filter((newM: any) => !movies.value.some((oldM: any) => oldM.id === newM.id))
      movies.value = [...movies.value, ...newMovies]
    } else {
      movies.value = res.data.results
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

// 모드 변경 핸들러
const handleChangeMode = async (mode: 'table' | 'infinite') => {
  store.setViewMode(mode)
  currentPage.value = 1
  movies.value = []
  window.scrollTo(0, 0)

  if (mode === 'infinite') {
    // [핵심] 무한 스크롤 모드면 처음부터 3페이지(60개)를 로드하여 4K 화면을 채움
    await fetchInitialBatch()
  } else {
    // 테이블 모드면 1페이지만 로드
    fetchMovies(1, false)
  }
}

// [핵심 함수] 초기 3페이지(60개) 한번에 로드
const fetchInitialBatch = async () => {
  isLoading.value = true
  // 병렬로 요청을 보내서 속도 최적화
  const p1 = tmdb.get('/movie/popular', { params: { page: 1 } })
  const p2 = tmdb.get('/movie/popular', { params: { page: 2 } })
  const p3 = tmdb.get('/movie/popular', { params: { page: 3 } })

  try {
    const [res1, res2, res3] = await Promise.all([p1, p2, p3])
    // 3개 페이지 합치기
    const allResults = [...res1.data.results, ...res2.data.results, ...res3.data.results]
    // 중복 제거 (혹시 모를 API 중복 대비)
    const uniqueMovies = allResults.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)

    movies.value = uniqueMovies
    currentPage.value = 3 // 3페이지까지 로드했으므로 설정
    totalPages.value = res1.data.total_pages
  } catch (e) {
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  movies.value = []
  window.scrollTo(0, 0)
  fetchMovies(page, false)
}

// Intersection Observer (무한 스크롤)
let observer: IntersectionObserver | null = null
const initObserver = () => {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => {
    // 로딩 중이 아니고 요소가 보이면 다음 페이지 로드
    if (entries[0].isIntersecting && !isLoading.value && !isLoadingMore.value) {
      currentPage.value++
      fetchMovies(currentPage.value, true)
    }
  })
  if (observerElement.value) observer.observe(observerElement.value)
}

watch(() => [viewMode.value, observerElement.value], () => {
  if (viewMode.value === 'infinite' && observerElement.value) { initObserver() }
  else { if (observer) observer.disconnect() }
})

onMounted(async () => {
  // [핵심] 초기 진입 시 모드에 따라 데이터 로드 양 결정
  if (viewMode.value === 'infinite') {
    await fetchInitialBatch() // 60개 로드
  } else {
    await fetchMovies(1, false) // 20개 로드
  }
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 기존 스타일 유지 */
.popular-container { min-height: 100vh; color: white; position: relative; }
.content { padding: 100px 4% 40px; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.mode-toggle button { background: transparent; color: #888; border: 1px solid #555; padding: 8px 12px; font-size: 1.2rem; cursor: pointer; margin-left: 10px; border-radius: 4px; transition: 0.3s; }
.mode-toggle button:hover { color: white; border-color: white; }
.mode-toggle button.active { background: #e50914; color: white; border-color: #e50914; }

.grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }

.pagination { display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 15px; }
.pagination button { background: #333; color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 4px; font-size: 1rem; transition: 0.2s; }
.pagination button:hover:not(:disabled) { background: #555; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.page-num { font-weight: bold; margin: 0 10px; color: white; }
:global(body.light-mode) .page-num { color: #333 !important; }

.observer-sentinel { height: 80px; text-align: center; margin-top: 20px; color: #888; display: flex; align-items: center; justify-content: center; }
.loading-more { font-size: 1rem; color: #b3b3b3; }
.top-btn { position: fixed; bottom: 30px; right: 30px; background: #e50914; color: white; border: none; width: 50px; height: 50px; border-radius: 50%; font-size: 1.5rem; cursor: pointer; z-index: 100; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; transition: transform 0.3s, background 0.3s; }
.top-btn:hover { background: #f40612; transform: translateY(-5px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@media (max-width: 768px) { .grid-container { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); } }
</style>