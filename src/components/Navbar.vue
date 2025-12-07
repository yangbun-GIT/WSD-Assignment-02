<template>
  <nav class="navbar" :class="{ 'black-nav': isScrolled }">
    <div class="left-section">
      <div class="logo">
        <router-link to="/">NETFLIX</router-link>
      </div>

      <div class="links">
        <router-link to="/">홈</router-link>
        <router-link to="/popular">대세 콘텐츠</router-link>
        <router-link to="/wishlist">내가 찜한 리스트</router-link>
        <router-link to="/search">찾아보기</router-link>
      </div>
    </div>

    <div class="right-section">
      <i class="fas fa-search icon"></i>
      <i class="fas fa-bell icon"></i>

      <div class="profile-menu">
        <div class="profile-icon">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="User" />
        </div>
        <i class="fas fa-caret-down dropdown-arrow"></i>

        <div class="dropdown">
          <span>{{ email }}님</span>
          <hr>
          <button @click="logout">로그아웃</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const isScrolled = ref(false)
const router = useRouter()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  email.value = localStorage.getItem('UserId') || 'Guest'
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const logout = () => {
  localStorage.removeItem('TMDb-Key')
  router.push('/signin')
}
</script>

<style scoped>
.navbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 4%; position: sticky; top: 0; z-index: 100; height: 70px;
  transition: background-color 0.5s ease;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, rgba(0,0,0,0));
}
.navbar.black-nav { background-color: #141414; }

.left-section { display: flex; align-items: center; gap: 40px; }
.logo a { color: #e50914; font-size: 1.8rem; font-weight: bold; text-decoration: none; }
.links { display: flex; gap: 20px; }
.links a { color: #e5e5e5; text-decoration: none; font-size: 0.9rem; transition: 0.3s; }
.links a:hover, .links a.router-link-active { color: #fff; font-weight: bold; }

.right-section { display: flex; align-items: center; gap: 20px; color: white; }
.icon { font-size: 1.2rem; cursor: pointer; }

/* 프로필 아이콘 및 드롭다운 */
.profile-menu { position: relative; display: flex; align-items: center; gap: 5px; cursor: pointer; }
.profile-icon img { width: 32px; height: 32px; border-radius: 4px; }
.dropdown-arrow { font-size: 0.8rem; transition: transform 0.2s; }
.profile-menu:hover .dropdown-arrow { transform: rotate(180deg); }

/* 드롭다운 박스 */
.dropdown {
  position: absolute; top: 40px; right: 0; background-color: rgba(0,0,0,0.9);
  border: 1px solid #333; width: 150px; padding: 10px; display: none; flex-direction: column; gap: 10px;
}
.profile-menu:hover .dropdown { display: flex; }
.dropdown span { font-size: 0.8rem; color: #ccc; }
.dropdown hr { border: 0.5px solid #333; width: 100%; }
.dropdown button { background: none; border: none; color: white; cursor: pointer; text-align: left; }
.dropdown button:hover { text-decoration: underline; }

/* 모바일 대응 */
@media (max-width: 768px) {
  .links { display: none; } /* 모바일에서는 메뉴 숨김 (간소화) */
}
</style>