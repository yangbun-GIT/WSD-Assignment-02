<template>
  <nav class="navbar">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const router = useRouter()

onMounted(() => {
  // 로그인 때 저장한 ID 가져오기 (없으면 Guest)
  email.value = localStorage.getItem('UserId') || 'Guest'
})

const logout = () => {
  // 로컬 스토리지 키 삭제 후 로그인 페이지로 이동
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
  /* 상단 고정 및 배경 그라데이션 */
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.5));
  backdrop-filter: blur(2px); /* 살짝 블러 효과 */
}

.logo a {
  color: #e50914; /* 넷플릭스 레드 */
  font-size: 1.8rem;
  font-weight: bold;
  text-decoration: none;
}

.links {
  display: flex;
  gap: 20px;
}

.links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s;
}

/* 마우스 올리거나 현재 활성화된 페이지일 때 하얀색으로 강조 */
.links a:hover, .links a.router-link-active {
  color: #fff;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-size: 0.9rem;
}

.user-info button {
  background: #e50914;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.user-info button:hover {
  background: #f40612;
}

/* 모바일 화면 대응 (선택 사항) */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 15px;
    gap: 15px;
  }
  .links {
    gap: 15px;
    font-size: 0.8rem;
  }
}
</style>