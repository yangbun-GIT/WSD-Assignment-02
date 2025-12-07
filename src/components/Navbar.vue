<template>
  <nav class="navbar" :class="{ 'black-nav': isScrolled }">
    <div class="logo">
      <router-link to="/">NETFLIX</router-link>
    </div>

    <div class="links">
      <router-link to="/">홈</router-link>
      <router-link to="/popular">대세 콘텐츠</router-link>
      <router-link to="/wishlist">내가 찜한 리스트</router-link>
      <router-link to="/search">찾아보기</router-link>
    </div>

    <div class="user-info">
      <span>{{ email }}님</span>
      <button @click="logout">로그아웃</button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const isScrolled = ref(false) // 스크롤 상태 감지 변수
const router = useRouter()

// 스크롤 이벤트 핸들러
const handleScroll = () => {
  // 스크롤이 50px 이상 내려가면 배경색 변경
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  email.value = localStorage.getItem('UserId') || 'Guest'
  window.addEventListener('scroll', handleScroll) // 리스너 등록
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll) // 리스너 제거 (메모리 관리)
})

const logout = () => {
  localStorage.removeItem('TMDb-Key')
  router.push('/signin')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
  /* [핵심 애니메이션] 배경색 변경을 0.5초 동안 부드럽게 수행 */
  transition: background-color 0.5s ease;
  background: transparent; /* 기본은 투명 */
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0)); /* 상단 그림자 */
}

/* 스크롤 시 적용될 클래스 */
.navbar.black-nav {
  background-color: #141414; /* 넷플릭스 검정색 */
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.logo a {
  color: #e50914;
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
}

.links { display: flex; gap: 20px; }
.links a { color: #e5e5e5; text-decoration: none; font-size: 0.95rem; transition: color 0.3s; }
.links a:hover, .links a.router-link-active { color: #fff; font-weight: bold; }

.user-info { display: flex; align-items: center; gap: 15px; color: white; font-size: 0.9rem; }
.user-info button {
  background: #e50914; color: white; border: none; padding: 6px 12px;
  border-radius: 4px; cursor: pointer; font-weight: bold; transition: transform 0.2s;
}
.user-info button:hover { transform: scale(1.05); }

@media (max-width: 768px) {
  .navbar { flex-direction: column; gap: 10px; padding: 10px; background-color: #141414; }
  .links { gap: 15px; font-size: 0.8rem; }
}
</style>