<template>
  <div
      class="movie-card"
      @click="$emit('click')"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
  >
    <div class="poster-wrapper">
      <img
          :src="posterUrl"
          :alt="movie.title || movie.name"
          class="movie-poster"
          loading="lazy"
      >
      <div class="poster-overlay" :class="{ 'show-overlay': isHovered }">
        <button class="like-btn" @click.stop="toggleLike">
          <i class="fas fa-heart" :class="{ 'liked': isLiked }"></i>
        </button>
        <div class="movie-info">
          <h3 class="movie-title">{{ movie.title || movie.name }}</h3>
          <div class="movie-meta">
            <span class="rating"><i class="fas fa-star"></i> {{ movie.vote_average?.toFixed(1) }}</span>
          </div>
          <div class="genres">
            <span v-for="(genre, index) in movieGenres.slice(0, 2)" :key="genre.id">
              {{ genre.name }}{{ index < movieGenres.slice(0, 2).length - 1 ? ' · ' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useMovieStore } from '../stores/movieStore'
import tmdb from '../api/tmdb'

const props = defineProps<{ movie: any }>()
defineEmits(['click'])

const store = useMovieStore()
const isHovered = ref(false)
const allGenres = ref<any[]>([])

const posterUrl = computed(() => {
  return props.movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${props.movie.poster_path}`
      : 'https://via.placeholder.com/342x513?text=No+Poster'
})

const isLiked = computed(() => store.wishlist.some(m => m.id === props.movie.id))
const toggleLike = () => store.toggleWishlist(props.movie)

const movieGenres = computed(() => {
  if (!props.movie.genre_ids || allGenres.value.length === 0) return []
  return allGenres.value.filter(g => props.movie.genre_ids.includes(g.id))
})

onMounted(async () => {
  try {
    const res = await tmdb.get('/genre/movie/list')
    allGenres.value = res.data.genres
  } catch (e) { console.error('Failed to fetch genres', e) }
})
</script>

<style scoped>
.movie-card {
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
  background-color: #2f2f2f;

  /* [데스크탑 안전] 모든 해상도에서 포스터 비율을 2:3으로 고정하여 찌그러짐 방지 */
  aspect-ratio: 2 / 3;
  width: 100%;
}

.poster-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.movie-poster {
  width: 100%;
  height: 100%;
  /* [데스크탑 안전] 비율 고정 시 빈 공간 없이 꽉 채우기 */
  object-fit: cover;
  display: block;
}

.poster-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
  opacity: 0; transition: opacity 0.3s ease;
  display: flex; flex-direction: column; justify-content: flex-end; padding: 15px;
}

@media (hover: hover) {
  .movie-card:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0,0,0,0.5), 0 6px 6px rgba(0,0,0,0.3);
    z-index: 10;
  }
  .show-overlay { opacity: 1; }
}

.like-btn {
  position: absolute; top: 10px; right: 10px;
  background: rgba(0,0,0,0.5); border: none; color: white;
  font-size: 1.2rem; cursor: pointer; padding: 8px; border-radius: 50%;
  transition: color 0.2s, background-color 0.2s, transform 0.2s;
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px;
}
.like-btn:hover { color: #e50914; background: rgba(255,255,255,0.2); transform: scale(1.1); }
.liked { color: #e50914; }

.movie-info { color: white; }
.movie-title { font-size: 1rem; font-weight: bold; margin: 0 0 5px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.movie-meta { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; margin-bottom: 5px; }
.rating { color: #46d369; font-weight: bold; }
.genres { font-size: 0.8rem; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 모바일 전용 스타일 */
@media (max-width: 768px) {
  .movie-card { border-radius: 4px; }
  .poster-overlay { padding: 10px; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%); }
  .like-btn { top: 5px; right: 5px; padding: 6px; font-size: 1rem; width: 30px; height: 30px; }
  .movie-title { font-size: 0.9rem; }
  .movie-meta { font-size: 0.8rem; }
  .genres { font-size: 0.75rem; }
  .movie-card:hover { transform: none; box-shadow: none; }
}
</style>