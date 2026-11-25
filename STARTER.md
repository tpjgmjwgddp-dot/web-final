# 🎬 기말 프로젝트 스타터 v3 사용법

## 1. 무엇인가요

13주차 2교시에 내 저장소 `web-final`에 올리는 출발 코드입니다.<br>보드, 상세, 박스오피스, 동료 페이지 목록, 고지 페이지의 틀과 공용 도구, 값이 빈 `keys.js`가 들어 있습니다.<br>`keys.js`에 키를 넣기 전에도 샘플 모드(가상 영화 12편과 그 박스오피스)로 바로 열립니다.<br>파일을 더블클릭해 열어도 됩니다.

## 2. 쓰는 순서

배포는 지금까지처럼 GitHub Pages(Settings ⇒ Pages ⇒ Deploy from a branch, `main`, `/ (root)`)입니다.<br>바꿀 설정이 없습니다.

1. zip 풀기:<br>LMS에서 받은 zip 파일을 풀어 나온 파일과 폴더를 `web-final` 저장소 폴더의 맨 위(루트)에 그대로 놓습니다.<br>`README.md`는 덮어쓰고 `plan/` 폴더는 그대로 둡니다.
2. 키 넣기:<br>`keys.js`의 따옴표 안에 내 TMDB 키와 KOBIS 키를 넣습니다.<br>`keys.js`는 저장소에 함께 올라가 공개됩니다(4절). 무료 교육용 키만 넣습니다.
3. 설정:<br>`config.js`의 `SITE_NAME`에 서비스 이름, `MY_ID`에 내 GitHub 아이디(소문자)를 넣습니다.
4. 내 플러스원 폴더:<br>`pages/README.md` 3절대로 `pages/내아이디/` 폴더를 만들고 빈 틀 5개를 붙여 넣습니다(플러스원 키는 그 폴더의 `keys.js`).
5. 커밋과 동기화:<br>소스 제어에서 커밋(예: `스타터 v3 올림`) ⇒ 동기화합니다.
6. 사이트 확인:<br>1~3분 뒤 `https://내아이디.github.io/web-final/`에서 샘플 모드 노란 안내 띠 없이 실제 상영 중 영화와 어제 박스오피스가 보이면 성공입니다(안 바뀌어 보이면 Ctrl+F5).<br>그다음부터는 커밋, 동기화만 하면 Pages가 다시 배포합니다.

## 3. 파일 지도

| 파일 | 스타터에 들어 있는 것 | 내가 할 일 |
|---|---|---|
| `index.html`, `board.js`, `board.css` | TMDB 상영 중 목록 ⇒ 간단한 카드(평점 0은 "평점 없음") | 과제 #3 함수 재사용, 검색 요청, 정렬, 찜과 찜 모두 지우기 |
| `detail.html`, `detail.js`, `detail.css` | `movie/{id}` ⇒ 제목과 포스터, id가 없을 때 오류 문구 | 목록에 없던 정보 2개 이상, #1 디자인 |
| `boxoffice.html`, `boxoffice.js`, `boxoffice.css` | KOBIS 어제 박스오피스 10편(순위, 영화명, 개봉일, 관객 수, 순위 변동) | TMDB 영화 포스터 매칭(`boxoffice.js` 끝의 4단계 주석) |
| `about.html` | 고지 4항목 제목과 쓸 내용 주석 | 내용 쓰기 |
| `pages.html` | 동료 페이지 목록(`config.js`의 `PAGES`로 카드를 그림) | 고치지 않음(`PAGES`만 더함) |
| `config.js` | 서비스 이름, `MY_ID`, `PAGES` | 채우기(저장소에 올림) |
| `keys.js` | 키 이름(값은 빈 글자) | 따옴표 안에 내 TMDB, KOBIS 키 넣기(저장소에 올림, 공개) |
| `pages/README.md` | 플러스원 페이지 규칙, 주고받기 요약, 빈 틀 | 읽고 내 폴더 만들기 |
| `common.js`, `common.css`, `sample.js` | 공용 도구, 공용 헤더와 푸터, 키 없이 보는 샘플 | 고치지 않음 |
| `README.md` | 내 사이트 설명 양식 | 채우기 |

`common.js`, `common.css`, `sample.js`를 고치지 않는 이유: 모든 사이트가 같아야 PR로 받은 동료 페이지가 내 사이트에서도 그대로 돌아갑니다.<br>페이지만의 모양은 그 페이지의 CSS에 씁니다(공용 색을 바꾸려면 그 CSS에 `:root { --accent: #c2410c; }`처럼 다시 적음).

## 4. 키 관리 한 장 요약

키는 `keys.js`에 적어 저장소에 함께 올립니다.<br>브라우저가 부르는 키는 어떻게 해도 배포 사이트에서 보이기 때문입니다(소스 보기, F12 Network).<br>그래서 무료 교육용 키만 씁니다.

| 무엇 | 하는 일 |
|---|---|
| 루트 `keys.js` | 내 사이트의 TMDB, KOBIS 키(`TMDB_KEY`, `KOBIS_KEY`). 저장소에 올림 |
| `pages/내아이디/keys.js` | 내 플러스원 페이지가 쓰는 키. 페이지와 함께 동료 사이트로 감(받는 사람은 키를 받지 않아도 됨) |
| 읽는 법 | 모든 페이지는 `getKey("이름")`으로만 읽음. 코드에 키 값을 직접 쓰지 않음 |
| 넣지 않는 것 | 결제 정보가 연결된 키, 비밀번호, GitHub 토큰은 절대 넣지 않음 |
| 키가 남용되면 | 사용량 초과나 경고 메일이 오면 발급처에서 키를 다시 받아 `keys.js`를 바꾸고 커밋 |
| Google 키 | Google Cloud 콘솔의 키 제한에서 웹사이트 `https://*.github.io/*`만 허용. GitHub가 push를 막으면(push protection) 오류 메시지의 링크를 열어 허용 |
| 고지 페이지 | "키 관리 방법"에 위 원칙을 적음 |

실서비스라면 키를 서버(또는 서버리스 함수)에 두고 브라우저는 그 서버만 부릅니다(이 수업 범위 밖, 발표 때 받을 질문).

## 5. 샘플 모드

- TMDB: `keys.js`에 `TMDB_KEY`가 없거나 주소 끝에 `?sample=1`이 있으면 `sample.js`의 가상 영화 12편을 보여 줍니다.<br>흉내 내는 요청은 `movie/now_playing`, `search/movie`, `movie/{id}`, `discover/movie`이고, 그 밖의 경로는 빈 목록입니다.
- KOBIS: `keys.js`에 `KOBIS_KEY`가 없거나 `?sample=1`이면 어제 박스오피스 가상 10편을 보여 줍니다.<br>일별 박스오피스만 흉내 내고, 그 밖의 KOBIS 경로는 오류 문구가 됩니다(오늘이나 앞날의 날짜는 KOBIS처럼 빈 목록).
- 플러스원 API는 언제나 실제로 부릅니다.<br>`pages/아이디/` 페이지는 `sample.js`를 부르지 않으므로 TMDB, KOBIS도 실제로 부릅니다.
- 발표 날 TMDB나 KOBIS에 장애가 나면 사이트 주소 끝에 `?sample=1`을 붙여 엽니다(사이트 안의 링크를 눌러도 이어짐).

화면에 보이는 안내와 할 일:

| 안내 | 뜻 | 할 일 |
|---|---|---|
| 노란 안내 띠 "keys.js가 없어 샘플 모드입니다(스타터의 keys.js를 맨 위 폴더에 두세요)" | 맨 위 폴더에 `keys.js`가 없음(지웠거나 다른 폴더에 둠) | 스타터 zip의 `keys.js`를 맨 위 폴더에 다시 놓고 키 넣기 |
| 노란 안내 띠 "샘플 모드(TMDB, KOBIS): keys.js에 ... 키가 없어 ..." | `keys.js`는 있는데 그 키가 빈 값(키를 넣고 커밋하지 않았으면 배포 사이트도 빈 값) | 키 넣기 ⇒ 커밋, 동기화(2단계, 5단계) |
| 화면 맨 위 빨간 "keys.js를 읽지 못했습니다" | `keys.js`에 쉼표나 따옴표가 빠짐 | F12 Console 첫 빨간 줄의 줄 번호를 보고 고침 |
| 플러스원 페이지의 노란 안내 띠 "이 폴더에 keys.js가 없습니다" | `pages/내아이디/`에 `keys.js`가 없음 | `pages/README.md` 빈 틀의 `keys.js`를 그 폴더에 만들기 |
| 화면 맨 위 빨간 "config.js를 읽지 못했습니다" | `config.js`에 쉼표나 따옴표가 빠짐 | 위와 같음 |

- `keys.js`가 없으면 F12 Console에 `keys.js`를 찾지 못했다는 빨간 줄이 하나 보입니다(Live Server나 배포 사이트는 404, 더블클릭으로 연 파일은 ERR_FILE_NOT_FOUND).<br>`keys.js`를 맨 위 폴더에 두면 사라집니다.
- 더블클릭으로 연 페이지(`file://`)는 `keys.js`의 쉼표, 따옴표 오류도 "keys.js가 없어" 노란 안내 띠로 보일 수 있습니다.<br>`keys.js`가 있는데 이 노란 안내 띠가 보이면 F12 Console의 첫 빨간 줄을 확인합니다.

## 6. 자주 쓰는 함수(`common.js`)

- `getKey("TMDB_KEY")`: `keys.js`의 그 키 값(없으면 빈 글자). 모든 페이지는 키를 이 함수로만 읽습니다.
- `tmdbUrl(path, params)`: TMDB 경로와 추가 값 ⇒ 키와 `language=ko-KR`이 붙은 전체 주소(예: `tmdbUrl("search/movie", { query: keyword })`. 값의 인코딩은 이 함수가 함).
- `kobisUrl(path, params)`: KOBIS 경로와 추가 값 ⇒ `key`가 붙은 전체 주소(예: `kobisUrl("boxoffice/searchDailyBoxOfficeList", { targetDt: yesterday() })`).
- `yesterday()`: 어제 날짜 `YYYYMMDD`(KOBIS는 어제까지만 집계).
- `fetchJSON(url)`: 주소 ⇒ 응답 객체. 실패하면 이유를 담은 오류를 던지므로 `catch`에서 `err.message`를 오류 문구에 넣습니다.
- `fetchXML(url, "item")`: XML만 주는 API의 주소 ⇒ 태그마다 `{ 자식태그: 값 }` 객체를 담은 배열.
- `toMovie(r)`: TMDB 영화 한 건 ⇒ #3 영화 객체 모양(`id`가 더해짐). `data.results.map(toMovie)`로 씁니다.
- `posterUrl(path, size)`: 포스터 경로와 크기(예: `"w342"`) ⇒ 이미지 주소.
- `setState(el, kind, message)`: `el` 바로 위에 상태 문구(`"loading"`, `"empty"`, `"error"`). `"done"`이면 문구를 지웁니다.
- `escapeHTML(s)`: 외부 데이터를 `innerHTML`에 넣기 전에 `& < > " '`를 안전한 글자로 바꿉니다.
- `getParam("id")`: 주소의 `?id=` 값(없으면 `null`).
- `loadLiked()`, `saveLiked(list)`: 찜한 영화 `id` 배열을 `localStorage`의 `final-liked`에서 읽고 씁니다.
- `isSampleMode("tmdb")`, `isSampleMode("kobis")`: 그 API가 지금 샘플 모드인지.
- `rootPath()`: 이 페이지에서 사이트 맨 위 폴더까지의 상대 경로(`pages/아이디/` 안에서는 `"../../"`).
- `renderLayout()`, `renderPeerPages()`: 공용 헤더, 메뉴, 푸터, 노란 안내 띠 문구와 동료 페이지 카드(`common.js`가 알아서 부름).

## 7. 과제 #3 코드를 재사용할 때, 바꿔야 하는 4 곳

1. 데이터: `movies` 대신 `data.results.map(toMovie)`로 만든 배열
2. 찜 키: `"liked"` 대신 `loadLiked`, `saveLiked`(키 `final-liked`, `web-hw3`의 찜과 섞이지 않게)
3. 찜 기준: 제목 대신 `id`(`data-title` ⇒ `data-id`). 속성값은 문자열이라 `Number()`로 바꿔 `m.id`와 비교합니다.
4. 상세: `<dialog>` 대신 `detail.html?id=영화번호`로 이동(카드 안의 링크나 `location.href`). `openDetail`의 그리기 코드는 `detail.js`로 가져와 `movie/{id}` 응답으로 채웁니다.

#3을 끝내지 못했다면: 13주차 수업에 공개하는 교수 참고 보드(https://github.com/martin-yeo/web-fa)의 `index.html`, `board.js`, `board.css`, `detail.js`, `detail.css`를 가져와 씁니다. 머리 주석의 출처 줄은 지우지 않고, README에 적습니다(안내문 9.4절).

## 8. PR 보내고 받는 법 요약

- 보내는 사람:<br>상대 저장소의 `pages/` 폴더 ⇒ Add file ⇒ Upload files ⇒ 내 폴더를 통째로 끌어다 놓기 ⇒ 제목 `[플러스원] 내아이디: 페이지 이름` ⇒ Propose changes ⇒ Create pull request.<br>내 페이지를 고치면 받아 간 사람에게 다시 PR(제목 `[플러스원 수정] ...`).
- 받는 사람:<br>Files changed에서 바뀐 파일이 `pages/보낸사람아이디/` 안뿐인지 먼저 확인 ⇒ 보낸 사람 사이트에서 써 보고 리뷰 코멘트 한 줄 이상 ⇒ Merge pull request.<br>⇒ `config.js`의 `PAGES`에 `{ id: "보낸사람아이디", name: "페이지 이름" },` 한 줄 ⇒ 커밋, 동기화 ⇒ 배포 사이트에서 확인.<br>받은 페이지는 자기 폴더의 `keys.js`(보낸 사람의 키)로 돌아가므로 키를 받거나 `keys.js`를 고칠 일이 없습니다.
- 자세한 규칙과 빈 틀은 `pages/README.md`, 점수와 인정 조건은 안내문 6절에 있습니다.

## 9. 응답이 XML로 올 때

`fetchJSON`은 XML(`<`로 시작하는 글)이 오면 `XML로 왔습니다: 오류 이름` 오류를 던집니다. 오류 이름과 주소의 JSON 요청 값(`_type=json` 등)을 확인하고, XML만 주는 API는 `fetchXML(url, "item")`으로 부릅니다.

## 10. 할 일 목록(Todo Tree, 선택)

스타터의 내 몫 자리에는 `TODO 필수 n`, `TODO 13주차`, `TODO 플러스원`, `TODO 고지`, `TODO README` 주석이 13줄 있습니다(공용 파일 `common.js`, `common.css`, `sample.js`에는 없음).<br>VS Code 확장 Todo Tree(제작자 Gruntfuggly)를 설치하면 왼쪽 막대의 나무 모양 아이콘에 이 줄들이 모여 보이고, 누르면 그 줄로 갑니다(설치는 PC실 안내서 7-4절).<br>확장이 없으면 `Ctrl+Shift+F`로 `TODO`를 검색해도 같은 목록이 나옵니다.<br>끝낸 일의 `TODO` 줄은 지웁니다. 다만 완성 여부는 `TODO`가 아니라 안내문 3.1절의 필수 기능 표로 판단합니다.
