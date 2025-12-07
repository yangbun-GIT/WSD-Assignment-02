<template>
  <div class="skeleton-card">
    <div class="poster-area"></div>
    <div class="text-area"></div>
  </div>
</template>

<style scoped>
.skeleton-card {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  background-color: #2f2f2f;
  /* 카드 전체에 은은한 펄스 효과 */
  animation: pulse 2s infinite ease-in-out;
}

.poster-area {
  width: 100%;
  padding-top: 150%; /* 영화 포스터 비율 (2:3) 유지 */
  /* 반짝이는 쉬머(Shimmer) 애니메이션 */
  background: linear-gradient(to right, #2f2f2f 8%, #3a3a3a 18%, #2f2f2f 33%);
  background-size: 800px 104px;
  animation: shimmer 1.5s infinite linear;
}

.text-area {
  height: 20px;
  margin: 10px;
  background-color: #3a3a3a;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}
</style>