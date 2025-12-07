<template>
  <div class="home">
    <Navbar />

    <div v-if="featuredMovie" class="hero" :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})` }">

      <button class="hero-arrow left" @click="prevBanner"><i class="fas fa-chevron-left"></i></button>

      <div class="hero-content">
        <h1 class="hero-title">{{ featuredMovie.title }}</h1>
        <p class="hero-desc">{{ truncate(featuredMovie.overview, 150) }}</p>
        <div class="hero-buttons">
          <button class="btn play"><i class="fas fa-play"></i> 재생</button>
          <button class="btn info"><i class="fas fa-info-circle"></i> 상세 정보</button>
        </div>
      </div>

      <button class="hero-arrow right" @click="nextBanner"><i class="fas fa-chevron-right"></i></button>

      <div class="hero-gradient"></div>
    </div>

    <div class="rows-container">
      <MovieRow title="인기 콘텐츠" :movies="popularMovies" />
      <MovieRow title="최신 콘텐츠" :movies="nowPlayingMovies" />
      <MovieRow title="평단의 찬사 (높은 평점)" :movies="topRatedMovies" />
      <MovieRow title="액션" :movies="actionMovies" />
      <MovieRow title="코미디" :movies="comedyMovies" />
      <MovieRow title="공포" :movies="horrorMovies" />
      <MovieRow title="SF / 판타지" :movies="scifiMovies" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieRow from '../components/MovieRow.vue'

const featuredMovie = ref<any>(null)
const bannerIndex = ref(0)
let bannerInterval: any = null

const popularMovies = ref([])
const nowPlayingMovies = ref([])
const topRatedMovies = ref([])
const actionMovies = ref([])
const comedyMovies = ref([])
const horrorMovies = ref([])
const scifiMovies = ref([])

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
  bannerInterval = setInterval(nextBanner, 60000)
}

const fetchAllMovies = async () => {
  try {
    const [pop, now, top, act, com, hor, sci] = await Promise.all([
      tmdb.get('/movie/popular'),
      tmdb.get('/movie/now_playing'),
      tmdb.get('/movie/top_rated'),
      tmdb.get('/discover/movie', { params: { with_genres: 28 } }),
      tmdb.get('/discover/movie', { params: { with_genres: 35 } }),
      tmdb.get('/discover/movie', { params: { with_genres: 27 } }),
      tmdb.get('/discover/movie', { params: { with_genres: 878 } })
    ])

    popularMovies.value = pop.data.results
    nowPlayingMovies.value = now.data.results
    topRatedMovies.value = top.data.results
    actionMovies.value = act.data.results
    comedyMovies.value = com.data.results
    horrorMovies.value = hor.data.results
    scifiMovies.value = sci.data.results

    updateBanner()
    resetTimer()
  } catch (error) { console.error('API Error:', error) }
}

onMounted(() => fetchAllMovies())
onUnmounted(() => clearInterval(bannerInterval))
</script>

<style scoped>
.home { background-color: #141414; min-height: 100vh; }

.hero {
  position: relative; height: 85vh; background-size: cover; background-position: center top;
  display: flex; align-items: center; color: white; transition: background-image 0.5s ease-in-out;
}
.hero-content { margin-left: 4%; max-width: 600px; z-index: 10; margin-top: 50px; flex: 1; }
.hero-title { font-size: 4rem; font-weight: 800; text-shadow: 2px 2px 4px rgba(0,0,0,0.6); margin-bottom: 20px;}
.hero-desc { font-size: 1.3rem; line-height: 1.5; margin-bottom: 30px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8); }
.hero-buttons { display: flex; gap: 15px; }
.btn { border: none; padding: 12px 30px; border-radius: 4px; font-size: 1.2rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 10px; }
.btn.play { background: white; color: black; }
.btn.play:hover { background: rgba(255,255,255,0.75); }
.btn.info { background: rgba(109, 109, 110, 0.7); color: white; }
.btn.info:hover { background: rgba(109, 109, 110, 0.4); }

.hero-gradient {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 15rem;
  background: linear-gradient(180deg, transparent, #141414);
}

/* [수정됨] 배너 화살표 디자인 */
.hero-arrow {
  background: none; /* 배경 제거 */
  border: none;
  color: white;
  font-size: 3.5rem; /* 크기 확대 */
  padding: 20px;
  cursor: pointer;
  z-index: 20;
  height: 100%;
  position: absolute;
  top: 0;
  opacity: 0.2; /* 평소엔 희미하게 */
  transition: all 0.3s ease;
  display: flex; align-items: center;
}
.hero-arrow.left { left: 10px; } /* 위치 조정 */
.hero-arrow.right { right: 10px; }

.hero:hover .hero-arrow { opacity: 0.5; } /* 배너 호버 시 약간 보임 */
.hero-arrow:hover { opacity: 1 !important; transform: scale(1.1); } /* 아이콘 호버 시 선명하고 커짐 */

.rows-container {
  position: relative; z-index: 20; margin-top: -100px;
  background: transparent; padding-bottom: 50px;
}
</style>