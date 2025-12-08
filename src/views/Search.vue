<template>
  <div class="search-container">
    <Navbar />
    <div class="content">
      <h2>콘텐츠 찾아보기</h2>

      <div class="search-controls">

        <div class="search-bar">
          <button class="search-btn" @click="executeSearch" title="검색">
            <i class="fas fa-search"></i>
          </button>
          <input
              v-model="keyword"
              @keyup.enter="executeSearch"
              placeholder="제목으로 검색..."
              type="text"
          />
        </div>

        <div class="filters">

          <select v-model="selectedGenre" @change="executeSearch">
            <option value="">모든 장르</option>
            <option v-for="genre in genres" :key="genre.id" :value="genre.id">{{ genre.name }}</option>
          </select>

          <select v-model="selectedRating" @change="executeSearch">
            <option value="">모든 평점</option>
            <option value="9">⭐ 9점 이상</option>
            <option value="7">⭐ 7점 이상</option>
            <option value="5">⭐ 5점 이상</option>
          </select>

          <select v-model="selectedFilterLang" @change="executeSearch">
            <option value="">모든 언어(원어)</option>
            <option value="ko">한국어 영화</option>
            <option value="en">영어 영화</option>
            <option value="ja">일본어 영화</option>
          </select>

          <button @click="resetFilters" class="reset-btn"><i class="fas fa-undo"></i> 초기화</button>
        </div>
      </div>

      <div v-if="searchHistory.length > 0 && !keyword" class="history-section">
        <h3>최근 검색어</h3>
        <div class="history-tags">
          <span v-for="tag in searchHistory" :key="tag" class="tag" @click="clickTag(tag)">
            {{ tag }}
            <i class="fas fa-times delete-btn" @click.stop="deleteTag(tag)"></i>
          </span>
        </div>
      </div>

      <div v-if="isLoading" class="loading-msg">
        <i class="fas fa-spinner fa-spin"></i> 검색 중...
      </div>
      <div v-else-if="movies.length === 0" class="no-result">검색 결과가 없습니다.</div>
      <div v-else class="grid-container">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" @click="openModal(movie)" />
      </div>
    </div>
    <MovieModal v-if="showModal" :movie="selectedMovie" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import tmdb from '../api/tmdb'
import { useMovieStore } from '../stores/movieStore'
import { storeToRefs } from 'pinia'
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'
import MovieModal from '../components/MovieModal.vue'

const store = useMovieStore()
const { searchHistory, language } = storeToRefs(store)

const movies = ref<any[]>([])
const genres = ref<any[]>([])
const keyword = ref('')

const selectedGenre = ref('')
const selectedRating = ref('')
const selectedFilterLang = ref('')
const currentLang = ref(language.value)

const isLoading = ref(false)
const route = useRoute()
const showModal = ref(false)
const selectedMovie = ref<any>(null)

const openModal = (movie: any) => { selectedMovie.value = movie; showModal.value = true }

const executeSearch = () => {
  if (keyword.value.trim()) {
    store.addSearchHistory(keyword.value)
  }
  handleSearch()
}

const clickTag = (tag: string) => {
  keyword.value = tag
  handleSearch()
}

const deleteTag = (tag: string) => {
  store.removeSearchHistory(tag)
}

const changeLang = () => {
  store.setLanguage(currentLang.value)
}

const fetchGenres = async () => { try { const res = await tmdb.get('/genre/movie/list'); genres.value = res.data.genres } catch (e) {} }

const handleSearch = async () => {
  isLoading.value = true
  try {
    let endpoint = '/discover/movie'
    const params: any = { page: 1, sort_by: 'popularity.desc' }

    if (keyword.value.trim()) {
      endpoint = '/search/movie'
      params.query = keyword.value
    } else {
      if (selectedGenre.value) params.with_genres = selectedGenre.value
      if (selectedRating.value) params['vote_average.gte'] = selectedRating.value
      if (selectedFilterLang.value) params.with_original_language = selectedFilterLang.value
    }

    const res = await tmdb.get(endpoint, { params })
    movies.value = res.data.results
  } catch (error) { console.error(error) } finally { isLoading.value = false }
}

const resetFilters = () => {
  keyword.value = ''
  selectedGenre.value = ''
  selectedRating.value = ''
  selectedFilterLang.value = ''
  handleSearch()
}

watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    keyword.value = newQuery as string
    store.addSearchHistory(keyword.value)
    handleSearch()
  }
})

onMounted(async () => {
  await fetchGenres()
  if (route.query.q) {
    keyword.value = route.query.q as string
    store.addSearchHistory(keyword.value)
    handleSearch()
  } else {
    handleSearch()
  }
})
</script>

<style scoped>
.search-container { min-height: 100vh; color: white; }
.content { padding: 100px 4% 40px; }
h2 { margin-bottom: 20px; font-weight: bold; }

/* [핵심 수정] 컨트롤러를 가로로 배치 */
.search-controls {
  display: flex;
  flex-wrap: wrap; /* 화면 좁으면 자동 줄바꿈 */
  gap: 15px;
  margin-bottom: 30px;
  align-items: center; /* 수직 중앙 정렬 */
}

/* 검색바 스타일 */
.search-bar {
  display: flex;
  align-items: center;
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  overflow: hidden;
  width: 300px; /* 고정 너비로 변경하여 필터와 어울리게 함 */
  flex-shrink: 0; /* 줄어들지 않도록 고정 */
}

.search-bar:focus-within { border-color: #e50914; }

.search-btn {
  background: transparent; border: none; color: #888;
  padding: 10px 15px; cursor: pointer; font-size: 1.1rem;
  transition: color 0.3s;
}
.search-btn:hover { color: #e50914; }

.search-bar input {
  flex: 1; background: transparent; border: none; color: white;
  font-size: 1rem; padding: 10px; outline: none;
}

/* 필터 그룹 (셀렉트 박스들) - 가로 정렬 */
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap; /* 모바일 대응 */
  align-items: center;
}

select {
  padding: 10px 15px;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  cursor: pointer;
  min-width: 120px;
  height: 42px;
}
select:focus { border-color: #e50914; outline: none; }
.lang-setting { border-color: #888; color: #ccc; }

.reset-btn {
  background: #e50914; color: white; border: none;
  padding: 0 20px; border-radius: 4px;
  cursor: pointer; font-weight: bold;
  white-space: nowrap; height: 42px;
  transition: background 0.3s;
}
.reset-btn:hover { background: #f40612; }

/* ... 나머지 스타일 유지 ... */
.history-section { margin-bottom: 30px; }
.history-section h3 { font-size: 1rem; color: #888; margin-bottom: 10px; }
.history-tags { display: flex; gap: 10px; flex-wrap: wrap; }
.tag { background: rgba(109, 109, 110, 0.4); padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: 0.2s; display: flex; align-items: center; gap: 8px; border: 1px solid transparent; }
.tag:hover { background: rgba(109, 109, 110, 0.7); border-color: #fff; }
.delete-btn { color: #888; font-size: 0.8rem; transition: color 0.2s; }
.delete-btn:hover { color: #e50914; }

.grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
.no-result, .loading-msg { text-align: center; margin-top: 50px; color: #888; font-size: 1.2rem; }
@media (max-width: 768px) {
  .grid-container { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); }
  .search-bar { width: 100%; } /* 모바일에서는 검색창 꽉 차게 */
}
</style>