<template>
  <div class="home">
    <Navbar />

    <div class="content">
      <h2>지금 뜨는 콘텐츠</h2>

      <div v-if="isLoading" class="grid-container">
        <SkeletonCard v-for="n in 10" :key="n" />
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
import SkeletonCard from '../components/SkeletonCard.vue' // [추가]

interface Movie {
  id: number
  title: string
  poster_path: string
}

const movies = ref<Movie[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    // [효과 확인용] 스켈레톤을 1.5초 동안 강제로 보여주기 위해 지연을 줌
    // (실제 배포 시에는 setTimeout을 제거해도 됩니다)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const response = await tmdb.get('/movie/popular')
    movies.value = response.data.results
  } catch (error) {
    console.error('영화 불러오기 실패:', error)
  } finally {
    isLoading.value = false // 로딩 끝 -> 실제 카드로 전환
  }
})
</script>

<style scoped>
.home {
  background-color: #141414;
  min-height: 100vh;
}

.content {
  padding: 80px 40px 40px; /* 헤더 공간만큼 상단 여백 추가 */
  color: white;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}

/* 반응형 그리드 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}
</style>