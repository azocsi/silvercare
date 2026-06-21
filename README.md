# 🥈 silvercare

> 사회복지사 자격증(2급 → 1급) 취득 여정 기록 · 공유용
> 러닝화니(DeviceComparison) 스타일의 인터랙티브 비교/가이드 모음

📱 **모바일에서 바로 보기** → GitHub Pages 배포 후 `https://<유저명>.github.io/silvercare/`

---

## 📂 구조

```
silvercare/
├── index.html        # 자체완결 모바일 뷰어 (CDN React + Babel, 바로 열림)
├── src/
│   └── 사복2급_교육원비교.jsx   # 원본 소스 (lucide-react, 내 React 프로젝트용)
└── README.md
```

- `index.html` = **공유·모바일 열람용**. 의존성 설치 없이 브라우저로 바로 열림.
- `src/*.jsx` = **편집·재사용용** 원본. Claude 프로젝트에서 이 스타일로 계속 업데이트.

## 🗂️ 시즌 / 챕터 구조

4개 챕터 = 1 시즌. 시즌이 차면 포트폴리오 `/silvercare` 라우트로 합본 공개.

**Season 1 — 기관 선정**
1. ch1. 교육원 비교 (가격·학점은행) ✅ ← 현재 `index.html`
2. ch2. LMS 자동화 분석 (F12 체크) — 진행 예정
3. ch3. 수강신청 전략 (매트릭스·타임라인)
4. ch4. 자동화 셋업 (Playwright)

**Season 2 — 2급 코스워크** / **Season 3 — 현장실습** / **Season 4 — 1급 시험** …

## 🎨 디자인 DNA (러닝화니 스타일)

- 뉴브루탈리즘: 검정 2px 테두리 + 어긋난 그림자 `4px 4px 0 0`
- 베이지 크림톤 그라데이션 `#fdfcf7 → #ebe4d3`
- 섹션 번호 `01/02…` + 2단 타이틀
- 4단계 색상: emerald(최적) · blue(가능) · amber(제한) · rose(불가) · gray(미확인)
- 결론 먼저 / 냉정한 한계점 / 이모지 / Pretendard

## 🚀 GitHub Pages 켜기

1. 이 폴더를 레포 루트에 푸시
2. GitHub → **Settings → Pages → Source: `main` / `/ (root)`** 저장
3. 1~2분 후 `https://<유저명>.github.io/silvercare/` 접속 (모바일 OK)

## 🔄 업데이트 방식

새 챕터는 `chapters/chN.html` 또는 별도 jsx로 추가 → `index.html` 상단에 챕터 네비 링크.
Claude 프로젝트에서 같은 스타일로 만들어 받은 뒤 푸시.

---

🔗 관련 노션: 🥈 사회복지사 2급 (수강신청 전략 · 자동화 로그 · 업체 비교 DB)
