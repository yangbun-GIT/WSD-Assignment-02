<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')"><i class="fas fa-times"></i></button>

      <div class="modal-header" :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})` }">
        <div class="modal-gradient"></div>
        <div class="modal-title">
          <h1>{{ movie.title }}</h1>
          <div class="modal-meta">
            <span class="rating">⭐ {{ movie.vote_average?.toFixed(1) }}</span>
            <span class="date">{{ movie.release_date }}</span>
          </div>
        </div>
      </div>

      <div class="modal-body">
        <div class="genres" v-if="details && details.genres">
          <span v-for="g in details.genres" :key="g.id" class="genre-tag">{{ g.name }}</span>
        </div>

        <p class="overview">{{ movie.overview || '상세 설명이 없습니다.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import tmdb from '../api/tmdb'

const props = defineProps<{ movie: any }>()
defineEmits(['close'])

const details = ref<any>(null)

// [기능] 상세 정보(장르 포함) 가져오기
onMounted(async () => {
  try {
    const res = await tmdb.get(`/movie/${props.movie.id}`)
    details.value = res.data
  } catch (e) {
    console.error('상세 정보 로드 실패')
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); z-index: 2000;
  display: flex; justify-content: center; align-items: center; animation: fadeIn 0.3s;
}
.modal-content {
  background: #141414; width: 90%; max-width: 800px; max-height: 90vh;
  border-radius: 8px; overflow: hidden; position: relative; overflow-y: auto;
  box-shadow: 0 0 20px rgba(0,0,0,0.5); animation: slideUp 0.3s;
}
.close-btn {
  position: absolute; top: 15px; right: 15px; z-index: 10;
  background: rgba(0,0,0,0.5); border: none; color: white; border-radius: 50%;
  width: 36px; height: 36px; cursor: pointer; font-size: 1.2rem;
}
.modal-header { height: 400px; background-size: cover; background-position: center; position: relative; }
.modal-gradient { position: absolute; bottom: 0; width: 100%; height: 100%; background: linear-gradient(to top, #141414, transparent); }
.modal-title { position: absolute; bottom: 20px; left: 30px; width: 90%; }
.modal-title h1 { font-size: 3rem; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
.modal-meta { display: flex; gap: 15px; font-size: 1.1rem; font-weight: bold; align-items: center; }
.rating { color: #46d369; }

.modal-body { padding: 30px; font-size: 1.1rem; line-height: 1.6; color: #ddd; }

/* 장르 태그 스타일 */
.genres { margin-bottom: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
.genre-tag {
  background: #333; padding: 5px 10px; border-radius: 4px; font-size: 0.9rem; color: #fff; border: 1px solid #555;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(50px); } to { transform: translateY(0); } }
@media (max-width: 768px) { .modal-header { height: 250px; } .modal-title h1 { font-size: 1.8rem; } }
</style>