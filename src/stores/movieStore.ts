import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMovieStore = defineStore('movie', () => {
    // --- State ---
    const wishlist = ref<any[]>([])
    const email = ref('')
    const apiKey = ref('')
    // [추가] 최근 검색어 & 언어 설정
    const searchHistory = ref<string[]>([])
    const language = ref('ko-KR')

    // --- Actions ---
    const initializeStore = () => {
        // 기존 데이터 복구
        const savedWishlist = localStorage.getItem('my-wishlist')
        if (savedWishlist) {
            try { wishlist.value = JSON.parse(savedWishlist) } catch (e) { wishlist.value = [] }
        }
        email.value = localStorage.getItem('UserId') || ''
        apiKey.value = localStorage.getItem('TMDb-Key') || ''

        // [추가] 검색 기록 복구
        const savedHistory = localStorage.getItem('search-history')
        if (savedHistory) {
            try { searchHistory.value = JSON.parse(savedHistory) } catch (e) { searchHistory.value = [] }
        }

        // [추가] 언어 설정 복구
        const savedLang = localStorage.getItem('app-lang')
        if (savedLang) language.value = savedLang
    }

    const login = (userEmail: string, key: string) => {
        email.value = userEmail
        apiKey.value = key
        localStorage.setItem('UserId', userEmail)
        localStorage.setItem('TMDb-Key', key)
    }

    const logout = () => {
        email.value = ''
        apiKey.value = ''
        localStorage.removeItem('UserId')
        localStorage.removeItem('TMDb-Key')
    }

    const toggleLike = (movie: any) => {
        const index = wishlist.value.findIndex((m) => m.id === movie.id)
        if (index !== -1) wishlist.value.splice(index, 1)
        else wishlist.value.push(movie)
        localStorage.setItem('my-wishlist', JSON.stringify(wishlist.value))
    }

    const isLiked = (movieId: number) => wishlist.value.some((m) => m.id === movieId)

    // [추가] 검색어 저장 (최신순 10개 유지)
    const addSearchHistory = (keyword: string) => {
        if (!keyword.trim()) return
        searchHistory.value = searchHistory.value.filter(k => k !== keyword)
        searchHistory.value.unshift(keyword)
        if (searchHistory.value.length > 10) searchHistory.value.pop()
        localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
    }

    // [추가] 검색어 개별 삭제
    const removeSearchHistory = (keyword: string) => {
        searchHistory.value = searchHistory.value.filter(k => k !== keyword)
        localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
    }

    // [추가] 언어 변경
    const setLanguage = (lang: string) => {
        language.value = lang
        localStorage.setItem('app-lang', lang)
        window.location.reload()
    }

    return {
        wishlist, email, apiKey, searchHistory, language,
        initializeStore, login, logout, toggleLike, isLiked,
        addSearchHistory, removeSearchHistory, setLanguage
    }
})