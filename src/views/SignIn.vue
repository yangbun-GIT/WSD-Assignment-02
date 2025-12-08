<template>
  <div class="auth-wrapper">
    <div class="bg-grid">
      <div class="bg-overlay"></div>
      <div v-for="movie in bgMovies" :key="movie.id" class="bg-item">
        <img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" :alt="movie.title" />
      </div>
    </div>

    <div class="logo-area">
      <img src="../assets/yjy.png" alt="YJY NETFLIX" class="logo-img" />
    </div>

    <div class="auth-box">
      <transition name="fade" mode="out-in">
        <form v-if="isLoginMode" key="login" @submit.prevent="handleLogin">
          <h2>로그인</h2>

          <div class="input-group">
            <input v-model="email" type="text" placeholder="이메일 주소 또는 휴대전화 번호" required />
          </div>
          <div class="input-group">
            <input v-model="password" type="password" placeholder="비밀번호 (TMDB API Key)" required />
          </div>

          <button type="submit" class="submit-btn">로그인</button>

          <div class="separator">

          </div>

          <div class="help-links"><a href="#">비밀번호를 잊으셨나요?</a></div>
          <div class="remember-me">
            <input type="checkbox" id="remember" checked>
            <label for="remember">로그인 정보 저장</label>
          </div>
          <div class="signup-area">
            YJYFLIX 회원이 아닌가요? <span @click="toggleMode">지금 가입하세요</span>
          </div>
          <p class="disclaimer">
            이 페이지는 Google reCAPTCHA의 보호를 받아 사용자가 로봇이 아님을 확인합니다. <a href="#">자세히 알아보기.</a>
          </p>
        </form>

        <form v-else key="signup" @submit.prevent="handleSignup">
          <h2>회원가입</h2>
          <div class="input-group">
            <input v-model="email" type="email" placeholder="이메일 주소" required />
          </div>
          <div class="input-group">
            <input v-model="password" type="password" placeholder="비밀번호 설정 (TMDB API Key)" required />
          </div>
          <div class="input-group">
            <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인" required />
          </div>
          <button type="submit" class="submit-btn">회원가입</button>
          <div class="signup-area">
            이미 회원이신가요? <span @click="toggleMode">로그인하기</span>
          </div>
        </form>
      </transition>

      <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import tmdb from '../api/tmdb'

const router = useRouter()
const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')
const bgMovies = ref<any[]>([])

const fetchBgMovies = async () => {
  try {
    const res = await tmdb.get('/movie/popular')
    bgMovies.value = [...res.data.results, ...res.data.results, ...res.data.results]
  } catch (e) { console.error('배경 로드 실패') }
}

onMounted(() => fetchBgMovies())

const toggleMode = () => { isLoginMode.value = !isLoginMode.value; errorMsg.value = ''; password.value = ''; confirmPassword.value = '' }

const handleLogin = async () => {
  try {
    await axios.get(`https://api.themoviedb.org/3/configuration?api_key=${password.value}`)
    localStorage.setItem('TMDb-Key', password.value)
    localStorage.setItem('UserId', email.value)
    router.push('/')
  } catch (e) { errorMsg.value = '로그인 실패: 올바른 정보를 입력하세요.' }
}

const handleSignup = () => {
  if (password.value !== confirmPassword.value) { errorMsg.value = '비밀번호가 일치하지 않습니다.'; return }
  alert('회원가입이 완료되었습니다. 로그인해주세요.')
  toggleMode()
}
</script>

<style scoped>
.auth-wrapper { position: relative; min-height: 100vh; width: 100%; background-color: #000; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.bg-grid { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; opacity: 0.5; z-index: 0; transform: scale(1.1); }
.bg-item img { width: 100%; height: auto; border-radius: 4px; display: block; }
.bg-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%); background-color: rgba(0,0,0,0.5); z-index: 1; }

.logo-area { position: absolute; top: 20px; left: 40px; z-index: 10; }
.logo-img { height: 80px; object-fit: contain; }

.auth-box { position: relative; z-index: 10; background-color: rgba(0, 0, 0, 0.75); padding: 60px 68px 40px; border-radius: 4px; width: 100%; max-width: 450px; min-height: 600px; color: white; }
h2 { font-size: 2rem; font-weight: 700; margin-bottom: 28px; }
.input-group { margin-bottom: 16px; }
.input-group input { width: 100%; height: 50px; background: #333; border: none; border-radius: 4px; color: white; padding: 0 20px; font-size: 1rem; box-sizing: border-box; }
.input-group input:focus { background: #454545; outline: none; border-bottom: 2px solid #e87c03; }
.submit-btn { width: 100%; height: 48px; background: #e50914; color: white; font-size: 1rem; font-weight: 700; border: none; border-radius: 4px; cursor: pointer; margin-top: 24px; }
.submit-btn:hover { background: #f6121d; }
.separator { text-align: center; margin: 15px 0; color: #b3b3b3; font-size: 0.9rem; }
.code-btn { width: 100%; height: 40px; background: rgba(255, 255, 255, 0.1); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; margin-bottom: 15px; }
.code-btn:hover { background: rgba(255, 255, 255, 0.2); }
.help-links { text-align: center; margin-bottom: 20px; }
.help-links a { color: #b3b3b3; text-decoration: none; font-size: 0.9rem; }
.help-links a:hover { text-decoration: underline; }
.remember-me { display: flex; align-items: center; gap: 5px; color: #b3b3b3; font-size: 0.9rem; margin-bottom: 15px; }
.remember-me input { width: 16px; height: 16px; accent-color: #737373; }
.signup-area { color: #737373; font-size: 1rem; margin-top: 40px; }
.signup-area span { color: white; cursor: pointer; margin-left: 5px; }
.signup-area span:hover { text-decoration: underline; }
.disclaimer { font-size: 0.8rem; color: #8c8c8c; margin-top: 20px; line-height: 1.4; }
.disclaimer a { color: #0071eb; text-decoration: none; }
.error-msg { color: #e87c03; margin-top: 20px; font-size: 0.9rem; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@media (max-width: 740px) { .bg-grid { display: none; } .auth-wrapper { background-color: black; align-items: flex-start; } .auth-box { background-color: black; padding: 20px; max-width: 100%; min-height: 100vh; } .logo-area { top: 10px; left: 20px; } .logo-img { height: 50px; } }
</style>