<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMovieStore } from './stores/movieStore'

const store = useMovieStore()

onMounted(() => {
  store.initializeStore()
})
</script>

<style>
body { margin: 0; padding: 0; background-color: #141414; color: white; }
#app { width: 100%; min-height: 100vh; }
</style>