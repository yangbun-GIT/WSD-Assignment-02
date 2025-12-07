<template>
  <div class="movie-card" :class="{ 'liked-border': isLiked }" @click="toggleLike">
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

    <transition name="pop">
      <div v-if="isLiked" class="heart-icon">
        <i class="fas fa-heart"></i>
      </div>
    </transition>
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
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  /* [핵심 애니메이션] 크기 변형을 0.3초 동안 부드럽게 */
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s;
}

/* 호버 시 확대 및 그림자 효과 */
.movie-card:hover {
  transform: scale(1.05) translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.7);
  z-index: 10;
}

/* 찜한 영화 테두리 */
.liked-border { border: 2px solid #e50914; }

.poster { width: 100%; height: 100%; object-fit: cover; display: block; }
.no-poster { width: 100%; height: 300px; background: #333; display: flex; align-items: center; justify-content: center; color: #888; }

.overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, black, transparent);
  padding: 20px 10px 10px;
  opacity: 0;
  transition: opacity 0.3s;
}
.movie-card:hover .overlay { opacity: 1; }
.title { font-size: 0.9rem; text-align: center; color: white; margin: 0; }

.heart-icon {
  position: absolute; top: 10px; right: 10px; color: #e50914; font-size: 1.5rem;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8));
}

/* Vue Transition CSS: 하트 팝업 효과 */
.pop-enter-active { animation: pop-in 0.3s; }
.pop-leave-active { animation: pop-in 0.3s reverse; }
@keyframes pop-in {
  0% { transform: scale(0); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}
</style>