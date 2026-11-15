# SCM Frontend Foundation

React + TypeScript + Vite 기반의 공통 UI 출발점입니다. 실제 업무 데이터, 인증, API 호출은 구현하지 않았습니다.

## 작업 위치와 브랜치

개발·검증·서버 실행은 B:/workspace-zip/CORE-SCM/scm-web 한 폴더에서 수행합니다. 이 폴더를 편집기의 workspaceFolder로 여세요. Issue #2 작업 브랜치는 feat/2-login-dashboard이며 main에서는 수정하지 않습니다. 이전 보관본 폴더는 개발·실행 대상으로 사용하지 않습니다.

## 개발 환경

프로젝트 기준은 Node.js 24 LTS와 npm입니다. 이 작업 환경은 Node v24.18.0, npm 11.16.0을 사용했습니다. B 기본 scaffold의 React 19.3, TypeScript 7, Vite 8, Oxlint와 preview 스크립트를 유지했습니다. 추가한 Vitest 5는 Vite 8 및 Node 24를 지원하며, 정확한 설치 버전은 `package-lock.json`으로 재현합니다. 기존 `src/App.css`, `src/index.css`와 assets/public은 보존하되 scaffold CSS는 진입점에서 불러오지 않습니다.

```sh
npm ci
npm run dev
```

Vite는 `http://localhost:5173`에서 시작하고 `/api`를 기본 `http://localhost:8080` Gateway로 프록시합니다. 로컬 재정의는 `.env.example`을 참고해 `.env.local`을 만들고 `SCM_API_PROXY_TARGET`을 설정하세요. 서버 측 변수이므로 `VITE_` 접두어를 사용하지 않으며 비밀 값은 저장하지 마세요. 이 설정은 프록시 기반만 준비하며 API endpoint나 계약을 정의하지 않습니다.

업무 API 경로 방향은 `/api/auth/**`, `/api/srm/**`, `/api/wms/**`입니다. 실제 endpoint, 인증 및 토큰 정책은 아직 확정되지 않았습니다.

## 경로

- `/`: `/login`으로 replace 이동
- `/login`: 업무 셸과 분리된 로그인 화면. 아이디·비밀번호 입력 및 로그인 버튼 활성화, 클릭 시 인증 연동 준비 안내
- `/dashboard`: 업무 셸의 기본 메인 대시보드, 구매·창고 진입과 연동 준비 안내
- `/srm/purchase-requests/documents`: 구매요청문서현황 준비 화면
- `/srm/purchase-requests/items`: 구매요청아이템현황 준비 화면
- `/srm/*`: 구매 영역 미구현 안내
- `/wms/*`: 창고 영역 미구현 안내
- 그 외 경로: 404 안내

로그인 화면에서 아이디·비밀번호를 편집할 수 있고 비밀번호는 마스킹됩니다. 로그인 버튼은 처음부터 활성화되며 클릭하면 접근 가능한 상태 안내로 인증 API 연동 준비 중임을 알리고 현재 페이지를 유지합니다. 입력값 검사·전송·로그·영구 저장, 실제 인증, 토큰 저장, 세션·권한 및 경로 접근 보호는 구현하지 않았습니다. 입력값은 화면 입력 요소에만 있으며 별도 상태로 수집하지 않습니다.

**대시보드 화면 미리보기** 링크로 메인에 진입합니다. 미리보기는 실제 인증 성공이 아닙니다. `/dashboard`와 업무 경로는 직접 접근할 수 있으며 실제·샘플 업무 수치나 통계는 표시하지 않습니다. 업무 셸의 로그인 메뉴로 독립 로그인 화면에 돌아갈 수 있습니다.

SPA 경로의 직접 새로고침은 Vite 개발 서버에서 처리됩니다. 운영 정적 서버의 fallback 규칙은 배포 설정 시 별도로 구성해야 합니다.

좌측 **구매 (SRM) → 전자구매요청**에서 두 현황 메뉴를 확인할 수 있습니다. 상위 메뉴는 Enter/Space로 펼치거나 접는 버튼이며, 말단 메뉴는 고유 경로 링크입니다. SRM을 처음 펼치면 전자구매요청과 두 링크가 함께 표시되고, 말단 주소 직접 진입 시 상위 메뉴가 펼쳐지며 현재 링크가 선택됩니다. 모바일에서는 상위 펼침 시 메뉴가 유지되고 말단 선택 시 닫힙니다. 두 현황은 실제 조회·입력·API 없이 기존 미구현 안내를 재사용합니다.

메뉴 정의는 `src/routes/navigation.ts`에서 화면과 분리해 관리하며 현황 경로와 제목도 이 정의를 사용합니다. 향후 메뉴 데이터 소스 교체를 위한 로컬 구조이며 DB나 메뉴 API 계약은 구현·추정하지 않았습니다.

## launch.json으로 실행

VS Code의 실행 및 디버그에서 `SCM: 웹 서버 실행 + 브라우저 열기`를 선택하고 F5를 누르세요. Vite 서버가 준비되면 기본 브라우저가 열립니다. 최초 실행 전 `npm ci`가 필요하며, 디버깅 중지로 서버를 종료할 수 있습니다. 현재 Windows 구성은 사용자 프로필의 `AppData/Local/Programs/nodejs/node.exe`를 사용하므로 Node 설치 위치가 다르면 `runtimeExecutable`을 조정하세요.

5173 포트에 개발 서버가 이미 실행 중이면 `SCM: 실행 중인 서버 Edge 디버깅`을 선택하세요. 이 구성은 서버를 시작하거나 종료하지 않습니다. 새 서버 실행 구성은 포트 충돌 시 다른 포트로 변경하지 않고 실패합니다. VS Code 호환 편집기는 Node/Edge 디버거 지원이 필요합니다.

## 품질 검사

```sh
npm run lint
npm run build
npm test
```

`npm test`는 Vitest 단발 실행입니다. 기존 TypeScript project references의 app 프로젝트가 src 아래 테스트와 jest-dom 타입을 함께 검사하며 node 프로젝트가 Vite/Vitest 설정을 검사합니다. `npm run preview`는 빌드한 정적 화면을 확인하는 기존 명령입니다.

## MUI 무료 Dashboard 출처

기준은 [MUI 공식 무료 React 템플릿](https://mui.com/material-ui/getting-started/templates/)의 Dashboard 항목과 [공식 Dashboard 소스 디렉터리](https://github.com/mui/material-ui/tree/master/docs/data/material/getting-started/templates/dashboard)입니다. 이 저장소에는 해당 템플릿 소스 파일을 복사하지 않았으며, Material UI의 ThemeProvider/CssBaseline, 공통 테마, 반응형 Drawer 및 페이지 셸 패턴을 독립적으로 적용했습니다. 상기 Dashboard는 공식 페이지에서 무료 템플릿으로 분류됩니다. MUI Material UI 및 인용된 공식 저장소 소스의 라이선스는 [MIT](https://github.com/mui/material-ui/blob/master/LICENSE)입니다. 의존성 버전은 package.json/package-lock.json에 고정되어 있으며 MUI X Pro/Premium 또는 유료 템플릿은 사용하지 않습니다.

## 디자인 제안값

블랙 `#171717`, 차콜 `#202020`, 본문 배경 `#F5F7FA`, 본문 글자 `#1F2937`, 4px 기반 간격, 문서 지정 한글 글꼴을 공통 테마에 적용했습니다. 이 구체 값과 글꼴은 디자인 요구사항 문서상 초기 제안이며 사용자 확정 전입니다.
