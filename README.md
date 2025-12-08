# 🎬 YJY Netflix Clone (WSD-Assignment-02)

![Vue.js](https://img.shields.io/badge/vue-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/pinia-%23ffe066.svg?style=for-the-badge&logo=pinia&logoColor=black)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

> **대학 과제 제출용 프로젝트입니다.**
> 넷플릭스(Netflix)의 UI/UX를 벤치마킹하여 **Vue 3**와 **TMDB API**로 구현한 반응형 영화 웹 애플리케이션입니다.

<br/>

## 🔗 배포 링크 (Demo)
### 👉 [프로젝트 보러가기 (Click)](https://yangbun-git.github.io/WSD-Assignment-02/)

> **⚠️ 접속 시 주의사항:**
> 구글 보안 정책으로 인해 '위험한 사이트' 경고가 뜰 수 있습니다. 이는 실제 넷플릭스 디자인과 유사하여 발생하는 오탐지이며, 실제로는 안전합니다.
> **[세부정보] -> [안전하지 않은 사이트 방문]**을 클릭하여 접속해주세요.

<br/>

## 🛠 기술 스택 (Tech Stack)

| 분류 | 기술 | 비고 |
| :--- | :--- | :--- |
| **Framework** | **Vue 3** | Composition API (`<script setup>`) 활용 |
| **Language** | **TypeScript** | 정적 타입 지정을 통한 안정성 확보 |
| **Build Tool** | **Vite** | 빠른 개발 서버 및 빌드 최적화 |
| **State Management** | **Pinia** | 로그인 세션 및 찜 목록(Wishlist) 전역 관리 |
| **API Client** | **Axios** | TMDB API 통신 및 Interceptor 설정 |
| **Routing** | **Vue Router** | SPA 라우팅 (Hash Mode 적용) |
| **Deployment** | **GitHub Actions** | CI/CD 자동 배포 파이프라인 구축 |

<br/>

## ✨ 주요 기능 (Key Features)

### 1️⃣ 사용자 인증 (Authentication)
- **TMDB API Key 로그인:** 별도 회원가입 없이 API Key로 간편 접속
- **상태 유지:** `Pinia` + `localStorage`를 활용하여 새로고침 시에도 로그인 상태 유지
- **보안 UI:** 피싱 사이트 오해 방지를 위한 '과제용 프로젝트' 명시 및 UI 개선

### 2️⃣ 영화 탐색 (Browse)
- **메인 홈 (Hero Banner):** 최신/인기 영화의 대형 배너와 장르별 슬라이더 제공
- **인기 콘텐츠:**
    - **무한 스크롤 (Infinite Scroll):** 모바일 친화적인 끊김 없는 탐색
    - **페이지네이션 (Pagination):** 테이블 형태의 정형화된 데이터 탐색 지원
- **상세 정보 (Modal):** 영화 클릭 시 모달창을 통해 평점, 개봉일, 장르 등 상세 정보 확인

### 3️⃣ 검색 및 필터 (Search & Filter)
- **실시간 검색:** 영화 제목 기반 실시간 검색 결과 제공
- **다중 필터링:** 장르, 평점(5/7/9점 이상), 언어(한국어/영어 등) 복합 필터 지원

### 4️⃣ 개인화 (Personalization)
- **찜하기 (Wishlist):** 하트 아이콘 클릭 시 '내가 찜한 리스트'에 즉시 추가/삭제
- **반응형 동기화:** 전역 상태 관리를 통해 모든 페이지에서 찜 상태 실시간 반영

<br/>

## 📂 폴더 구조 (Folder Structure)

```bash
src/
├── 📂 api/              # Axios 인스턴스 (tmdb.ts)
├── 📂 assets/           # 로고, 배경 이미지, 정적 파일
├── 📂 components/       # 재사용 가능한 UI 컴포넌트
│   ├── Navbar.vue       # 네비게이션 바 (검색, 프로필)
│   ├── MovieRow.vue     # 가로 스크롤 슬라이더
│   ├── MovieCard.vue    # 영화 카드 (찜하기 기능 포함)
│   ├── MovieModal.vue   # 상세 정보 모달
│   └── SkeletonCard.vue # 로딩 스켈레톤 UI
├── 📂 router/           # 라우터 설정 (Navigation Guard)
├── 📂 stores/           # Pinia Store (movieStore.ts - 전역 상태)
├── 📂 views/            # 페이지 단위 컴포넌트
│   ├── Home.vue         # 메인 페이지
│   ├── Popular.vue      # 인기 콘텐츠 (무한스크롤/페이지네이션)
│   ├── Search.vue       # 검색 페이지
│   ├── Wishlist.vue     # 찜 목록 페이지
│   └── SignIn.vue       # 로그인 페이지
├── App.vue              # 최상위 컴포넌트 (초기화 로직)
└── main.ts              # 앱 진입점
````

<br>

## 🌿 Git Flow 전략

본 프로젝트는 체계적인 버전 관리를 위해 **Git Flow** 전략을 도입하여 개발되었습니다.

| 브랜치 (Branch) | 설명 (Description) | 전략 |
| :--- | :--- | :--- |
| **`main`** | **배포 가능한 안정 버전** | 최종 완성된 코드가 병합되며, GitHub Actions를 통해 자동 배포됩니다. |
| **`develop`** | **개발 중심 브랜치** | 기능 개발이 완료된 `feature` 브랜치들이 이곳으로 병합됩니다. |
| **`feature/*`** | **기능 개발 브랜치** | 각 기능(로그인, 검색, UI 등) 단위로 독립적으로 생성하여 개발 후 `develop`에 병합합니다. |

<br>

## 🚀 설치 및 실행 (Getting Started)

이 프로젝트는 `Node.js` 환경에서 실행됩니다.

```bash
# 1. 레포지토리 클론
git clone [https://github.com/yangbun-GIT/WSD-Assignment-02.git](https://github.com/yangbun-GIT/WSD-Assignment-02.git)

# 2. 프로젝트 폴더로 이동
cd WSD-Assignment-02

# 3. 의존성 패키지 설치
npm install

# 4. 개발 서버 실행
npm run dev
```

브라우저 주소창에 `http://localhost:5173/WSD-Assignment-02/`를 입력하여 접속합니다.

<br>

## 📝 커밋 컨벤션 (Commit Convention)

| 태그 | 설명 |
| :--- | :--- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `style` | CSS 등 스타일 수정 (로직 변경 없음) |
| `refactor` | 코드 리팩토링 (기능 변경 없음) |
| `docs` | 문서 수정 (README 등) |
| `ci` | 빌드/배포 스크립트 수정 |
