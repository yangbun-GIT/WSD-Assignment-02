<template>
  <div class="auth-wrapper">
    <div class="auth-bg"></div>

    <div class="auth-box">
      <h1>NETFLIX</h1>

      <transition name="fade" mode="out-in">

        <form v-if="isLoginMode" key="login" @submit.prevent="handleLogin">
          <h2>로그인</h2>
          <div class="input-group">
            <input v-model="email" type="email" placeholder="이메일 주소" required />
          </div>
          <div class="input-group">
            <input v-model="password" type="password" placeholder="비밀번호 (TMDB API Key)" required />
          </div>
          <button type="submit" class="submit-btn">로그인</button>

          <div class="toggle-text">
            Netflix 회원이 아니신가요?
            <span @click="toggleMode">지금 가입하세요.</span>
          </div>
        </form>

        <form v-else key="signup" @submit.prevent="handleSignup">
          <h2>회원가입</h2>
          <div class="input-group">
            <input v-model="email" type="email" placeholder="이메일 주소" required />
          </div>
          <div class="input-group">
            <input v-model="password" type="password" placeholder="비밀번호 (TMDB API Key)" required />
          </div>
          <div class="input-group">
            <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인" required />
          </div>
          <div class="checkbox-group">
            <input type="checkbox" id="agree" required>
            <label for="agree">약관에 동의합니다.</label>
          </div>
          <button type="submit" class="submit-btn">회원가입</button>

          <div class="toggle-text">
            이미 회원이신가요?
            <span @click="toggleMode">로그인하기.</span>
          </div>
        </form>
      </transition>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const isLoginMode = ref(true) // true: 로그인, false: 회원가입 상태

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')

// 모드 전환 함수
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  errorMsg.value = ''
  password.value = ''
  confirmPassword.value = ''
}

const handleLogin = async () => {
  try {
    await axios.get(`https://api.themoviedb.org/3/configuration?api_key=${password.value}`)
    localStorage.setItem('TMDb-Key', password.value)
    localStorage.setItem('UserId', email.value)
    router.push('/')
  } catch (e) {
    errorMsg.value = '로그인 실패: API Key를 확인해주세요.'
  }
}

const handleSignup = () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  alert('회원가입 성공! (로컬 스토리지에 저장되었습니다)')
  // 실제로는 여기서 users 배열에 저장하는 로직을 추가할 수 있습니다.
  toggleMode() // 로그인 창으로 전환
}
</script>

<style scoped>
.auth-wrapper {
  position: relative; height: 100vh; display: flex; align-items: center; justify-content: center;
  /* 넷플릭스 스타일 배경 이미지 */
  background: url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/KR-ko-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg') no-repeat center center/cover;
}
.auth-bg {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); /* 배경 어둡게 */
}

.auth-box {
  position: relative; z-index: 1; background: rgba(0, 0, 0, 0.75);
  padding: 60px 68px 40px; border-radius: 4px; width: 100%; max-width: 450px; min-height: 500px;
  color: white;
}

h1 { color: #e50914; font-size: 2.5rem; text-align: center; margin-bottom: 20px; }
h2 { font-size: 2rem; margin-bottom: 28px; }

.input-group input {
  width: 100%; background: #333; border: none; border-radius: 4px;
  color: white; height: 50px; line-height: 50px; padding: 0 20px; margin-bottom: 16px;
}

.submit-btn {
  width: 100%; background: #e50914; color: white; font-weight: bold;
  border: none; border-radius: 4px; height: 48px; cursor: pointer; margin-top: 24px; font-size: 1rem;
}

.toggle-text { margin-top: 16px; color: #737373; font-size: 1rem; }
.toggle-text span { color: white; cursor: pointer; margin-left: 5px; }
.toggle-text span:hover { text-decoration: underline; }

.error { color: #e87c03; margin-top: 10px; font-size: 14px; }
.checkbox-group { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: #b3b3b3; }

/* [Vue Transition] 슬라이드 페이드 효과 CSS */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from { opacity: 0; transform: translateX(20px); }
.fade-leave-to { opacity: 0; transform: translateX(-20px); }
</style>