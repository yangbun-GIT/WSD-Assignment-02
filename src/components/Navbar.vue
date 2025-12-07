<template>
  <nav
      class="navbar"
      :class="{ 'black-nav': isScrolled, 'hover-nav': isHovered }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
  >
    <div class="left-section">
      <a href="#" @click.prevent="goHome" class="logo">NETFLIX</a>

      <div class="links">
        <router-link to="/">홈</router-link>
        <router-link to="/popular">대세 콘텐츠</router-link>
        <router-link to="/wishlist">내가 찜한 리스트</router-link>
        <router-link to="/search">찾아보기</router-link>
      </div>
    </div>

    <div class="right-section">
      <div ref="searchContainer" class="search-box" :class="{ active: showSearch }">
        <i class="fas fa-search icon" @click="toggleSearch"></i>
        <input
            v-if="showSearch"
            ref="searchInput"
            v-model="searchQuery"
            @keyup.enter="goToSearch"
            placeholder="제목, 사람, 장르"
        />
      </div>

      <i class="fas fa-bell icon"></i>

      <div class="profile-menu">
        <div class="profile-icon">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="User" />
        </div>
        <i class="fas fa-caret-down dropdown-arrow"></i>

        <div class="dropdown">
          <div class="dropdown-content">
            <span>{{ email }}님</span>
            <hr>
            <router-link to="/wishlist" class="drop-link">찜한 리스트</router-link>
            <button @click="logout">로그아웃</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const isScrolled = ref(false)
const isHovered = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const searchContainer = ref<HTMLElement | null>(null)
const router = useRouter()

const handleScroll = () => isScrolled.value = window.scrollY > 50

// [기능] 외부 클릭 감지 (검색창 닫기)
const handleClickOutside = (event: MouseEvent) => {
  if (showSearch.value && searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    showSearch.value = false
  }
}

onMounted(() => {
  email.value = localStorage.getItem('UserId') || 'Guest'
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', handleClickOutside) // 전역 클릭 이벤트 등록
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleClickOutside)
})

const logout = () => {
  localStorage.removeItem('TMDb-Key')
  router.push('/signin')
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (showSearch.value) nextTick(() => searchInput.value?.focus())
}

const goToSearch = () => {
  if (searchQuery.value.trim()) router.push({ path: '/search', query: { q: searchQuery.value } })
}

const goHome = () => {
  router.push('/')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.navbar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 4%; position: fixed; top: 0; width: 100%; z-index: 1000; height: 70px;
  box-sizing: border-box; transition: background-color 0.4s ease;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
}
.navbar.black-nav { background-color: #141414; }
.navbar.hover-nav { background-color: rgba(0,0,0,0.9); }

.left-section { display: flex; align-items: center; gap: 40px; }
.logo { color: #e50914; font-size: 1.8rem; font-weight: bold; text-decoration: none; cursor: pointer; }
.links { display: flex; gap: 20px; }
.links a { color: #e5e5e5; text-decoration: none; font-size: 0.9rem; transition: 0.3s; }
.links a:hover, .links a.router-link-active { color: #fff; font-weight: bold; }

.right-section { display: flex; align-items: center; gap: 20px; color: white; }
.icon { font-size: 1.2rem; cursor: pointer; }

/* [디자인] 검색창 개선 */
.search-box {
  display: flex; align-items: center; gap: 10px;
  padding: 5px; transition: 0.3s;
  border: 1px solid transparent; /* 기본 테두리 투명 */
}
.search-box.active {
  border: 1px solid #fff;
  background: rgba(0,0,0,0.8); /* 배경 진하게 */
  padding: 5px 10px;
}
.search-box input { background: transparent; border: none; color: white; width: 200px; outline: none; }

.profile-menu { position: relative; display: flex; align-items: center; gap: 5px; cursor: pointer; padding: 10px 0; }
.profile-icon img { width: 32px; height: 32px; border-radius: 4px; }
.dropdown-arrow { font-size: 0.8rem; transition: transform 0.2s; }
.profile-menu:hover .dropdown-arrow { transform: rotate(180deg); }

.dropdown { position: absolute; top: 100%; right: 0; padding-top: 10px; display: none; }
.profile-menu:hover .dropdown { display: block; }
.dropdown-content { background-color: rgba(0,0,0,0.95); border: 1px solid #333; width: 150px; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
.dropdown span { font-size: 0.8rem; color: #ccc; }
.dropdown hr { border: 0.5px solid #333; width: 100%; margin: 0; }
.drop-link, .dropdown button { color: white; text-decoration: none; font-size: 0.9rem; background: none; border: none; text-align: left; cursor: pointer; padding: 0; }
.drop-link:hover, .dropdown button:hover { text-decoration: underline; }

@media (max-width: 768px) { .links { display: none; } }
</style>