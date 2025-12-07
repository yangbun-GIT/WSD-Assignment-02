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
            <span class="date">{{ movie.release_date?.split('-')[0] }}</span>
          </div>
        </div>
      </div>

      <div class="modal-body">
        <p class="overview">{{ movie.overview || '상세 설명이 없습니다.' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ movie: any }>()
defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.8); z-index: 2000;
  display: flex; justify-content: center; align-items: center;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: #141414; width: 90%; max-width: 800px; max-height: 90vh;
  border-radius: 8px; overflow: hidden; position: relative;
  overflow-y: auto; box-shadow: 0 0 20px rgba(0,0,0,0.5);
  animation: slideUp 0.3s;
}

.close-btn {
  position: absolute; top: 15px; right: 15px; z-index: 10;
  background: rgba(0,0,0,0.5); border: none; color: white; border-radius: 50%;
  width: 36px; height: 36px; cursor: pointer; font-size: 1.2rem;
}

.modal-header {
  height: 400px; background-size: cover; background-position: center; position: relative;
}

.modal-gradient {
  position: absolute; bottom: 0; width: 100%; height: 100%;
  background: linear-gradient(to top, #141414, transparent);
}

.modal-title {
  position: absolute; bottom: 20px; left: 30px; width: 90%;
}
.modal-title h1 { font-size: 3rem; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }

.modal-meta { display: flex; gap: 15px; font-size: 1.1rem; font-weight: bold; }
.rating { color: #46d369; }

.modal-body { padding: 30px; font-size: 1.1rem; line-height: 1.6; color: #ddd; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(50px); } to { transform: translateY(0); } }

@media (max-width: 768px) {
  .modal-header { height: 250px; }
  .modal-title h1 { font-size: 1.8rem; }
}
</style>