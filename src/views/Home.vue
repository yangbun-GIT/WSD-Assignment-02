<template>
  <div class="home-container">
    <Navbar />

    <div class="hero-wrapper" v-if="featuredMovie">
      <transition name="fade-hero" mode="out-in">
        <header :key="featuredMovie.id" class="hero-banner" :style="bannerStyle">
          <button class="hero-arrow left" @click="prevBanner">
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="hero-content">
            <h1 class="hero-title">{{ featuredMovie.title || featuredMovie.name }}</h1>
            <p class="hero-overview">{{ truncate(featuredMovie.overview, 150) }}</p>
            <div class="hero-buttons">
              <button class="btn btn-play"><i class="fas fa-play"></i> 재생</button>
              <button class="btn btn-info" @click="openModal(featuredMovie)"><i class="fas fa-info-circle"></i> 상세 정보</button>
            </div>
          </div>

          <button class="hero-arrow right" @click="nextBanner">
            <i class="fas fa-chevron-right"></i>
          </button>

          <div class="hero-fade-bottom"></div>
        </header>
      </transition>
    </div>
    <div v-else class="hero-skeleton"></div>

    <main class="main-content">
      <MovieRow title="인기 콘텐츠" :movies="popularMovies" @movie-click="openModal" />
      <MovieRow title="지금 뜨는 콘텐츠" :movies="nowPlayingMovies" @movie-click="openModal" />
      <MovieRow title="평점 높은 영화" :movies="topRatedMovies" @movie-click="openModal" />
      <MovieRow title="액션 스릴러" :movies="actionMovies" @movie-click="openModal" />
      <MovieRow title="코미디" :movies="comedyMovies" @movie-click="openModal" />
    </main>

    <MovieModal v-if="showModal" :movie="selectedMovie" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieRow from '../components/MovieRow.vue'
import MovieModal from '../components/MovieModal.vue'

const featuredMovie = ref<any>(null)
const bannerIndex = ref(0)
let bannerInterval: any = null

const popularMovies = ref([])
const nowPlayingMovies = ref([])
const topRatedMovies = ref([])
const actionMovies = ref([])
const comedyMovies = ref([])

const showModal = ref(false)
const selectedMovie = ref<any>(null)

const bannerStyle = computed(() => {
  if (!featuredMovie.value) return {}
  const path = featuredMovie.value.backdrop_path || featuredMovie.value.poster_path
  return {
    backgroundImage: `url(https://image.tmdb.org/t/p/original${path})`,
    backgroundPosition: 'top center',
    backgroundSize: 'cover',
  }
})

const openModal = (movie: any) => { selectedMovie.value = movie; showModal.value = true }
const truncate = (str: string, n: number) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

const updateBanner = () => {
  if (popularMovies.value.length > 0) {
    featuredMovie.value = popularMovies.value[bannerIndex.value]
  }
}
const nextBanner = () => {
  bannerIndex.value = (bannerIndex.value + 1) % popularMovies.value.length
  updateBanner()
  resetTimer()
}
const prevBanner = () => {
  bannerIndex.value = (bannerIndex.value - 1 + popularMovies.value.length) % popularMovies.value.length
  updateBanner()
  resetTimer()
}
const resetTimer = () => {
  clearInterval(bannerInterval)
  // [수정] 1분(60000ms) 간격으로 자동 슬라이드
  bannerInterval = setInterval(nextBanner, 60000)
}

onMounted(async () => {
  const [pop, now, top, act, com] = await Promise.all([
    tmdb.get('/movie/popular'),
    tmdb.get('/movie/now_playing'),
    tmdb.get('/movie/top_rated'),
    tmdb.get('/discover/movie', { params: { with_genres: 28 } }),
    tmdb.get('/discover/movie', { params: { with_genres: 35 } }),
  ])

  popularMovies.value = pop.data.results
  nowPlayingMovies.value = now.data.results
  topRatedMovies.value = top.data.results
  actionMovies.value = act.data.results
  comedyMovies.value = com.data.results

  updateBanner()
  resetTimer()
})

onUnmounted(() => {
  clearInterval(bannerInterval)
})
</script>

<style scoped>
.home-container { min-height: 100vh; }

.hero-wrapper {
  position: relative;
  height: 85vh;
  overflow: hidden;
  background-color: #000;
}

.hero-banner {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex; align-items: center;
}

/* [추가] 부드러운 페이드 인/아웃 애니메이션 */
.fade-hero-enter-active,
.fade-hero-leave-active {
  transition: opacity 0.8s ease-in-out;
}
.fade-hero-enter-from,
.fade-hero-leave-to {
  opacity: 0;
}

.hero-content {
  margin-left: 4%;
  max-width: 600px;
  z-index: 10;
  padding-top: 80px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: white !important;
}

.hero-overview {
  width: 100%;
  line-height: 1.5;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  color: white !important;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* [수정] 버튼 크기 확대 (가시성 개선) */
.hero-buttons { display: flex; gap: 15px; margin-top: 20px; }
.btn {
  cursor: pointer; border: none; font-weight: 700; border-radius: 4px;
  padding: 1rem 2.5rem; font-size: 1.2rem; /* 크기 키움 */
  display: flex; align-items: center; gap: 12px;
  transition: transform 0.2s, background-color 0.2s;
}
.btn-play { background-color: white; color: black; }
.btn-play:hover { background-color: #dcdcdc; transform: scale(1.05); }
.btn-info { background-color: rgba(109, 109, 110, 0.8); color: white; }
.btn-info:hover { background-color: rgba(109, 109, 110, 1); transform: scale(1.05); }

/* [수정] 화살표 스타일: 배경 박스 제거하고 아이콘만 남김 */
.hero-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: transparent; /* 배경 투명 */
  border: none; color: white;
  font-size: 3.5rem; /* 아이콘 키움 */
  padding: 20px; cursor: pointer; z-index: 20;
  opacity: 0; transition: opacity 0.3s, transform 0.2s;
  text-shadow: 0 0 15px rgba(0,0,0,0.9); /* 그림자 추가 */
}
.hero-banner:hover .hero-arrow { opacity: 1; }
.hero-arrow:hover { transform: translateY(-50%) scale(1.2); color: #e50914; } /* 호버 시 빨간색 포인트 */
.left { left: 10px; }
.right { right: 10px; }

.hero-fade-bottom { position: absolute; bottom: 0; width: 100%; height: 10rem; background-image: linear-gradient(180deg, transparent, rgba(0,0,0,0.8)); }
.main-content { position: relative; z-index: 20; margin-top: 0; padding-top: 20px; }
.hero-skeleton { height: 85vh; width: 100%; background: #2f2f2f; }

@media (max-width: 768px) {
  .hero-wrapper, .hero-banner, .hero-skeleton { height: 60vh; }
  .hero-title { font-size: 2rem; }
  .hero-overview { font-size: 1rem; }
  .hero-arrow { display: none; }
  .btn { padding: 0.8rem 1.5rem; font-size: 1rem; }
}
</style>