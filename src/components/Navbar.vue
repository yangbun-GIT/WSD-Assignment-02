<template>
  <nav class="navbar" :class="{ 'black-nav': isScrolled, 'hover-nav': isHovered }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div class="left-section">
      <i class="fas fa-bars mobile-menu-btn" @click="toggleMobileMenu"></i>

      <a class="logo-link" @click.prevent="handleLogoClick">
        <img src="../assets/yjy.png" alt="YJY PROJECT" class="logo-img" />
      </a>

      <div class="links">
        <router-link to="/">홈</router-link>
        <router-link to="/popular">인기 콘텐츠</router-link>
        <router-link to="/wishlist">내가 찜한 리스트</router-link>
        <router-link to="/search">찾아보기</router-link>
      </div>
    </div>

    <div class="right-section">
      <div ref="searchContainer" class="search-box" :class="{ active: showSearch, 'light-theme-box': theme === 'light' }">
        <i class="fas fa-search icon" @click="toggleSearch"></i>
        <input v-if="showSearch" ref="searchInput" v-model="searchQuery" @keyup.enter="goToSearch" placeholder="제목, 사람, 장르" />
      </div>

      <i class="fas icon theme-btn" :class="theme === 'dark' ? 'fa-sun' : 'fa-moon'" @click="store.toggleTheme" title="테마 변경"></i>

      <select v-model="language" @change="changeLang" class="nav-lang-selector" :class="{ 'light-theme-select': theme === 'light' }" title="언어 변경">
        <option value="ko-KR">KR</option>
        <option value="en-US">EN</option>
      </select>

      <i class="fas fa-cog icon setting-btn" @click="showSettings = true" title="설정"></i>

      <div class="profile-menu">
        <div class="profile-icon">
          <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="User" />
        </div>
        <i class="fas fa-caret-down dropdown-arrow"></i>
        <div class="dropdown">
          <div class="dropdown-content">
            <span>{{ email || 'Guest' }}님</span>
            <hr>
            <router-link to="/wishlist" class="drop-link">찜한 리스트</router-link>
            <button @click="handleLogout">로그아웃</button>
          </div>
        </div>
      </div>
    </div>

    <SettingsModal v-if="showSettings" @close="showSettings = false" />

    <transition name="slide-fade">
      <div v-if="showMobileMenu" class="mobile-menu-overlay" @click.self="showMobileMenu = false">
        <div class="mobile-menu-content" :class="{ 'light-mobile': theme === 'light' }">
          <div class="mobile-header">
            <span class="mobile-user">{{ email || 'Guest' }}님</span>
            <i class="fas fa-times close-menu" @click="showMobileMenu = false"></i>
          </div>
          <div class="mobile-links">
            <router-link to="/" @click="showMobileMenu = false">홈</router-link>
            <router-link to="/popular" @click="showMobileMenu = false">인기 콘텐츠</router-link>
            <router-link to="/wishlist" @click="showMobileMenu = false">내가 찜한 리스트</router-link>
            <router-link to="/search" @click="showMobileMenu = false">찾아보기</router-link>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMovieStore } from '../stores/movieStore'
import { storeToRefs } from 'pinia'
import SettingsModal from './SettingsModal.vue'

const store = useMovieStore()
const { email, theme, language } = storeToRefs(store)

const isScrolled = ref(false)
const isHovered = ref(false)
const showSearch = ref(false)
const showSettings = ref(false)
const showMobileMenu = ref(false) // [NEW] 모바일 메뉴 상태
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const searchContainer = ref<HTMLElement | null>(null)
const router = useRouter()
const route = useRoute()

const handleScroll = () => isScrolled.value = window.scrollY > 50
const handleClickOutside = (event: MouseEvent) => { if (showSearch.value && searchContainer.value && !searchContainer.value.contains(event.target as Node)) { showSearch.value = false } }
const handleLogout = () => { store.logout(); router.push('/signin') }
const handleLogoClick = () => { if (route.path === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); else router.push('/') }
const changeLang = () => { store.setLanguage(language.value) }
const toggleSearch = () => { showSearch.value = !showSearch.value; if (showSearch.value) nextTick(() => searchInput.value?.focus()) }
const goToSearch = () => { if (searchQuery.value.trim()) router.push({ path: '/search', query: { q: searchQuery.value } }) }
const toggleMobileMenu = () => { showMobileMenu.value = !showMobileMenu.value } // [NEW] 토글 함수

onMounted(() => { window.addEventListener('scroll', handleScroll); window.addEventListener('click', handleClickOutside) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('click', handleClickOutside) })
</script>

<style scoped>
/* 기존 스타일 */
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 0 4%; position: fixed; top: 0; width: 100%; z-index: 1000; height: 70px; box-sizing: border-box; transition: background-color 0.4s ease; background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%); }
.navbar.black-nav { background-color: #141414; }
.navbar.hover-nav { background-color: rgba(0,0,0,0.9); }
.left-section { display: flex; align-items: center; gap: 40px; }
.logo-link { display: flex; align-items: center; cursor: pointer; margin-right: 20px; }
.logo-img { height: 60px; width: auto; object-fit: contain; display: block; }
.links { display: flex; gap: 20px; }
.links a { color: #e5e5e5; text-decoration: none; font-size: 0.9rem; transition: 0.3s; position: relative; padding-bottom: 5px; }
.links a::after { content: ''; position: absolute; width: 0; height: 2px; bottom: 0; left: 0; background-color: #e50914; transition: width 0.3s ease-in-out; }
.links a:hover::after, .links a.router-link-active::after { width: 100%; }
.links a:hover, .links a.router-link-active { color: #fff; font-weight: bold; }
.right-section { display: flex; align-items: center; gap: 20px; color: white; }
.icon { font-size: 1.2rem; cursor: pointer; }
.theme-btn { margin-right: 5px; font-size: 1.2rem; transition: transform 0.3s; }
.theme-btn:hover { color: #e50914; transform: rotate(20deg); }
.setting-btn { margin-right: 5px; transition: transform 0.3s; }
.setting-btn:hover { color: #e50914; transform: rotate(90deg); }

.nav-lang-selector { background: transparent; color: #fff; border: 1px solid #fff; border-radius: 4px; padding: 4px 8px; font-size: 0.8rem; cursor: pointer; margin-right: 10px; outline: none; }
.nav-lang-selector option { background: #333; color: #fff; }

.search-box { display: flex; align-items: center; gap: 10px; padding: 5px; border: 1px solid transparent; }
.search-box.active { border: 1px solid #fff; background: rgba(0,0,0,0.8); padding: 5px 10px; }
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

/* 라이트 모드 가시성 패치 */
.search-box.active.light-theme-box { background: #ffffff !important; border: 1px solid #ccc !important; }
.search-box.light-theme-box input { color: #333333 !important; }
.search-box.light-theme-box .icon { color: #333333 !important; }
.nav-lang-selector.light-theme-select { color: #333333 !important; border-color: #ccc !important; background-color: #ffffff !important; }
.nav-lang-selector.light-theme-select option { background-color: #ffffff !important; color: #333333 !important; }
:global(body.light-mode) .dropdown-content { background-color: #ffffff; border-color: #ddd; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
:global(body.light-mode) .dropdown span { color: #666; }
:global(body.light-mode) .dropdown hr { border-color: #eee; }
:global(body.light-mode) .drop-link, :global(body.light-mode) .dropdown button { color: #333; }

/* [NEW] 모바일 메뉴 스타일 (반응형 핵심) */
.mobile-menu-btn { display: none; font-size: 1.5rem; color: white; cursor: pointer; margin-right: 15px; }
:global(body.light-mode) .mobile-menu-btn { color: #333; }

.mobile-menu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0,0,0,0.5); z-index: 2000; }
.mobile-menu-content { width: 70%; max-width: 300px; height: 100%; background: #141414; padding: 20px; display: flex; flex-direction: column; gap: 20px; box-shadow: 2px 0 10px rgba(0,0,0,0.5); }
/* 모바일 메뉴 라이트 모드 지원 */
.mobile-menu-content.light-mobile { background: #fff; color: #333; }

.mobile-header { display: flex; justify-content: space-between; align-items: center; font-size: 1.1rem; font-weight: bold; padding-bottom: 20px; border-bottom: 1px solid #333; }
.mobile-menu-content.light-mobile .mobile-header { border-bottom-color: #eee; }

.mobile-links { display: flex; flex-direction: column; gap: 20px; }
.mobile-links a { color: #ccc; font-size: 1rem; text-decoration: none; font-weight: bold; }
.mobile-menu-content.light-mobile .mobile-links a { color: #333; }

.mobile-links a.router-link-active { color: #e50914; }
.close-menu { cursor: pointer; font-size: 1.5rem; }

/* [중요] 반응형 미디어 쿼리 */
@media (max-width: 768px) {
  .links { display: none; } /* 기존 PC 메뉴 숨김 */
  .mobile-menu-btn { display: block; } /* 햄버거 버튼 표시 */
  .left-section { gap: 10px; }
  .logo-img { height: 40px; }
}

.slide-fade-enter-active, .slide-fade-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(-100%); opacity: 0; }
</style>