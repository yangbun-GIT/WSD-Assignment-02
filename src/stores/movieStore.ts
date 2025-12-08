import { defineStore } from 'pinia'
import { ref } from 'vue'
import tmdb from '../api/tmdb'

export const useMovieStore = defineStore('movie', () => {
    // --- State (총 14개 Key) ---
    const wishlist = ref<any[]>([])
    const email = ref('')
    const apiKey = ref('')
    const searchHistory = ref<string[]>([])
    const language = ref('ko-KR')
    const theme = ref('dark')
    const watchHistory = ref<any[]>([])
    const genreCache = ref<any[]>([])
    const viewMode = ref<'table' | 'infinite'>('table')

    // [NEW] 추가된 5가지 상태
    const wishlistSort = ref<'date' | 'alpha'>('date')
    const includeAdult = ref(false)
    const autoplay = ref(true)
    const lowDataMode = ref(false)
    const lastPath = ref('/')

    // --- Actions ---
    const initializeStore = () => {
        const load = (key: string) => {
            const data = localStorage.getItem(key)
            try { return data ? JSON.parse(data) : null } catch { return null }
        }

        // 기존 데이터 로드
        if (load('my-wishlist')) wishlist.value = load('my-wishlist')
        email.value = localStorage.getItem('UserId') || ''
        apiKey.value = localStorage.getItem('TMDb-Key') || ''
        if (load('search-history')) searchHistory.value = load('search-history')
        language.value = localStorage.getItem('app-lang') || 'ko-KR'
        theme.value = localStorage.getItem('app-theme') || 'dark'
        applyTheme(theme.value)
        if (load('watch-history')) watchHistory.value = load('watch-history')
        if (load('cached-genres')) genreCache.value = load('cached-genres')
        viewMode.value = localStorage.getItem('view-mode') as any || 'table'

        // [NEW] 신규 데이터 로드
        wishlistSort.value = localStorage.getItem('wishlist-sort') as any || 'date'
        includeAdult.value = localStorage.getItem('include-adult') === 'true'
        const savedAutoplay = localStorage.getItem('autoplay')
        autoplay.value = savedAutoplay === null ? true : savedAutoplay === 'true'
        lowDataMode.value = localStorage.getItem('low-data-mode') === 'true'
        lastPath.value = localStorage.getItem('last-path') || '/'
    }

    // --- 기존 함수들 (로그인, 찜, 검색 등) ---
    const login = (userEmail: string, key: string) => {
        email.value = userEmail; apiKey.value = key;
        localStorage.setItem('UserId', userEmail); localStorage.setItem('TMDb-Key', key);
    }
    const logout = () => {
        email.value = ''; apiKey.value = '';
        localStorage.removeItem('UserId'); localStorage.removeItem('TMDb-Key');
    }
    const toggleLike = (movie: any) => {
        const index = wishlist.value.findIndex((m) => m.id === movie.id)
        if (index !== -1) wishlist.value.splice(index, 1); else wishlist.value.push(movie)
        localStorage.setItem('my-wishlist', JSON.stringify(wishlist.value))
    }
    const isLiked = (movieId: number) => wishlist.value.some((m) => m.id === movieId)
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
    const setLanguage = (lang: string) => {
        language.value = lang; localStorage.setItem('app-lang', lang); window.location.reload()
    }
    const toggleTheme = () => {
        theme.value = theme.value === 'dark' ? 'light' : 'dark'
        localStorage.setItem('app-theme', theme.value); applyTheme(theme.value)
    }
    const applyTheme = (mode: string) => {
        if (mode === 'light') document.body.classList.add('light-mode'); else document.body.classList.remove('light-mode')
    }
    const addToHistory = (movie: any) => {
        const exists = watchHistory.value.findIndex(m => m.id === movie.id)
        if (exists !== -1) watchHistory.value.splice(exists, 1)
        watchHistory.value.unshift(movie)
        if (watchHistory.value.length > 20) watchHistory.value.pop()
        localStorage.setItem('watch-history', JSON.stringify(watchHistory.value))
    }
    const fetchGenres = async () => {
        if (genreCache.value.length > 0) return genreCache.value
        try {
            const res = await tmdb.get('/genre/movie/list')
            genreCache.value = res.data.genres
            localStorage.setItem('cached-genres', JSON.stringify(genreCache.value))
            return genreCache.value
        } catch (e) { return [] }
    }
    const setViewMode = (mode: 'table' | 'infinite') => {
        viewMode.value = mode; localStorage.setItem('view-mode', mode)
    }

    // --- [NEW] 신규 기능 함수들 ---
    const setWishlistSort = (sort: 'date' | 'alpha') => {
        wishlistSort.value = sort; localStorage.setItem('wishlist-sort', sort)
    }
    const toggleAdult = () => {
        includeAdult.value = !includeAdult.value
        localStorage.setItem('include-adult', String(includeAdult.value))
    }
    const toggleAutoplay = () => {
        autoplay.value = !autoplay.value
        localStorage.setItem('autoplay', String(autoplay.value))
    }
    const toggleLowData = () => {
        lowDataMode.value = !lowDataMode.value
        localStorage.setItem('low-data-mode', String(lowDataMode.value))
    }
    const saveLastPath = (path: string) => {
        if (path === '/signin') return // 로그인 페이지는 저장 안 함
        lastPath.value = path
        localStorage.setItem('last-path', path)
    }

    return {
        wishlist, email, apiKey, searchHistory, language, theme, watchHistory, genreCache, viewMode,
        wishlistSort, includeAdult, autoplay, lowDataMode, lastPath,
        initializeStore, login, logout, toggleLike, isLiked,
        addSearchHistory, removeSearchHistory, setLanguage,
        toggleTheme, addToHistory, fetchGenres, setViewMode,
        setWishlistSort, toggleAdult, toggleAutoplay, toggleLowData, saveLastPath
    }
})