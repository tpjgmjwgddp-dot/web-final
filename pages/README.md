# 플러스원 페이지 규칙 (`pages/` 폴더)

이 폴더에는 내 플러스원 페이지(`pages/내아이디/`)와 PR로 받은 동료 페이지(`pages/동료아이디/`)가 들어갑니다.<br>플러스원 페이지는 TMDB, KOBIS 말고 **키가 필요한 다른 API**로 만든 페이지 1개이고, 동료 사이트에 Pull Request로 보내 퍼뜨립니다.

## 1. 규칙 8가지

1. 폴더 이름은 내 GitHub 아이디(소문자 그대로)입니다:<br>`pages/내아이디/`
2. 파일은 `index.html`(필수), `app.js`, `style.css`, `README.md`(필수), `keys.js`(이 페이지가 쓰는 내 키)입니다.<br>그림 파일을 쓰면 이 폴더 안에만 둡니다.
3. 공용 파일만 상대 경로로 씁니다:<br>`../../common.css`, `../../config.js`, `../../common.js`<br>키는 맨 위 `keys.js`가 아니라 내 폴더의 `keys.js`를 부릅니다(한 페이지에 `KEYS`가 두 번 생기면 오류).<br>다른 폴더의 파일을 고치거나 부르지 않습니다.
4. 키는 내 폴더의 `keys.js`에 적고 `getKey("이름")`으로만 읽습니다.<br>키 이름은 대문자와 밑줄로 쓰고 `_KEY`로 끝냅니다(예: `DATA_GO_KR_KEY`, `FOOD_KEY`, `LIBRARY_KEY`).<br>코드(`app.js`)에 키 값을 쓰지 않습니다. 영화와 잇느라 TMDB도 부르면 `TMDB_KEY`도 내 폴더 `keys.js`에 적습니다.<br>`keys.js`는 페이지와 함께 동료 사이트로 가서 공개되므로 무료 교육용 키만 씁니다(결제 정보가 연결된 키, 비밀번호, 토큰은 넣지 않음).<br>동료 사이트에서도 내 키로 부르므로 하루 사용량이 넉넉한 키를 고릅니다.
5. **키가 필요한 API를 하나 이상** 씁니다(TMDB, KOBIS 말고).<br>키 없는 API를 함께 써도 됩니다.
6. 최소 기준:<br>실데이터 표시, `setState`로 로딩, 빈 결과, 오류(이유 포함) 3종, 페이지 안에 데이터 출처, 360px에서 가로 스크롤 없음, 인라인 이벤트 속성(`onclick` 등) 없음, 외부 데이터는 `escapeHTML`
7. `README.md` 양식:<br>페이지 이름 / 한 줄 소개 / 만든 사람(GitHub 아이디) / 쓰는 API(이름, 제공기관, 대표 요청 주소, 키 이름, 발급처와 승인 시간) / 가져가는 법(받는 사람이 할 일: Merge 뒤 `config.js`의 `PAGES` 한 줄) / 출처(아래 4절 빈 틀)
8. 영화와 이어지면 더 좋습니다(예: 영화 제목으로 원작 도서 검색).<br>필수는 아닙니다.

PR은 자동 검사 없이 받는 사람의 리뷰로 판단합니다(바뀐 파일이 모두 `pages/PR작성자아이디/` 안인지, `index.html`, `README.md`, `keys.js`가 있는지).

## 2. 주고받기(PR) 요약

**보내는 사람(작성자, 아웃바운드)**

1. 상대 저장소 `https://github.com/상대아이디/web-final`의 `pages/` 폴더로 갑니다.<br>**Add file ⇒ Upload files**를 누르고 내 폴더(`내아이디`)를 통째로 끌어다 놓습니다.<br>아래 "Propose changes"에 제목 `[플러스원] 내아이디: 페이지 이름`을 적습니다.<br>GitHub가 내 계정에 fork를 만들고 PR 화면으로 가면 **Create pull request**를 누릅니다.
2. VS Code로 해도 됩니다(fork ⇒ clone ⇒ 폴더 복사 ⇒ 커밋 ⇒ 동기화 ⇒ GitHub에서 Contribute ⇒ Open pull request).
3. 내 페이지를 고치면 이미 받아 간 사람에게 같은 방법으로 다시 PR을 보냅니다(제목 `[플러스원 수정] ...`).

**받는 사람(인바운드)**

1. PR 화면의 **Files changed**에서 바뀐 파일이 `pages/보낸사람아이디/` 안뿐인지 먼저 확인합니다.<br>남의 폴더나 공용 파일(맨 위 `keys.js`, `config.js` 등)을 고쳤으면 Merge하지 않고 보낸 사람에게 고쳐 달라고 합니다.
2. 보낸 사람의 사이트(`https://보낸사람아이디.github.io/web-final/pages/보낸사람아이디/`)에서 페이지를 써 봅니다.
3. 무엇을 확인했는지 리뷰 코멘트를 한 줄 이상 남깁니다(예: "보낸 사람 사이트에서 3건 표시 확인").
4. **Merge pull request**를 누릅니다.
5. 내 `config.js`의 `PAGES`에 한 줄을 더합니다:<br>`{ id: "보낸사람아이디", name: "페이지 이름" },`<br>받은 페이지는 자기 폴더의 `keys.js`(보낸 사람의 키)로 돌아가므로 키를 받거나 `keys.js`를 고칠 일이 없습니다.<br>커밋, 동기화 뒤 배포 사이트의 메뉴 "동료 페이지"에서 동작을 확인합니다.

PR은 자기 폴더만 더하고 메뉴(`config.js`)는 받는 사람이 Merge 뒤에 직접 고치므로 충돌이 나지 않습니다.<br>같은 두 사람이 서로 주고받는 것은 정상입니다(각각 1건씩 인정).

## 3. 내 폴더 만드는 법

1. VS Code 탐색기에서 `pages` 폴더를 오른쪽 클릭 ⇒ 새 폴더를 고르고, 이름을 내 GitHub 아이디(소문자 그대로)로 짓습니다.
2. 그 폴더 안에 새 파일 5개(`index.html`, `app.js`, `style.css`, `README.md`, `keys.js`)를 만듭니다.<br>아래 4절의 빈 틀을 각 파일에 그대로 붙여 넣습니다.
3. 맨 위 폴더의 `config.js`에서 `MY_ID`에 내 아이디를 넣습니다.<br>메뉴의 "내 플러스원"이 이 폴더로 갑니다.
4. `pages/내아이디/index.html`을 열어 공용 메뉴와 "이 폴더의 keys.js에 DATA_GO_KR_KEY가 없습니다" 문구가 보이면 틀이 맞게 들어간 것입니다.<br>`app.js`와 내 폴더 `keys.js`의 키 이름을 내 API의 키 이름으로 바꾸고, 내 폴더 `keys.js`에 키를 넣은 뒤 4단계 주석을 따라 채웁니다.

## 4. 빈 틀

**`index.html`**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>페이지 이름</title>
  <link rel="stylesheet" href="../../common.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- 공용 헤더: common.js가 채웁니다(받는 사람의 사이트에서는 그 사람의 서비스 이름과 메뉴) -->
  <header id="site-header"></header>

  <main>
    <h1>페이지 이름</h1>
    <!-- 입력이 필요하면 여기에 둡니다(예: <input id="q" type="search">). 이벤트는 app.js에서 addEventListener로 -->

    <!-- 결과 칸: app.js가 API 결과를 넣습니다(상태 문구는 setState가 이 바로 위에 넣음) -->
    <section id="result" class="result"></section>
  </main>

  <!-- 공용 푸터: common.js가 TMDB 고지를 채우고, 아래 출처 한 줄은 그대로 남습니다 -->
  <footer id="site-footer">
    <p>자료 출처: API 이름(제공기관)</p>
  </footer>

  <!-- 공용 파일은 맨 위 폴더의 것을 ../../로 부릅니다(내 폴더에 복사하지 않음). 키는 내 폴더의 keys.js -->
  <script src="../../config.js"></script>
  <script src="keys.js"></script>
  <script src="../../common.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

**`app.js`**

```js
/* 페이지: 플러스원(pages/내아이디/index.html)   만든 사람: 이름(GitHub 아이디)
   맡은 기능: 플러스원 페이지(쓰는 API: API 이름, 키 이름)
   수업 밖 문법: 없음(있으면 그 줄 위에 // 출처: 주석)
   생성형 AI 사용 기록: 없음 / 있으면 내 사이트 README.md의 생성형 AI 사용 내역에 */

// app.js : 키가 필요한 API를 불러와 결과 칸에 넣기(4단계). 주석을 따라 여러분이 채웁니다
async function loadPlusOne() {
  const result = document.getElementById("result");
  const key = getKey("DATA_GO_KR_KEY");   // 내 폴더 keys.js의 키(내 API의 키 이름으로 바꿈. 대문자와 밑줄, _KEY로 끝냄)
  if (key === "") {
    setState(result, "error", "이 폴더의 keys.js에 DATA_GO_KR_KEY가 없습니다");
    return;
  }
  setState(result, "loading", "불러오는 중입니다.");
  try {
    // 1. 주소 조립: 키는 위의 key를 넣고(공공데이터포털은 Encoding 키 그대로), 입력값은 encodeURIComponent로 감쌉니다.
    //    예(공공데이터포털 TourAPI 대전 관광지, 요청 값은 활용가이드 최신판에서 확인):
    //    const url = "https://apis.data.go.kr/B551011/KorService2/areaBasedList2?serviceKey=" + key +
    //      "&MobileOS=ETC&MobileApp=Web&_type=json&numOfRows=10&pageNo=1&areaCode=3";
    // 2. 불러오기: const data = await fetchJSON(url);  (XML만 주는 API는 fetchXML(url, "item"))
    // 3. 응답 경로 찾기: console.log(data)로 펼쳐 보며 화면에 쓸 값의 경로를 찾습니다(예: data.response.body.items.item).
    // 4. 화면에 넣기: setState(result, "done", "") 뒤 값을 result에 넣습니다(HTML로 넣을 때는 escapeHTML).
    //    0건이면 setState(result, "empty", "찾은 결과가 없습니다.")
    setState(result, "empty", "아직 만들지 않았습니다(app.js의 4단계 주석을 따라 채웁니다).");   // 다 만들면 이 줄을 지움
  } catch (err) {
    setState(result, "error", "불러오지 못했습니다(" + err.message + ")");
  }
}
loadPlusOne();
```

**`style.css`**

```css
/* style.css : 이 플러스원 페이지만의 모양(../../common.css 다음에 읽혀 덮어씀).
   공용 파일(common.css)과 다른 폴더의 파일은 고치지 않습니다. */

/* 결과 칸 */
.result {
  padding: 16px;
  border: 1px dashed var(--line);
  border-radius: 10px;
  background: var(--surface);
}
```

**`keys.js`**

```js
// keys.js : 이 플러스원 페이지가 쓰는 키(만든 사람의 키, 저장소에 함께 올라가 공개됨. 무료 교육용 키만)
const KEYS = {
  DATA_GO_KR_KEY: "",
};
```

**`README.md`(양식)**

```markdown
# 페이지 이름
- 한 줄 소개 : (무엇을, 누구에게)
- 만든 사람 : GitHub 아이디

## 쓰는 API
| API 이름 | 제공기관 | 대표 요청 주소(키 자리는 KEY) | 키 이름 | 발급처와 승인 시간 |
|---|---|---|---|---|
| | | | | |

## 가져가는 법(받는 사람이 할 일)
1. 이 PR의 Files changed를 확인하고 리뷰 코멘트를 남긴 뒤 Merge합니다.
2. 내 config.js의 PAGES에 한 줄을 더합니다:<br>{ id: "만든사람아이디", name: "페이지 이름" },
3. 키는 이 폴더의 keys.js(만든 사람의 키)에 있어 따로 할 일이 없습니다.

## 출처
- (API 제공기관, 이용 조건, 이미지 출처)
```
