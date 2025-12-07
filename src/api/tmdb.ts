import axios from 'axios'

const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 10000,
})

tmdb.interceptors.request.use((config) => {
    const apiKey = localStorage.getItem('TMDb-Key')

    if (!config.params) config.params = {}

    config.params.api_key = apiKey
    config.params.language = 'ko-KR'
    // [수정] 성인 콘텐츠 포함 안 함 (전역 설정)
    config.params.include_adult = false

    return config
}, (error) => {
    return Promise.reject(error)
})

export default tmdb