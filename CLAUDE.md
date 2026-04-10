# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 프로젝트 개요

테일45(Tail45) — 반려견 놀이터/라운지 사업을 위한 고객용 한국어 SPA입니다. 순수 HTML/CSS/JavaScript로 작성되었으며 빌드 단계, 프레임워크, 패키지 매니저가 전혀 없습니다. 모든 상태는 클라이언트 메모리에 보관되는 데모/프로토타입이며, 이 저장소에는 백엔드가 연결되어 있지 않습니다.

- 배포 주소: https://nam9514-cpu.github.io/tail45-app/
- 원격 저장소: https://github.com/nam9514-cpu/tail45-app
- **폴더명에 공백이 있음:** `/Users/nam/업무/claude_code/tail45 app` — 경로는 항상 따옴표로 감싸서 사용할 것.

## 실행 / 배포

- **로컬 실행:** `index.html`을 브라우저에서 직접 열면 됩니다. 개발 서버, `npm`, 번들러 모두 없습니다. `http://` origin이 필요한 경우(예: Daum 우편번호 API 관련 이슈)에는 간단한 정적 서버를 사용하세요. 예: `python3 -m http.server 8000`.
- **배포:** `main` 브랜치에 푸시하면 `.github/workflows/pages.yml`이 저장소 루트를 GitHub Pages로 자동 배포합니다. CI에는 테스트 스위트나 린트 단계가 없습니다.
- **빌드 산출물 없음** — 명시적인 지시 없이 번들러나 트랜스파일러를 추가하지 마세요. 배포 워크플로우는 저장소 루트를 그대로 업로드합니다.
- `*.sql`, `*.zip`, `스크린샷/`은 gitignore 처리되어 있습니다. 소스코드 ZIP 패키지나 SQL 내보내기 파일은 커밋하지 마세요.

## 아키텍처

하나의 `index.html` 안에 모든 "페이지"가 `<section class="view">` 형태로 들어있고, `js/app.js`가 모든 로직과 상태를 담당하며, `styles/main.css`가 모든 스타일을 담고 있습니다. 네비게이션은 라우터가 아니라 클라이언트 사이드 뷰 전환 방식입니다.

### 뷰 전환(View switching)
`js/app.js`의 `switchView(viewId)` 함수가 7개의 최상위 뷰에 대해 `.active`/`.hidden` 클래스를 토글합니다. 새 화면을 추가할 때는 `index.html`에 `<section id="view-xxx" class="view hidden">`를 추가하고 `switchView('view-xxx')`로 이동시키면 됩니다.

주요 뷰:
- `view-auth` — 로그인 / 다단계 회원가입 (`currentSignupStep`, `signupNextStep/PrevStep`, `handleSignupComplete`). 반려견 폼은 `addPetForm`으로 동적으로 추가되며, `BREED_LIST`를 이용한 견종 자동완성 기능이 포함되어 있습니다.
- `view-home` — 이용권 구매 CTA, 남은 시간 카드, 그리고 **실시간 운동장 현황** 카드가 있는 대시보드입니다. (LIVE 뱃지는 의도적으로 빨간색 `#E53E3E`를 사용하며, primary 초록이 아닙니다.)
- `view-tickets` — 이용권 구매 허브. 같은 뷰 안에서 세 가지 서브 플로우로 분기됩니다: **A동 예약**, **B동 예약** (둘 다 예약 달력을 거침), 그리고 **당일권**.
- `view-timer`, `view-rewards`, `view-parkinfo`, `view-mypage` — 보조 화면들.

### 전역 상태 (모두 `js/app.js`에 있음)
- `DB` — 사용자 정보, `DB.pets`(등록된 반려견 `{id, name, size}`), `DB.tickets`, `DB.activeTicket`, `DB.registeredUsers`. "누가 입장할 수 있는가"의 기준이 되는 진실의 원천입니다.
- `rsvState` — 예약 폼: `{building: 'A'|'B', year, month, selectedDate, selectedTime, duration, guardianCount, petCount}`. `renderRsvCalendar`, `rsvSelectDate`, `rsvSelectTime`, `selectReservationDuration`, `rsvCountChange`, `handleReservationSubmit`, `rsvResetForm`에서 다룹니다. 3시간을 초과하는 예약은 셀프서비스 대신 `handleReservationCall`(전화 문의)로 연결됩니다.
- `dpState` — 당일권 폼: `{year, month, selectedDate, selectedPets}`. 당일권은 **시간제가 아닙니다**. 영업 종료(21:00)까지 유효하며 `checkDaypassExpiry`에서 자동 만료되고, 이때 `yardExitAll`도 함께 호출되어 운동장 현황이 초기화됩니다.
- `yardOccupants` — 각 운동장에 현재 들어있는 반려견 배열. 키는 `YARD_CONFIG`에서 가져옵니다: `small`(소형), `sm`(소·중형), `med`(중형), `large`(대형), `a`(A동), `b`(B동). 반려견의 `size` 문자열을 운동장 키로 매핑할 때는 반드시 `normalizePetSize` + `getYardForSize`를 사용하세요. 매핑을 하드코딩하면 안 됩니다.

### 입·퇴장 플로우
운동장 상태는 앱 전체에 걸친 불변식(invariant)입니다. 모든 변경은 반드시 다음 함수들을 통해서만 이루어져야 합니다:
- `yardEntrance(yardKey, pets, ownerId)` — 반려견을 추가하고 화면을 다시 그립니다.
- `yardExit(yardKey, petIds)` / `yardExitAll(petIds)` — 반려견을 제거하고 다시 그립니다.
- `renderYardStatus()` — `yardOccupants`를 읽어서 홈 뷰의 카드를 렌더링합니다. 상태 변경 후에는 반드시 호출하세요. 운동장 카운트 DOM을 직접 조작하면 안 됩니다.

UI의 모의(mock) QR 패널은 `handleMockScan`(입장)과 `handleMockExit`(퇴장)을 호출합니다. `handleMockScan`은 예약권의 경우 `activeTicket.building`에서, 당일권의 경우 각 반려견의 size에서 대상 운동장을 결정하며, 반려견 목록은 `getEntryPets` 헬퍼로 가져옵니다. 실제 QR 연동을 추가할 때는 이 두 핸들러에 붙이면 되고, 운동장 라우팅 로직을 중복으로 작성하지 마세요.

### 구매 게이팅
예약과 당일권 두 플로우 모두 약관 동의 체크박스를 눌러야 결제 버튼이 활성화됩니다. 기존의 `toggleTermsBtn(prefix)` / `resetTerms(prefix)` 헬퍼와 `.primary-btn.disabled` 스타일을 재사용하세요. 게이트를 새로 만들지 마세요.

## 테일45 무인화를 위한 앱 제작 시 규칙

1. 디자인의 기본색은 초록색 계열을 유지한다. 단, 직접 첨부하는 로고나 파일은 원본 그대로 사용하여 적용한다.
2. 언어는 한국어로 만든다.

## 이 저장소만의 컨벤션

- **언어:** 모든 UI 문구와 대부분의 주석이 한국어입니다. 사용자가 별도로 요청하지 않는 한 새로 작성하는 문구도 한국어로 유지하세요.
- **테마:** 기본색은 옥색(jade green) `--primary: #00A86B`입니다. LIVE/경고 인디케이터는 빨간색 `#E53E3E`를 사용합니다. 사용자가 과거에 LIVE를 초록으로 했던 시도를 명확히 수정 지시한 적이 있습니다.
- **아이콘:** Phosphor Icons를 CDN으로 사용합니다 (`<i class="ph ...">`). 아이콘 폰트를 번들링하지 않습니다.
- **주소 검색:** 회원가입에서 Daum 우편번호 API를 CDN으로 사용합니다.
- **프레임워크 도입 금지:** React/Vue/Svelte, 번들러, TypeScript, npm을 도입하지 마세요. 의존성이 꼭 필요하다고 판단되면 먼저 사용자에게 확인하세요.
- **파일 크기:** `js/app.js`는 약 2,100줄, `index.html`은 약 1,000줄이지만 이는 의도된 구조입니다. 사용자는 이 프로젝트에서 큰 단일 파일을 선호하므로, 별도 요청이 없는 한 모듈로 분리하지 말고 기존 파일을 직접 수정하세요.
