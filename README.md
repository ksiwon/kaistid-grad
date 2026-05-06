# 2026 KAIST ID 졸업전시 웹사이트

> React + Vite + TypeScript + styled-components + Firebase  
> 오프라인 전시: 세지화랑 (서울 종로구 북촌로4길 27, B1) · 2026.12.02 – 12.12 · 10:00–18:00

---

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Firebase 없이 mock 데이터로 작동)
npm run dev
```

Firebase 없이도 mock 데이터로 모든 UI를 확인할 수 있습니다.

---

## 환경 설정

```bash
# .env.local.example을 복사하여 Firebase 설정 입력
cp .env.local.example .env.local
```

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=kaist-id-gradshow-2026.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kaist-id-gradshow-2026
VITE_FIREBASE_STORAGE_BUCKET=kaist-id-gradshow-2026.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_SUPER_ADMIN_UID=...
VITE_APP_URL=https://kaistid-grad.siwon.site
```

---

## 페이지 구조

| 경로 | 설명 |
|---|---|
| `/` | 홈 — 히어로, 피처드 작품, About/Q&A 티저 |
| `/works` | 전체 작품 그리드 + 카테고리 필터 |
| `/works/:artistId` | 작가 상세 페이지 — 갤러리, 스테이트먼트, Q&A |
| `/qa` | 전체 Q&A 게시판 |
| `/stamp` | 스탬프 랠리 현황 |
| `/stamp/scan` | QR 스캐너 및 스캔 결과 처리 |
| `/about` | 전시 정보 + 오시는 길 |
| `/admin` | 작가 로그인 게이트 |
| `/admin/:artistId` | 작가 CMS 패널 |
| `/admin/super` | 슈퍼어드민 대시보드 |

---

## 기술 스택

- **Frontend**: React 18, Vite 5, TypeScript 5
- **Styling**: styled-components 6
- **Routing**: React Router v6
- **상태 관리**: React Query v5 (서버), Zustand (클라이언트)
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Hosting**: Netlify
- **QR**: html5-qrcode (스캔), qrcode (생성)

---

## 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# Netlify 배포 (Netlify CLI 사용 시)
netlify deploy --prod
```

GitHub 저장소를 Netlify에 연동하여 자동 배포(CI/CD)를 설정하는 것을 권장합니다.
Netlify 배포 시 `.env.local`에 있는 환경 변수들을 Netlify 대시보드(Site settings > Environment variables)에 동일하게 등록해주어야 합니다.

---

## 디자인 토큰

| 토큰 | 값 |
|---|---|
| black | `#0a0a0a` |
| surface | `#111111` |
| textPrimary | `#e8e4dc` |
| accentWarm | `#c8a882` |
| 폰트 (display) | Cormorant Garamond |
| 폰트 (mono) | DM Mono |
| 폰트 (body) | Noto Serif KR |

---

*문서 버전: v1.0 · 2026.05*  
*문의: KAIST 산업디자인학과 졸업전시위원회*
