<template>
  <div class="auth-wrapper">
    <div class="logo-area">
      <img src="../assets/yjy.png" alt="YJY PROJECT" class="logo-img" />
    </div>

    <div class="auth-box">
      <transition name="fade" mode="out-in">
        <form v-if="isLoginMode" key="login" @submit.prevent="handleLogin">
          <h2>로그인 (Netflix 과제)</h2>

          <div class="input-group">
            <input v-model="email" type="text" placeholder="이메일 (임의 입력 가능)" required />
          </div>
          <div class="input-group">
            <input v-model="password" type="password" placeholder="비밀번호 (TMDB API Key)" required />
          </div>

          <button type="submit" class="submit-btn">로그인</button>

          <div class="separator"><span>

          </span></div>

          <div class="signup-area">
            YJYflix 계정이 없으신가요? <span @click="toggleMode">회원가입</span>
          </div>

          <p class="disclaimer" style="color: #e50914; margin-top: 20px; font-size: 0.8rem;">
            * 본 사이트는 대학 과제 제출용 프로젝트이며, 실제 서비스와 무관합니다. 개인정보를 수집하지 않습니다.
          </p>
        </form>

        <form v-else key="signup" @submit.prevent="handleSignup">
          <h2>회원가입</h2>
          <div class="input-group">
            <input v-model="email" type="email" placeholder="이메일" required />
          </div>
          <div class="input-group">
            <input v-model="password" type="password" placeholder="비밀번호 (TMDB API Key) 입력" required />
          </div>
          <div class="input-group">
            <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인" required />
          </div>
          <button type="submit" class="submit-btn">등록하기</button>
          <div class="signup-area">
            이미 계정이 있으신가요? <span @click="toggleMode">로그인</span>
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
import { useMovieStore } from '../stores/movieStore' // Pinia Store

const router = useRouter()
const store = useMovieStore()

const isLoginMode = ref(true)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')

onMounted(() => { document.title = 'YJY Movie Project' }) // 탭 제목 변경

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  errorMsg.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const handleLogin = async () => {
  try {
    await axios.get(`https://api.themoviedb.org/3/configuration?api_key=${password.value}`)

    // [Pinia] 로그인 상태 저장
    store.login(email.value, password.value)

    router.push('/')
  } catch (e) {
    errorMsg.value = '접속 실패: 유효한 TMDB API Key를 입력해주세요.'
  }
}

const handleSignup = () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'API Key가 일치하지 않습니다.'
    return
  }
  alert('등록되었습니다. 접속해주세요.')
  toggleMode()
}
</script>

<style scoped>
.auth-wrapper {
  position: relative; min-height: 100vh; width: 100%;
  background-color: #000;
  /* 배경 이미지 */
  background-image: url('../assets/background.png');
  background-size: cover; background-position: center; background-repeat: no-repeat;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
}

.auth-wrapper::before {
  content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.95) 100%);
  z-index: 1;
}

.logo-area { position: absolute; top: 20px; left: 40px; z-index: 10; }
.logo-img { height: 80px; object-fit: contain; }

.auth-box {
  position: relative; z-index: 10;
  background-color: rgba(0, 0, 0, 0.75);
  padding: 60px 68px 40px;
  border-radius: 4px;
  width: 100%; max-width: 450px; min-height: 500px;
  color: white;
  box-shadow: 0 0 50px 10px rgba(0, 0, 0, 0.9);
}

h2 { font-size: 2rem; font-weight: 700; margin-bottom: 28px; }
.input-group { margin-bottom: 16px; }
.input-group input { width: 100%; height: 50px; background: #333; border: none; border-radius: 4px; color: white; padding: 0 20px; font-size: 1rem; box-sizing: border-box; }
.input-group input:focus { background: #454545; outline: none; border-bottom: 2px solid #e87c03; }
.submit-btn { width: 100%; height: 48px; background: #e50914; color: white; font-size: 1rem; font-weight: 700; border: none; border-radius: 4px; cursor: pointer; margin-top: 24px; }
.submit-btn:hover { background: #f6121d; }
.separator { text-align: center; margin: 15px 0; color: #b3b3b3; font-size: 0.9rem; }
.signup-area { color: #737373; font-size: 1rem; margin-top: 20px; }
.signup-area span { color: white; cursor: pointer; margin-left: 5px; }
.signup-area span:hover { text-decoration: underline; }
.error-msg { color: #e87c03; margin-top: 20px; font-size: 0.9rem; }

@media (max-width: 740px) {
  .auth-wrapper { background-image: none; background-color: black; align-items: flex-start; }
  .auth-box { background-color: black; padding: 20px; max-width: 100%; min-height: 100vh; box-shadow: none; }
}
</style>