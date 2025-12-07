import { createApp } from 'vue'
import './style.css' // 전역 스타일 로드
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css' // 폰트어썸 아이콘

createApp(App)
    .use(router) // 라우터 사용 설정
    .mount('#app')