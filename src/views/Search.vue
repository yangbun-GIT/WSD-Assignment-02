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
import tmdb from '../api/tmdb'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'

// 상태 변수
const movies = ref<any[]>([])
const genres = ref<any[]>([]) // 장르 목록 저장
const keyword = ref('')
const selectedGenre = ref('')
const isLoading = ref(false)

// [1] 초기 장르 데이터 가져오기 (API)
const fetchGenres = async () => {
  try {
    const res = await tmdb.get('/genre/movie/list')
    genres.value = res.data.genres
  } catch (error) {
    console.error('장르 로딩 실패', error)
  }
}

// [2] 영화 검색/필터링 함수
const handleSearch = async () => {
  isLoading.value = true
  try {
    let endpoint = '/discover/movie' // 기본: 탐색 모드
    const params: any = { page: 1 }

    if (keyword.value.trim()) {
      // 검색어가 있으면 -> 검색 API 사용
      endpoint = '/search/movie'
      params.query = keyword.value
    } else {
      // 검색어가 없으면 -> 장르 필터링 사용
      if (selectedGenre.value) {
        params.with_genres = selectedGenre.value
      }
      // 추가 옵션: 인기도순 정렬 (과제 퀄리티 Up)
      params.sort_by = 'popularity.desc'
    }

    const res = await tmdb.get(endpoint, { params })
    movies.value = res.data.results
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// [3] 초기화 버튼
const resetFilters = () => {
  keyword.value = ''
  selectedGenre.value = ''
  handleSearch() // 전체 목록 다시 로드
}

// 화면 켜지면 장르 목록 + 기본 영화 목록 로드
onMounted(async () => {
  await fetchGenres()
  handleSearch()
})
</script>

<style scoped>
.search-container { min-height: 100vh; background-color: #141414; color: white; }
.content { padding: 20px 40px; }
h2 { margin-bottom: 20px; }

/* 검색 컨트롤 UI 스타일 */
.search-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap; /* 모바일 대응 */
}

.input-group {
  position: relative;
  flex: 1;
  min-width: 200px;
}
.input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}
.input-group input {
  width: 100%;
  padding: 12px 12px 12px 40px; /* 아이콘 공간 확보 */
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
}

select {
  padding: 10px 20px;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
}

.reset-btn {
  background: #e50914;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.reset-btn:hover { background: #f40612; }

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}
.no-result, .loading-msg {
  text-align: center; margin-top: 50px; color: #888; font-size: 1.2rem;
}
</style>