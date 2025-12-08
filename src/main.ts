import { createApp } from 'vue'
import { createPinia } from 'pinia' // [추가]
import './style.css'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(createPinia()) // [추가] Pinia 사용 설정
app.use(router)
app.mount('#app')