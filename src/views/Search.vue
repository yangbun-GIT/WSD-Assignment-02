<template>
  <div class="search-container">
    <Navbar />
    <div class="content">
      <h2>콘텐츠 찾아보기</h2>
      <div class="search-controls">
        <div class="input-group">
          <i class="fas fa-search"></i>
          <input v-model="keyword" @keyup.enter="handleSearch" placeholder="제목으로 검색..." type="text" />
        </div>
        <select v-model="selectedGenre" @change="handleSearch">
          <option value="">모든 장르</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
        </select>

        <select v-model="selectedRating" @change="handleSearch">
          <option value="">모든 평점</option>
          <option value="9">⭐ 9점 이상</option>
          <option value="7">⭐ 7점 이상</option>
          <option value="5">⭐ 5점 이상</option>
        </select>

        <select v-model="selectedLang" @change="handleSearch">
          <option value="">모든 언어</option>
          <option value="ko">한국어</option>
          <option value="en">영어</option>
          <option value="ja">일본어</option>
        </select>

        <button @click="resetFilters" class="reset-btn"><i class="fas fa-undo"></i> 초기화</button>
      </div>

      <div v-if="isLoading" class="loading-msg">검색 중...</div>
      <div v-else-if="movies.length === 0" class="no-result">검색 결과가 없습니다.</div>

      <div v-else class="grid-container">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" @click="openModal(movie)" />
      </div>
    </div>
    <MovieModal v-if="showModal" :movie="selectedMovie" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
// ... 기존 스크립트 동일 ...
// (import 부분, fetchGenres, handleSearch 등 이전 답변의 Search.vue 스크립트 그대로 사용)
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'
import MovieModal from '../components/MovieModal.vue'

const movies = ref<any[]>([])
const genres = ref<any[]>([])
const keyword = ref('')
const selectedGenre = ref('')
const selectedRating = ref('')
const selectedLang = ref('')
const isLoading = ref(false)
const route = useRoute()
const showModal = ref(false)
const selectedMovie = ref<any>(null)
const openModal = (movie: any) => { selectedMovie.value = movie; showModal.value = true }

const fetchGenres = async () => { try { const res = await tmdb.get('/genre/movie/list'); genres.value = res.data.genres } catch (e) {} }
const handleSearch = async () => {
  isLoading.value = true
  try {
    let endpoint = '/discover/movie'
    const params: any = { page: 1, sort_by: 'popularity.desc' }
    if (keyword.value.trim()) { endpoint = '/search/movie'; params.query = keyword.value }
    else {
      if (selectedGenre.value) params.with_genres = selectedGenre.value
      if (selectedRating.value) params['vote_average.gte'] = selectedRating.value
      if (selectedLang.value) params.with_original_language = selectedLang.value
    }
    const res = await tmdb.get(endpoint, { params }); movies.value = res.data.results
  } catch (error) { console.error(error) } finally { isLoading.value = false }
}
const resetFilters = () => { keyword.value = ''; selectedGenre.value = ''; selectedRating.value = ''; selectedLang.value = ''; handleSearch() }
onMounted(async () => { await fetchGenres(); if (route.query.q) keyword.value = route.query.q as string; handleSearch() })
</script>

<style scoped>
/* 기존 스타일 + grid-container 수정 */
.search-container { min-height: 100vh; background-color: #141414; color: white; }
.content { padding: 100px 4% 40px; }
h2 { margin-bottom: 20px; font-weight: bold; }
.search-controls { display: flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; align-items: center; position: relative; z-index: 50; }
.input-group { position: relative; flex: 1; min-width: 200px; }
.input-group i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #888; }
.input-group input { width: 100%; padding: 12px 12px 12px 40px; background: #333; border: 1px solid #555; border-radius: 4px; color: white; font-size: 1rem; box-sizing: border-box; }
select { padding: 12px 20px; background: #333; color: white; border: 1px solid #555; border-radius: 4px; cursor: pointer; min-width: 120px; height: 100%; appearance: none; background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"); background-repeat: no-repeat; background-position: right 1rem top 50%; background-size: .65em auto; padding-right: 2.5rem; }
.reset-btn { background: #e50914; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; white-space: nowrap; height: 100%; }
.reset-btn:hover { background: #f40612; }
.no-result, .loading-msg { text-align: center; margin-top: 50px; color: #888; font-size: 1.2rem; }

/* [수정] 그리드 사이즈 150px로 조정 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  position: relative; z-index: 1;
}
@media (max-width: 768px) { .grid-container { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); } .input-group { min-width: 100%; } }
</style>