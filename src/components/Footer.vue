<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="warning-text">
        ⚠️ <strong>Disclaimer</strong>
      </p>
      <p>
        This is a personal project for educational purposes only. Not an official service.<br>
        이 사이트는 교육 목적으로 제작된 개인 프로젝트이며, 실제 서비스가 아닙니다.
      </p>
      <p class="copyright">
        &copy; {{ new Date().getFullYear() }} YJY Project. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  width: 100%;
  background-color: #000000;
  color: #757575;
  padding: 40px 20px;
  text-align: center;
  border-top: 1px solid #333;
  margin-top: auto; /* 내용이 짧아도 바닥에 붙도록 설정 */
  font-size: 0.9rem;
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.footer-content {
  max-width: 1000px;
  margin: 0 auto;
  line-height: 1.6;
}

.warning-text {
  color: #e50914; /* 경고 색상으로 봇에게 강조 */
  margin-bottom: 10px;
}

.copyright {
  margin-top: 20px;
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 라이트 모드 대응 */
:global(body.light-mode) .app-footer {
  background-color: #f5f5f5;
  color: #333;
  border-top: 1px solid #ddd;
}
</style>