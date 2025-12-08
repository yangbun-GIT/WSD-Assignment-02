<template>
  <div class="movie-card" :class="{ 'liked-border': isLiked }" @click="$emit('click', movie)">
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

// [수정] 부모에게 알릴 이벤트 정의
const emit = defineEmits(['click', 'toggle-like'])

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
  // [추가] 찜 상태가 변경되었음을 부모에게 알림 (찜 목록 페이지에서 즉시 삭제하기 위해)
  emit('toggle-like', props.movie.id, isLiked.value)
}

onMounted(() => checkLike())
</script>

<style scoped>
.movie-card {
  position: relative; cursor: pointer; border-radius: 6px; overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s;
}
.movie-card:hover { transform: scale(1.05) translateY(-5px); z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.7); }
.liked-border { border: 2px solid #e50914; }

.poster { width: 100%; height: 100%; object-fit: cover; display: block; }
.no-poster { width: 100%; height: 300px; background: #333; display: flex; align-items: center; justify-content: center; color: #888; }

.overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, black, transparent);
  padding: 20px 10px 10px; opacity: 0; transition: opacity 0.3s;
}
.movie-card:hover .overlay { opacity: 1; }
.title { font-size: 0.9rem; text-align: center; color: white; margin: 0; }

.heart-btn {
  position: absolute; top: 10px; right: 10px;
  color: white; font-size: 1.5rem; cursor: pointer;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.8));
  transition: transform 0.2s; z-index: 15;
}
.heart-btn:hover { transform: scale(1.2); }
.heart-btn i.fas { color: #e50914; }
</style>