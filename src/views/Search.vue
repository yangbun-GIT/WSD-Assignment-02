<template>
  <div class="search-container">
    <Navbar />

    <div class="content">
      <h2>콘텐츠 찾아보기</h2>

      <div class="search-controls">
        <div class="input-group">
          <i class="fas fa-search"></i>
          <input
              v-model="keyword"
              @keyup.enter="handleSearch"
              placeholder="제목으로 검색..."
              type="text"
          />
        </div>

        <select v-model="selectedGenre" @change="handleSearch">
          <option value="">모든 장르</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>

        <button @click="resetFilters" class="reset-btn">
          <i class="fas fa-undo"></i> 초기화
        </button>
      </div>

      <div v-if="isLoading" class="loading-msg">검색 중...</div>

      <div v-else-if="movies.length === 0" class="no-result">
        검색 결과가 없습니다.
      </div>

      <div v-else class="grid-container">
        <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'

const movies = ref<any[]>([])
const genres = ref<any[]>([])
const keyword = ref('')
const selectedGenre = ref('')
const isLoading = ref(false)
const route = useRoute()

const fetchGenres = async () => {
  try {
    const res = await tmdb.get('/genre/movie/list')
    genres.value = res.data.genres
  } catch (error) { console.error(error) }
}

const handleSearch = async () => {
  isLoading.value = true
  try {
    let endpoint = '/discover/movie'
    const params: any = { page: 1 }

    if (keyword.value.trim()) {
      endpoint = '/search/movie'
      params.query = keyword.value
    } else {
      if (selectedGenre.value) params.with_genres = selectedGenre.value
      params.sort_by = 'popularity.desc'
    }

    const res = await tmdb.get(endpoint, { params })
    movies.value = res.data.results
  } catch (error) { console.error(error) } finally { isLoading.value = false }
}

const resetFilters = () => {
  keyword.value = ''
  selectedGenre.value = ''
  handleSearch()
}

onMounted(async () => {
  await fetchGenres()
  if (route.query.q) keyword.value = route.query.q as string
  handleSearch()
})
</script>

<style scoped>
.search-container { min-height: 100vh; background-color: #141414; color: white; }
/* [수정됨] 상단 여백 통일 */
.content { padding: 100px 4% 40px; }
h2 { margin-bottom: 20px; font-weight: bold; }

/* [수정됨] 반응형 줄바꿈 및 z-index 설정 */
.search-controls {
  display: flex; gap: 15px; margin-bottom: 30px;
  flex-wrap: wrap; /* 공간 부족 시 줄바꿈 */
  align-items: center;
  position: relative; z-index: 50; /* 영화 카드보다 위로 */
}

.input-group { position: relative; flex: 1; min-width: 200px; }
.input-group i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #888; }
.input-group input {
  width: 100%; padding: 12px 12px 12px 40px; background: #333; border: 1px solid #555;
  border-radius: 4px; color: white; font-size: 1rem; box-sizing: border-box;
}

select {
  padding: 12px 20px; background: #333; color: white; border: 1px solid #555;
  border-radius: 4px; cursor: pointer; min-width: 120px; height: 100%;
}

.reset-btn {
  background: #e50914; color: white; border: none; padding: 12px 20px;
  border-radius: 4px; cursor: pointer; font-weight: bold; white-space: nowrap; height: 100%;
}
.reset-btn:hover { background: #f40612; }

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  position: relative; z-index: 1;
}

.no-result, .loading-msg { text-align: center; margin-top: 50px; color: #888; font-size: 1.2rem; }

@media (max-width: 768px) {
  .grid-container { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .input-group { min-width: 100%; }
}
</style>