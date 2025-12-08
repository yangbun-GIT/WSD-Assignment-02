import { defineStore } from 'pinia'
import { ref } from 'vue'
import tmdb from '../api/tmdb'

export const useMovieStore = defineStore('movie', () => {
    // --- State (8개의 Key 관리) ---
    const wishlist = ref<any[]>([])
    const email = ref('')
    const apiKey = ref('')
    const searchHistory = ref<string[]>([])
    const language = ref('ko-KR')

    // [NEW] 추가된 상태들
    const theme = ref('dark')       // 테마
    const watchHistory = ref<any[]>([]) // 시청 기록
    const genreCache = ref<any[]>([])   // 장르 캐시

    // --- Actions ---
    const initializeStore = () => {
        // 1. 기본 데이터 로드
        const load = (key: string) => {
            const data = localStorage.getItem(key)
            return data ? JSON.parse(data) : null
        }

        const savedWishlist = load('my-wishlist')
        if (savedWishlist) wishlist.value = savedWishlist

        email.value = localStorage.getItem('UserId') || ''
        apiKey.value = localStorage.getItem('TMDb-Key') || ''

        const savedHistory = load('search-history')
        if (savedHistory) searchHistory.value = savedHistory

        const savedLang = localStorage.getItem('app-lang')
        if (savedLang) language.value = savedLang

        // [NEW] 2. 테마 로드 및 적용
        const savedTheme = localStorage.getItem('app-theme')
        if (savedTheme) theme.value = savedTheme
        applyTheme(theme.value)

        // [NEW] 3. 시청 기록 로드
        const savedWatch = load('watch-history')
        if (savedWatch) watchHistory.value = savedWatch

        // [NEW] 4. 장르 캐시 로드
        const savedGenres = load('cached-genres')
        if (savedGenres) genreCache.value = savedGenres
    }

    // --- 로그인/로그아웃 ---
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

    // --- 찜하기 ---
    const toggleLike = (movie: any) => {
        const index = wishlist.value.findIndex((m) => m.id === movie.id)
        if (index !== -1) wishlist.value.splice(index, 1)
        else wishlist.value.push(movie)
        localStorage.setItem('my-wishlist', JSON.stringify(wishlist.value))
    }

    const isLiked = (movieId: number) => wishlist.value.some((m) => m.id === movieId)

    // --- 검색 기록 ---
    const addSearchHistory = (keyword: string) => {
        if (!keyword.trim()) return
        searchHistory.value = searchHistory.value.filter(k => k !== keyword)
        searchHistory.value.unshift(keyword)
        if (searchHistory.value.length > 10) searchHistory.value.pop()
        localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
    }

    const removeSearchHistory = (keyword: string) => {
        searchHistory.value = searchHistory.value.filter(k => k !== keyword)
        localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
    }

    // --- 언어 설정 ---
    const setLanguage = (lang: string) => {
        language.value = lang
        localStorage.setItem('app-lang', lang)
        window.location.reload()
    }

    // --- [NEW] 테마 설정 ---
    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
        localStorage.setItem('app-theme', theme.value)
        applyTheme(theme.value)
    }

    const applyTheme = (mode: string) => {
        if (mode === 'light') document.body.classList.add('light-mode')
        else document.body.classList.remove('light-mode')
    }

    // --- [NEW] 시청 기록 (상세정보 본 영화) ---
    const addToHistory = (movie: any) => {
        const exists = watchHistory.value.findIndex(m => m.id === movie.id)
        if (exists !== -1) watchHistory.value.splice(exists, 1)
        watchHistory.value.unshift(movie)
        if (watchHistory.value.length > 20) watchHistory.value.pop()
        localStorage.setItem('watch-history', JSON.stringify(watchHistory.value))
    }

    // --- [NEW] 장르 캐싱 (API 호출 최적화) ---
    const fetchGenres = async () => {
        if (genreCache.value.length > 0) return genreCache.value
        try {
            const res = await tmdb.get('/genre/movie/list')
            genreCache.value = res.data.genres
            localStorage.setItem('cached-genres', JSON.stringify(genreCache.value))
            return genreCache.value
        } catch (e) { return [] }
    }

    return {
        wishlist, email, apiKey, searchHistory, language, theme, watchHistory, genreCache,
        initializeStore, login, logout, toggleLike, isLiked,
        addSearchHistory, removeSearchHistory, setLanguage,
        toggleTheme, addToHistory, fetchGenres
    }
})