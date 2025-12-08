import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMovieStore = defineStore('movie', () => {
    // 상태 (State)
    const wishlist = ref<any[]>([])
    const email = ref('')
    const apiKey = ref('')

    // 초기화 (새로고침 시 localStorage에서 복구)
    const initializeStore = () => {
        const savedWishlist = localStorage.getItem('my-wishlist')
        if (savedWishlist) {
            try { wishlist.value = JSON.parse(savedWishlist) } catch (e) { wishlist.value = [] }
        }
        email.value = localStorage.getItem('UserId') || ''
        apiKey.value = localStorage.getItem('TMDb-Key') || ''
    }

    // 로그인
    const login = (userEmail: string, key: string) => {
        email.value = userEmail
        apiKey.value = key
        localStorage.setItem('UserId', userEmail)
        localStorage.setItem('TMDb-Key', key)
    }

    // 로그아웃
    const logout = () => {
        email.value = ''
        apiKey.value = ''
        localStorage.removeItem('UserId')
        localStorage.removeItem('TMDb-Key')
    }

    // 찜하기 토글
    const toggleLike = (movie: any) => {
        const index = wishlist.value.findIndex((m) => m.id === movie.id)
        if (index !== -1) wishlist.value.splice(index, 1)
        else wishlist.value.push(movie)
        localStorage.setItem('my-wishlist', JSON.stringify(wishlist.value))
    }

    // 찜 여부 확인
    const isLiked = (movieId: number) => wishlist.value.some((m) => m.id === movieId)

    return { wishlist, email, apiKey, initializeStore, login, logout, toggleLike, isLiked }
})