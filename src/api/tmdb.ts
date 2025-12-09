import axios from 'axios'

const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    timeout: 10000,
})

tmdb.interceptors.request.use((config) => {
    const apiKey = localStorage.getItem('TMDb-Key')
    const lang = localStorage.getItem('app-lang') || 'ko-KR'
    // [수정] 실제 API에 성인 필터 반영
    const includeAdult = localStorage.getItem('include-adult') === 'true'

    if (!config.params) config.params = {}

    config.params.api_key = apiKey
    config.params.language = lang
    config.params.include_adult = includeAdult

    return config
}, (error) => {
    return Promise.reject(error)
})

export default tmdb