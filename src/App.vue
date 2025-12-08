<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMovieStore } from './stores/movieStore'

const store = useMovieStore()
const router = useRouter()

onMounted(() => {
  store.initializeStore()

  // [NEW] 마지막 접속 페이지 복구 (단, 로그인은 되어 있어야 함)
  if (store.apiKey && store.lastPath && store.lastPath !== '/' && store.lastPath !== '/signin') {
    router.push(store.lastPath)
  }
})

// [NEW] 페이지 이동 시마다 경로 저장
router.afterEach((to) => {
  if (to.path !== '/signin') {
    store.saveLastPath(to.path)
  }
})
</script>

<style>
body { margin: 0; padding: 0; background-color: #141414; color: white; }
#app { width: 100%; min-height: 100vh; }
</style>