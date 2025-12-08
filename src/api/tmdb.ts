import axios from 'axios'

const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 10000,
})

tmdb.interceptors.request.use((config) => {
    const apiKey = localStorage.getItem('TMDb-Key')
    // [수정] 로컬 스토리지 언어 설정 반영 (기본값 ko-KR)
    const lang = localStorage.getItem('app-lang') || 'ko-KR'

    if (!config.params) config.params = {}

    config.params.api_key = apiKey
    config.params.language = lang
    config.params.include_adult = false

    return config
}, (error) => {
    return Promise.reject(error)
})

export default tmdb