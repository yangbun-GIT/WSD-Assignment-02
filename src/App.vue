<template>
  <router-view v-slot="{ Component }">
    <transition name="page-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <Footer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from './stores/movieStore'
import Footer from './components/Footer.vue' // [추가] 임포트

const store = useMovieStore()
const router = useRouter()

onMounted(() => {
  store.initializeStore()

  if (store.apiKey && store.lastPath && store.lastPath !== '/' && store.lastPath !== '/signin') {
    router.push(store.lastPath)
  }
})

router.afterEach((to) => {
  if (to.path !== '/signin') {
    store.saveLastPath(to.path)
  }
})
</script>

<style>
body { margin: 0; padding: 0; background-color: #141414; color: white; }

/* [수정] Footer를 하단에 고정하기 위한 Flex 설정 */
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}
</style>