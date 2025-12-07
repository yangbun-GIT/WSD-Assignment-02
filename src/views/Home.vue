<template>
  <div class="home">
    <Navbar />

    <div v-if="featuredMovie" class="hero" :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})` }">
      <div class="hero-content">
        <h1 class="hero-title">{{ featuredMovie.title }}</h1>
        <p class="hero-desc">{{ truncate(featuredMovie.overview, 150) }}</p>

        <div class="hero-buttons">
          <button class="btn play"><i class="fas fa-play"></i> 재생</button>
          <button class="btn info"><i class="fas fa-info-circle"></i> 상세 정보</button>
        </div>
      </div>
      <div class="hero-gradient"></div>
    </div>

    <div class="rows-container">
      <div class="category-row">
        <h3>🔥 지금 뜨는 콘텐츠</h3>
        <div class="slider">
          <MovieCard v-for="movie in popularMovies" :key="movie.id" :movie="movie" class="slide-item" />
        </div>
      </div>

      <div class="category-row">
        <h3>🎬 빵빵 터지는 액션</h3>
        <div class="slider">
          <MovieCard v-for="movie in actionMovies" :key="movie.id" :movie="movie" class="slide-item" />
        </div>
      </div>

      <div class="category-row">
        <h3>🤣 배꼽 빠지는 코미디</h3>
        <div class="slider">
          <MovieCard v-for="movie in comedyMovies" :key="movie.id" :movie="movie" class="slide-item" />
        </div>
      </div>

      <div class="category-row">
        <h3>🦁 흥미진진 다큐멘터리</h3>
        <div class="slider">
          <MovieCard v-for="movie in docuMovies" :key="movie.id" :movie="movie" class="slide-item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'

// 영화 데이터 상태 변수들
const featuredMovie = ref<any>(null)
const popularMovies = ref([])
const actionMovies = ref([])
const comedyMovies = ref([])
const docuMovies = ref([])

// 텍스트 길이 자르기 함수
const truncate = (str: string, n: number) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

// 각 장르별 데이터 가져오기
const fetchAllMovies = async () => {
  try {
    // 1. 인기 영화 (Hero용 + 목록용)
    const popRes = await tmdb.get('/movie/popular')
    popularMovies.value = popRes.data.results

    // Hero Movie는 인기 영화 중 첫 번째 것으로 선정
    featuredMovie.value = popRes.data.results[0]

    // 2. 액션 (Genre ID: 28)
    const actionRes = await tmdb.get('/discover/movie', { params: { with_genres: 28 } })
    actionMovies.value = actionRes.data.results

    // 3. 코미디 (Genre ID: 35)
    const comedyRes = await tmdb.get('/discover/movie', { params: { with_genres: 35 } })
    comedyMovies.value = comedyRes.data.results

    // 4. 다큐멘터리 (Genre ID: 99)
    const docuRes = await tmdb.get('/discover/movie', { params: { with_genres: 99 } })
    docuMovies.value = docuRes.data.results

  } catch (error) {
    console.error('API Error:', error)
  }
}

onMounted(() => {
  fetchAllMovies()
})
</script>

<style scoped>
.home { background-color: #141414; min-height: 100vh; overflow-x: hidden; }

/* === Hero Section === */
.hero {
  position: relative;
  height: 80vh; /* 화면의 80% 높이 */
  background-size: cover;
  background-position: center top;
  color: white;
  display: flex;
  align-items: center;
}

.hero-content {
  margin-left: 4%;
  max-width: 500px;
  z-index: 10;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.hero-desc {
  font-size: 1.2rem;
  line-height: 1.5;
  margin-bottom: 30px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.hero-buttons { display: flex; gap: 15px; }

.btn {
  border: none; padding: 10px 25px; border-radius: 4px;
  font-size: 1.1rem; font-weight: bold; cursor: pointer;
  display: flex; align-items: center; gap: 10px; transition: opacity 0.2s;
}

.btn.play { background-color: white; color: black; }
.btn.info { background-color: rgba(109, 109, 110, 0.7); color: white; }
.btn:hover { opacity: 0.8; }

.hero-gradient {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 200px;
  background: linear-gradient(180deg, transparent, #141414);
}

/* === Categorized Rows === */
.rows-container {
  margin-top: -100px; /* Hero 위로 살짝 겹치게 */
  position: relative;
  z-index: 20;
  padding-bottom: 50px;
}

.category-row { margin-bottom: 40px; padding-left: 4%; }
.category-row h3 { color: #e5e5e5; font-size: 1.4rem; margin-bottom: 15px; font-weight: bold; }

/* 가로 스크롤 슬라이더 */
.slider {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 15px;
  padding: 10px 0;
  scroll-behavior: smooth;
}
/* 스크롤바 숨기기 */
.slider::-webkit-scrollbar { display: none; }

/* 카드 아이템 크기 고정 */
.slide-item {
  flex: 0 0 auto; /* 크기 줄어들지 않음 */
  width: 200px; /* PC 기준 카드 너비 */
}

@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .hero-desc { font-size: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .slide-item { width: 120px; }
}
</style>