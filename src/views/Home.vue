<template>
  <div class="home-container">
    <Navbar />

    <div class="hero-wrapper" v-if="featuredMovie">
      <transition name="fade-hero" mode="out-in">
        <header :key="featuredMovie.id" class="hero-banner" :style="bannerStyle">
          <div class="hero-fade-top"></div>

          <button class="hero-arrow left" @click="prevBanner">
            <i class="fas fa-chevron-left"></i>
          </button>

          <div class="hero-content">
            <h1 class="hero-title">{{ featuredMovie.title || featuredMovie.name }}</h1>

            <p class="hero-overview">
              {{ truncate(featuredMovie.overview, 150) }}
              <span
                  v-if="featuredMovie.overview.length > 150"
                  class="read-more"
                  @click.stop="openModal(featuredMovie)"
              >
                더보기
              </span>
            </p>

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
    backgroundPosition: 'center top',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
  }
})

const openModal = (movie: any) => { selectedMovie.value = movie; showModal.value = true }

const truncate = (str: string, n: number) => {
  if (!str) return '';
  return str.length > n ? str.substr(0, n) : str;
}

const updateBanner = () => { if (popularMovies.value.length > 0) featuredMovie.value = popularMovies.value[bannerIndex.value] }
const nextBanner = () => { bannerIndex.value = (bannerIndex.value + 1) % popularMovies.value.length; updateBanner(); resetTimer() }
const prevBanner = () => { bannerIndex.value = (bannerIndex.value - 1 + popularMovies.value.length) % popularMovies.value.length; updateBanner(); resetTimer() }
const resetTimer = () => { clearInterval(bannerInterval); bannerInterval = setInterval(nextBanner, 60000) }

onMounted(async () => {
  const [pop, now, top, act, com] = await Promise.all([
    tmdb.get('/movie/popular'), tmdb.get('/movie/now_playing'), tmdb.get('/movie/top_rated'),
    tmdb.get('/discover/movie', { params: { with_genres: 28 } }), tmdb.get('/discover/movie', { params: { with_genres: 35 } }),
  ])
  popularMovies.value = pop.data.results; nowPlayingMovies.value = now.data.results; topRatedMovies.value = top.data.results; actionMovies.value = act.data.results; comedyMovies.value = com.data.results
  updateBanner(); resetTimer()
})
onUnmounted(() => { clearInterval(bannerInterval) })
</script>

<style scoped>
.home-container { min-height: 100vh; }

.hero-wrapper {
  position: relative;
  height: 85vh;
  min-height: 600px;
  overflow: hidden; background-color: #000;
}

.hero-banner {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  display: flex; align-items: center;
}
.fade-hero-enter-active, .fade-hero-leave-active { transition: opacity 0.8s ease-in-out; }
.fade-hero-enter-from, .fade-hero-leave-to { opacity: 0; }

.hero-content {
  width: 45%;
  margin-left: 6%;
  padding-top: 100px;
  z-index: 10;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: left;
}

.hero-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; color: white !important; line-height: 1.2; }

.hero-overview {
  width: 100%;
  max-width: 600px;
  line-height: 1.5;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  color: white !important;
}

.read-more {
  color: #b3b3b3;
  cursor: pointer;
  font-weight: bold;
  margin-left: 8px;
  text-decoration: underline;
  font-size: 1rem;
  transition: color 0.2s;
}
.read-more:hover { color: #e50914; }

.hero-buttons { display: flex; gap: 15px; margin-top: 20px; }
.btn { cursor: pointer; border: none; font-weight: 700; border-radius: 4px; padding: 0.8rem 2rem; font-size: 1.1rem; display: flex; align-items: center; gap: 10px; transition: transform 0.2s, background-color 0.2s; }
.btn-play { background-color: white; color: black; }
.btn-play:hover { background-color: #dcdcdc; transform: scale(1.05); }
.btn-info { background-color: rgba(109, 109, 110, 0.8); color: white; }
.btn-info:hover { background-color: rgba(109, 109, 110, 1); transform: scale(1.05); }

.hero-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  background: transparent; border: none; color: white;
  font-size: 3rem; padding: 20px; cursor: pointer;
  z-index: 20;
  opacity: 0; transition: opacity 0.3s, transform 0.2s;
  text-shadow: 0 0 15px rgba(0,0,0,0.9);
}
.hero-banner:hover .hero-arrow { opacity: 1; }
.hero-arrow:hover { transform: translateY(-50%) scale(1.2); color: #e50914; }
.left { left: 10px; }
.right { right: 10px; }

.hero-fade-top { position: absolute; top: 0; width: 100%; height: 150px; background-image: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, transparent 100%); z-index: 1; }
.hero-fade-bottom { position: absolute; bottom: 0; width: 100%; height: 20vh; background-image: linear-gradient(180deg, transparent, rgba(0,0,0,0.9)); z-index: 1; }

/* [수정 핵심] 메인 콘텐츠와 히어로 배너 겹침 제거 */
.main-content {
  position: relative;
  z-index: 20;
  /* 기존 margin-top: -10vh 를 0으로 변경하여 아래로 내림 */
  margin-top: 0;
  padding-bottom: 40px;
  /* 라이트 모드 가시성을 위해 패딩 추가 */
  padding-top: 20px;
}
.hero-skeleton { height: 85vh; width: 100%; background: #2f2f2f; }

@media (max-width: 1024px) {
  .hero-wrapper { height: 70vh; min-height: 500px; }
  .hero-title { font-size: 2.8rem; }
  .hero-content { width: 60%; margin-left: 5%; }
}

@media (max-width: 768px) {
  .hero-wrapper, .hero-banner, .hero-skeleton {
    height: 65vh;
    min-height: 450px;
  }
  .hero-content {
    width: 100%;
    margin-left: 0;
    padding: 0 20px;
    padding-top: 80px;
    align-items: flex-start;
  }
  .hero-title {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  .hero-overview {
    font-size: 1rem;
    line-height: 1.4;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .read-more { display: none; }
  .hero-arrow { display: none; }
  .hero-buttons { margin-top: 15px; gap: 10px; }
  .btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.95rem;
  }
  /* 모바일에서도 겹치지 않도록 마진 제거 유지 */
  .main-content { margin-top: 0; padding-top: 20px; }
}

@media (max-width: 480px) {
  .hero-wrapper, .hero-banner {
    height: 60vh;
    min-height: 400px;
  }
  .hero-title { font-size: 1.7rem; }
}
</style>