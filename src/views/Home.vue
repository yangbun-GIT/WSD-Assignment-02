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
      <MovieRow title="인기 영화" :movies="popularMovies" />
      <MovieRow title="최신 등록 콘텐츠" :movies="nowPlayingMovies" />
      <MovieRow title="평단의 찬사 (높은 평점)" :movies="topRatedMovies" />
      <MovieRow title="액션" :movies="actionMovies" />
      <MovieRow title="코미디" :movies="comedyMovies" />
      <MovieRow title="공포" :movies="horrorMovies" />
      <MovieRow title="SF / 판타지" :movies="scifiMovies" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieRow from '../components/MovieRow.vue'

const featuredMovie = ref<any>(null)
// 카테고리별 데이터 변수
const popularMovies = ref([])
const nowPlayingMovies = ref([])
const topRatedMovies = ref([])
const actionMovies = ref([])
const comedyMovies = ref([])
const horrorMovies = ref([])
const scifiMovies = ref([])

const truncate = (str: string, n: number) => str?.length > n ? str.substr(0, n - 1) + "..." : str;

const fetchAllMovies = async () => {
  try {
    const [pop, now, top, act, com, hor, sci] = await Promise.all([
      tmdb.get('/movie/popular'),
      tmdb.get('/movie/now_playing'),
      tmdb.get('/movie/top_rated'),
      tmdb.get('/discover/movie', { params: { with_genres: 28 } }), // 액션
      tmdb.get('/discover/movie', { params: { with_genres: 35 } }), // 코미디
      tmdb.get('/discover/movie', { params: { with_genres: 27 } }), // 공포
      tmdb.get('/discover/movie', { params: { with_genres: 878 } }) // SF
    ])

    popularMovies.value = pop.data.results
    nowPlayingMovies.value = now.data.results
    topRatedMovies.value = top.data.results
    actionMovies.value = act.data.results
    comedyMovies.value = com.data.results
    horrorMovies.value = hor.data.results
    scifiMovies.value = sci.data.results

    featuredMovie.value = pop.data.results[Math.floor(Math.random() * 10)] // 랜덤 추천
  } catch (error) {
    console.error('API Error:', error)
  }
}

onMounted(() => fetchAllMovies())
</script>

<style scoped>
.home { background-color: #141414; min-height: 100vh; }

.hero {
  position: relative; height: 85vh; background-size: cover; background-position: center top;
  display: flex; align-items: center; color: white;
}
.hero-content { margin-left: 4%; max-width: 600px; z-index: 10; margin-top: 50px; }
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

/* 겹침 문제 해결: 음수 마진 대신 z-index와 배경색 활용 */
.rows-container {
  position: relative;
  z-index: 20;
  margin-top: -100px; /* 배너 위로 살짝 올라오게 */
  background: transparent; /* 투명 유지하여 그라데이션 위에 얹음 */
  padding-bottom: 50px;
}
</style>