<template>
  <div class="popular-container">
    <Navbar />
    <div class="content">
      <div class="header-section">
        <h2>인기 콘텐츠</h2>
        <div class="mode-toggle">
          <button :class="{ active: viewMode === 'table' }" @click="changeMode('table')" title="페이지 보기"><i class="fas fa-th-large"></i></button>
          <button :class="{ active: viewMode === 'infinite' }" @click="changeMode('infinite')" title="무한 스크롤"><i class="fas fa-infinity"></i></button>
        </div>
      </div>

      <div class="grid-container">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
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

// [기능] 화면 높이를 체크하여 빈 공간이 있으면 데이터를 더 불러옴 (페이지/무한 모드 공통 적용)
const checkAndLoadMore = async () => {
  await nextTick()
  // 로딩 중이 아니고, 스크롤바가 생기지 않았으면 (콘텐츠가 화면보다 짧으면)
  if (!isLoading.value && document.documentElement.scrollHeight <= window.innerHeight + 100) {
    console.log('화면이 큽니다. 데이터를 추가 로드합니다.')

    // 페이지 모드일 때도 동작하도록 수정 (1페이지 -> 2페이지 데이터 병합)
    // 단, 페이지 모드에서는 최대 2페이지까지만 자동 병합 (너무 많이 부르면 페이징 의미 퇴색)
    if (viewMode.value === 'infinite' || (viewMode.value === 'table' && movies.value.length < 40)) {
      currentPage.value++ // 다음 페이지 번호 증가
      await fetchMovies(currentPage.value, true) // 이어붙이기 모드로 호출
    }
  }
}

const fetchMovies = async (page: number, isAppend: boolean) => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const res = await tmdb.get('/movie/popular', { params: { page: page } })

    if (isAppend) {
      const newMovies = res.data.results.filter((newM: any) => !movies.value.some((oldM: any) => oldM.id === newM.id))
      movies.value = [...movies.value, ...newMovies]
    } else {
      movies.value = res.data.results
    }
  } catch (error) { console.error(error) } finally {
    isLoading.value = false
    // 데이터 로드 후 화면이 꽉 찼는지 체크
    checkAndLoadMore()
  }
}

const changeMode = (mode: 'table' | 'infinite') => {
  viewMode.value = mode; currentPage.value = 1; window.scrollTo(0, 0)
  fetchMovies(1, false)
}

const changePage = (page: number) => {
  if (page < 1) return;
  currentPage.value = page; window.scrollTo(0, 0);
  fetchMovies(page, false) // 페이지 변경 시엔 덮어쓰기
}

let observer: IntersectionObserver | null = null
const initObserver = () => {
  if (observer) observer.disconnect()
  observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && !isLoading.value) { currentPage.value++; fetchMovies(currentPage.value, true) } })
  if (observerElement.value) observer.observe(observerElement.value)
}

watch(() => [viewMode.value, observerElement.value], () => {
  if (viewMode.value === 'infinite' && observerElement.value) { initObserver(); checkAndLoadMore() }
  else { if (observer) observer.disconnect() }
})

onMounted(() => fetchMovies(1, false))
onUnmounted(() => { if (observer) observer.disconnect() })
</script>

<style scoped>
.popular-container { min-height: 100vh; background-color: #141414; color: white; }
.content { padding: 80px 40px; }
.header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.mode-toggle button { background: transparent; color: #888; border: 1px solid #555; padding: 8px 12px; font-size: 1.2rem; cursor: pointer; margin-left: 10px; border-radius: 4px; transition: 0.3s; }
.mode-toggle button:hover { color: white; border-color: white; }
.mode-toggle button.active { background: #e50914; color: white; border-color: #e50914; }

.grid-container {
  display: grid;
  /* [롤백] 카드 크기 200px로 복구 */
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.pagination { display: flex; justify-content: center; align-items: center; margin-top: 40px; gap: 20px; }
.pagination button { background: #333; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.observer-sentinel { height: 50px; text-align: center; margin-top: 20px; color: #888; }
@media (max-width: 768px) { .grid-container { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); } }
</style>