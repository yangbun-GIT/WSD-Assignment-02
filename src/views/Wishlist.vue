<template>
  <div class="page-container">
    <Navbar />

    <div class="content">
      <h2>내가 찜한 콘텐츠</h2>

      <div v-if="movies.length === 0" class="empty">
        <p>아직 찜한 콘텐츠가 없습니다.</p>
        <p class="sub-text">마음에 드는 영화를 찜해보세요!</p>
      </div>

      <div v-else class="grid">
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
import Navbar from '../components/Navbar.vue'
import MovieCard from '../components/MovieCard.vue'

const movies = ref([])

onMounted(() => {
  const savedData = localStorage.getItem('my-wishlist')
  if (savedData) {
    movies.value = JSON.parse(savedData)
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #141414;
}
/* [수정됨] 헤더 높이(70px)보다 넉넉하게 상단 패딩 부여 */
.content {
  padding: 100px 4% 40px;
  color: white;
}
h2 { margin-bottom: 20px; font-weight: bold; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}
.empty {
  text-align: center;
  margin-top: 150px;
  color: #666;
}
.sub-text { font-size: 0.9rem; margin-top: 10px; }
</style>