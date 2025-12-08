import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SignIn from '../views/SignIn.vue'
import Wishlist from '../views/Wishlist.vue'
import Popular from '../views/Popular.vue'
import Search from '../views/Search.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/signin', name: 'SignIn', component: SignIn },
    { path: '/wishlist', name: 'Wishlist', component: Wishlist },
    { path: '/popular', name: 'Popular', component: Popular },
    { path: '/search', name: 'Search', component: Search }
]

const router = createRouter({
    // [핵심 수정] Vite 설정의 base 경로를 라우터에 전달 (로컬/배포 모두 정상 작동하게 함)
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach((to, _from, next) => {
    const apiKey = localStorage.getItem('TMDb-Key')
    if (to.name !== 'SignIn' && !apiKey) {
        next({ name: 'SignIn' })
    } else {
        next()
    }
})

export default router