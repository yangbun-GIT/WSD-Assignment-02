<template>
  <div class="movie-card" @click="$emit('click', movie)">
    <img
        v-if="movie.poster_path"
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        :alt="movie.title"
        class="poster"
    />
    <div v-else class="no-poster">이미지 준비중</div>

    <div class="overlay">
      <p class="title">{{ movie.title }}</p>
    </div>

    <div class="heart-btn" @click.stop="toggleLike">
      <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  movie: { id: number; title: string; poster_path: string | null }
}>()

const isLiked = ref(false)

const checkLike = () => {
  const wishlist = JSON.parse(localStorage.getItem('my-wishlist') || '[]')
  isLiked.value = wishlist.some((item: any) => item.id === props.movie.id)
}

const toggleLike = () => {
  const wishlist = JSON.parse(localStorage.getItem('my-wishlist') || '[]')
  if (isLiked.value) {
    const nextList = wishlist.filter((item: any) => item.id !== props.movie.id)
    localStorage.setItem('my-wishlist', JSON.stringify(nextList))
    isLiked.value = false
  } else {
    wishlist.push(props.movie)
    localStorage.setItem('my-wishlist', JSON.stringify(wishlist))
    isLiked.value = true
  }
}

onMounted(() => checkLike())
</script>

<style scoped>
.movie-card {
  position: relative; cursor: pointer; border-radius: 6px; overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.movie-card:hover { transform: scale(1.05) translateY(-5px); z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.7); }

.poster { width: 100%; height: 100%; object-fit: cover; display: block; }
.no-poster { width: 100%; height: 300px; background: #333; display: flex; align-items: center; justify-content: center; color: #888; }

.overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, black, transparent);
  padding: 20px 10px 10px; opacity: 0; transition: opacity 0.3s;
}
.movie-card:hover .overlay { opacity: 1; }
.title { font-size: 0.9rem; text-align: center; color: white; margin: 0; }

/* [수정] 하트 버튼 스타일 */
.heart-btn {
  position: absolute; top: 10px; right: 10px;
  color: white; font-size: 1.5rem; cursor: pointer;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8));
  transition: transform 0.2s, color 0.2s;
  z-index: 15; /* 오버레이보다 위에 */
}
.heart-btn:hover { transform: scale(1.2); }
.heart-btn i.fas { color: #e50914; /* 꽉 찬 하트는 빨간색 */ }
</style>