// common.js : 모든 페이지(내 페이지, PR로 받은 동료 페이지)가 함께 쓰는 공용 도구입니다. 고치지 않습니다.
// 모든 사이트의 common.js가 같아야 동료 페이지가 내 사이트에서도 그대로 돌아갑니다.
// 함수마다 위에 "입력 ⇒ 출력"을 적었습니다. 쓰는 법은 STARTER.md에 있습니다.
// 모두 function으로 만들어 두었으므로 같은 이름의 함수를 자기 JS 파일에 만들면 그 함수가 이것을 대신합니다
// (#3의 posterUrl을 옮겨 와도 오류 없음. 하는 일이 다른 #3의 saveLiked를 옮기면 찜 키가 바뀌니 옮기지 않음).
// 변수(const, let)는 모두 함수 안에만 있어 여러분 코드의 이름과 부딪히지 않습니다.

// ===== 키와 요청 주소 =====

// getKey : 키 이름(예: "TMDB_KEY") ⇒ keys.js에 적은 그 키의 값(keys.js나 그 이름이 없으면 "")
// 모든 페이지는 키를 이 함수로만 읽습니다(코드에 키 값을 쓰지 않음).
function getKey(name) {
  try {
    if (typeof KEYS !== "undefined" && KEYS[name]) {
      return String(KEYS[name]).trim();
    }
  } catch (err) {
    // keys.js 안의 값에 따옴표가 빠지면 KEYS를 만들다 멈춰 읽기만 해도 오류가 남(빈 글자로 봄)
  }
  return "";
}

// tmdbUrl : TMDB 경로(예: "movie/now_playing"), 추가 값 객체(생략 가능) ⇒ 키와 language=ko-KR이 붙은 전체 주소
function tmdbUrl(path, params) {
  const query = new URLSearchParams();
  query.set("api_key", getKey("TMDB_KEY"));
  query.set("language", "ko-KR");
  for (const name in params) {
    query.set(name, params[name]);     // 한글, 띄어쓰기, & 같은 값의 인코딩은 여기서 함
  }
  return "https://api.themoviedb.org/3/" + path + "?" + query.toString();
}

// kobisUrl : KOBIS 경로(예: "boxoffice/searchDailyBoxOfficeList"), 추가 값 객체(생략 가능) ⇒ key가 붙은 전체 주소(.json)
function kobisUrl(path, params) {
  const query = new URLSearchParams();
  query.set("key", getKey("KOBIS_KEY"));
  for (const name in params) {
    query.set(name, params[name]);
  }
  return "https://www.kobis.or.kr/kobisopenapi/webservice/rest/" + path + ".json?" + query.toString();
}

// yesterday : 없음 ⇒ 어제 날짜 "YYYYMMDD"(이 컴퓨터의 시각 기준. KOBIS 박스오피스는 어제까지만 집계)
function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return String(d.getFullYear()) + month + day;
}

// ===== 불러오기 =====

// fetchJSON : 요청 주소 ⇒ 응답 객체. 실패하면 이유를 담은 오류를 던짐(err.message는 그대로 화면에 써도 됨)
async function fetchJSON(url) {
  let data;
  let ok = true;
  let status = 200;
  // 샘플 모드: TMDB, KOBIS 주소는 네트워크 대신 sample.js의 가상 응답(실제처럼 0.3초 뒤)
  // sample.js를 부르지 않는 페이지(pages/아이디/)에서는 실제로 부릅니다.
  const sampleTmdb = url.startsWith("https://api.themoviedb.org/") && isSampleMode("tmdb") && typeof sampleTMDB === "function";
  const sampleKobis = url.startsWith("https://www.kobis.or.kr/") && isSampleMode("kobis") && typeof sampleKOBIS === "function";
  if (sampleTmdb || sampleKobis) {
    await new Promise(function (resolve) { setTimeout(resolve, 300); });
    if (sampleTmdb) {
      data = sampleTMDB(url);
    } else {
      data = sampleKOBIS(url);
    }
  } else {
    let res;
    try {
      res = await fetch(url);
    } catch (err) {
      throw new Error("연결 실패: " + err.message);     // 인터넷이 끊겼거나 CORS로 막힘
    }
    ok = res.ok;
    status = res.status;
    const text = await res.text();
    if (text.trim().startsWith("<")) {
      // JSON 대신 XML이 옴: 안의 오류 이름을 꺼내 알림
      const doc = new DOMParser().parseFromString(text, "text/xml");
      throw new Error("XML로 왔습니다: " + (xmlError(doc) || "주소에 JSON을 달라는 값(_type=json 등)이 있는지 확인하세요"));
    }
    try {
      data = JSON.parse(text);
    } catch (err) {
      const start = text.trim().slice(0, 40);            // 무엇이 왔는지 앞부분만 보여 줌
      throw new Error("JSON이 아닌 응답입니다" + (start ? ": " + start : ""));
    }
  }
  // 흔한 오류 모양에서 이유 찾기: TMDB, KOBIS, 공공데이터포털(JSON) 순서
  if (data && data.success === false) {
    throw new Error(data.status_message || "TMDB 오류 " + data.status_code);
  }
  if (data && data.faultInfo) {
    throw new Error(data.faultInfo.message || "KOBIS 오류");
  }
  if (data && data.OpenAPI_ServiceResponse) {
    const head = data.OpenAPI_ServiceResponse.cmmMsgHeader || {};
    throw new Error(head.returnAuthMsg || head.errMsg || "공공데이터포털 오류");
  }
  if (!ok) {
    throw new Error("응답 오류 " + status);
  }
  return data;
}

// fetchXML : 요청 주소, 태그 이름(생략하면 "item") ⇒ 태그마다 { 자식태그: 값 } 객체를 담은 배열
async function fetchXML(url, tag) {
  if (!tag) {
    tag = "item";
  }
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error("연결 실패: " + err.message);
  }
  const text = await res.text();
  if (!text.trim().startsWith("<")) {
    throw new Error("XML이 아닌 응답입니다(JSON이면 fetchJSON을 씁니다)");
  }
  const doc = new DOMParser().parseFromString(text, "text/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("XML을 읽지 못했습니다(주소를 확인하세요)");
  }
  const reason = xmlError(doc);
  if (reason) {
    throw new Error(reason);           // 예: SERVICE_KEY_IS_NOT_REGISTERED_ERROR
  }
  if (!res.ok) {
    throw new Error("응답 오류 " + res.status);
  }
  return [...doc.querySelectorAll(tag)].map(function (el) {
    const obj = {};
    for (const child of el.children) {
      obj[child.tagName] = child.textContent.trim();
    }
    return obj;
  });
}

// xmlError : XML 문서 ⇒ 그 안의 오류 이름(returnAuthMsg, errMsg, resultMsg 순서로 찾음). 정상 응답이면 ""
function xmlError(doc) {
  const code = doc.querySelector("resultCode");
  if (code && code.textContent.trim() !== "" && Number(code.textContent) === 0) {
    return "";                         // resultCode가 0으로만 된 값(00, 0000)이면 정상
  }
  for (const name of ["returnAuthMsg", "errMsg", "resultMsg"]) {
    const el = doc.querySelector(name);
    if (el && el.textContent.trim() !== "") {
      return el.textContent.trim();
    }
  }
  return "";
}

// ===== 영화 객체와 포스터 =====

// toMovie : TMDB 영화 한 건 ⇒ 실습과제 #3 영화 객체 모양 + id
function toMovie(r) {
  const date = r.release_date || "";
  return {
    id: r.id,
    title: r.title,
    year: Number(date.slice(0, 4)),    // 개봉 연도 숫자(개봉일이 없으면 0)
    date: date,
    rating: Math.round(r.vote_average * 10) / 10,   // 평가가 하나도 없으면 0
    audience: 0,
    poster: r.poster_path || null,
    type: "tmdb",
    rank: null,
    overview: r.overview || "줄거리 정보가 없습니다."
  };
}

// posterUrl : 포스터 경로, 크기(예: "w342") ⇒ 포스터 이미지 주소(#2, #3과 같음)
function posterUrl(path, size) {
  return "https://image.tmdb.org/t/p/" + size + path;
}

// ===== 화면 도우미 =====

// setState : 요소, 상태("loading", "empty", "error", "done"), 문구 ⇒ 요소 바로 위의 상태 문구를 바꿈(반환값 없음)
// 상태 문구 <p class="state-msg">는 처음 부를 때 요소 바로 앞에 만들어 넣습니다. "done"이면 문구를 지우고 숨깁니다.
// 요소 안의 내용은 건드리지 않습니다(그리는 함수가 비우고 다시 그림).
function setState(el, kind, message) {
  let msg = el.previousElementSibling;
  if (!msg || !msg.classList.contains("state-msg")) {
    msg = document.createElement("p");
    msg.setAttribute("role", "status");
    msg.setAttribute("aria-live", "polite");
    el.before(msg);
  }
  msg.className = "state-msg";
  if (kind === "done") {
    msg.textContent = "";
    msg.hidden = true;
  } else {
    msg.classList.add("is-" + kind);   // is-loading, is-empty, is-error(색은 common.css)
    msg.textContent = message;
    msg.hidden = false;
  }
  el.dataset.state = kind;
}

// escapeHTML : 글자(숫자, null도 됨) ⇒ & < > " ' 다섯 글자를 HTML에 안전한 글자로 바꾼 글자
function escapeHTML(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// getParam : 주소의 값 이름(예: "id") ⇒ 그 값 글자(없으면 null). detail.html?id=123이면 "123"
function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

// ===== 찜 저장(localStorage 키 "final-liked", 찜 기준은 영화 id 숫자) =====

// loadLiked : 없음 ⇒ 찜한 영화 id 배열(저장된 것이 없으면 [])
function loadLiked() {
  try {
    const list = JSON.parse(localStorage.getItem("final-liked") || "[]");
    return Array.isArray(list) ? list : [];
  } catch (err) {
    return [];                         // 저장값이 깨졌으면 빈 배열로 시작
  }
}

// saveLiked : 찜한 영화 id 배열 ⇒ localStorage의 "final-liked"에 저장(반환값 없음)
function saveLiked(list) {
  localStorage.setItem("final-liked", JSON.stringify(list));
}

// ===== 샘플 모드, 공용 헤더와 푸터, 동료 페이지 목록 =====

// isSampleMode : "tmdb"(생략 가능) 또는 "kobis" ⇒ 그 API의 키가 keys.js에 없거나 주소에 ?sample=1이면 true
function isSampleMode(kind) {
  let name = "TMDB_KEY";
  if (kind === "kobis") {
    name = "KOBIS_KEY";
  }
  return getKey(name) === "" || getParam("sample") === "1";
}

// hasConfig : 없음 ⇒ config.js를 읽었으면 true(쉼표, 따옴표가 빠져 CONFIG가 없으면 false)
function hasConfig() {
  try {
    return typeof CONFIG === "object" && CONFIG !== null;
  } catch (err) {
    return false;                      // 값에 따옴표가 빠지면 CONFIG를 만들다 멈춰 읽기만 해도 오류
  }
}

// keysState : 없음 ⇒ "ok"(keys.js를 읽음), "missing"(keys.js가 없음), "broken"(keys.js는 있는데 쉼표, 따옴표 오류)
function keysState() {
  try {
    if (typeof KEYS !== "undefined") {
      return "ok";
    }
  } catch (err) {
    return "broken";                   // 값에 따옴표가 빠지면 KEYS를 만들다 멈춰 읽기만 해도 오류
  }
  // KEYS가 없을 때: 브라우저가 keys.js를 받았으면(상태 200) 문법 오류, 못 받았으면(404) 파일이 없음.
  // 파일을 더블클릭해 연 페이지(file://)에는 이 기록이 없어 "missing"으로 봅니다.
  const found = performance.getEntriesByType("resource").filter(function (e) {
    return e.name.endsWith("/keys.js");
  });
  if (found.length > 0 && found[0].responseStatus === 200) {
    return "broken";
  }
  return "missing";
}

// rootPath : 없음 ⇒ 이 페이지에서 사이트 맨 위 폴더까지의 상대 경로(맨 위 페이지는 "", pages/아이디/ 안은 "../../")
// common.js를 부른 <script src="...common.js">의 앞부분을 씁니다. 공용 헤더, 푸터, 동료 페이지 링크에 씁니다.
function rootPath() {
  const script = document.querySelector('script[src$="common.js"]');
  if (!script) {
    return "";
  }
  const src = script.getAttribute("src");
  return src.slice(0, src.length - "common.js".length);
}

// renderLayout : 없음 ⇒ 공용 헤더(서비스 이름, 메뉴)와 푸터(TMDB 고지)를 채우고, 필요하면 띠 문구(반환값 없음)
// 헤더와 푸터 안에 페이지가 미리 써 둔 내용(예: 그 페이지의 자료 출처)은 그대로 두고 그 앞에 공용 내용을 넣습니다.
// 메뉴는 고정: 보드, 박스오피스, 내 플러스원(config.js의 MY_ID가 비면 숨김), 동료 페이지, 고지
function renderLayout() {
  if (!hasConfig()) {
    document.body.insertAdjacentHTML("afterbegin",
      '<p class="state-msg is-error">config.js를 읽지 못했습니다. config.js의 쉼표와 따옴표를 확인하세요(F12 Console의 첫 빨간 줄).</p>');
    return;
  }
  const root = rootPath();
  const myId = String(CONFIG.MY_ID || "").trim().toLowerCase();   // 폴더 이름은 아이디 소문자
  // 지금 페이지를 사이트 맨 위에서 본 경로(예: "boxoffice.html", "pages/kim123/index.html")
  const parts = location.pathname.split("/");
  let here = parts[parts.length - 1] || "index.html";
  if (root !== "") {
    here = "pages/" + parts[parts.length - 2] + "/" + here;
  }
  const menu = [
    { href: "index.html", name: "보드" },
    { href: "boxoffice.html", name: "박스오피스" },
    { href: "pages/" + myId + "/index.html", name: "내 플러스원" },
    { href: "pages.html", name: "동료 페이지" },
    { href: "about.html", name: "고지" }
  ];
  let items = "";
  for (const m of menu) {
    if (m.name === "내 플러스원" && myId === "") {
      continue;                        // MY_ID가 비어 있으면 메뉴에서 뺌
    }
    const current = m.href === here ? ' aria-current="page"' : "";
    items += `<li><a href="${escapeHTML(root + m.href)}"${current}>${m.name}</a></li>`;
  }
  const header = document.getElementById("site-header");
  if (header) {
    header.insertAdjacentHTML("afterbegin", `
      <a class="site-name" href="${root}index.html">${escapeHTML(CONFIG.SITE_NAME || "영화 플러스원")}</a>
      <nav aria-label="사이트 메뉴"><ul>${items}</ul></nav>`);
  }
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.insertAdjacentHTML("afterbegin", `
      <p lang="en">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      <p>자료 출처와 개인정보 처리는 <a href="${root}about.html">고지 페이지</a>에 있습니다.</p>`);
  }

  // keys.js 안내와 샘플 모드 띠(헤더 바로 아래)
  const keys = keysState();
  if (keys === "broken") {
    document.body.insertAdjacentHTML("afterbegin",
      '<p class="state-msg is-error">keys.js를 읽지 못했습니다. keys.js의 쉼표와 따옴표를 확인하세요(F12 Console의 첫 빨간 줄).</p>');
  }
  let banner = "";
  if (keys === "missing" && root !== "") {
    // 플러스원 페이지(pages/아이디/)는 자기 폴더의 keys.js를 부릅니다
    banner = "이 폴더에 <code>keys.js</code>가 없습니다(<code>pages/README.md</code> 빈 틀의 <code>keys.js</code>를 이 폴더에 만드세요)";
  } else if (keys === "missing") {
    banner = "<code>keys.js</code>가 없어 샘플 모드입니다(스타터의 <code>keys.js</code>를 맨 위 폴더에 두세요)";
  } else if (typeof sampleTMDB === "function") {
    const names = [];
    if (isSampleMode("tmdb")) {
      names.push("TMDB");
    }
    if (isSampleMode("kobis")) {
      names.push("KOBIS");
    }
    let why = "<code>keys.js</code>에 " + names.join(", ") + " 키가 없어";
    if (keys === "broken") {
      why = "<code>keys.js</code>를 읽지 못해";
    }
    if (getParam("sample") === "1") {
      why = "주소에 <code>?sample=1</code>이 있어";
    }
    if (names.length > 0) {
      banner = "샘플 모드(" + names.join(", ") + "): " + why + " 가상 영화를 보여 줍니다. 플러스원 API는 실제로 부릅니다.";
    }
  }
  if (banner !== "") {
    const html = '<p class="sample-banner">' + banner + "</p>";
    if (header) {
      header.insertAdjacentHTML("afterend", html);
    } else {
      document.body.insertAdjacentHTML("afterbegin", html);
    }
  }

  // ?sample=1로 열었으면 사이트 안 링크를 누를 때 주소에 sample=1을 이어 붙여, 옮겨 간 페이지도 샘플 모드로
  if (getParam("sample") === "1") {
    document.addEventListener("click", function (e) {
      const link = e.target.closest("a");
      const href = link ? link.getAttribute("href") || "" : "";
      if (href.includes(".html") && !href.includes(":") && !href.includes("#") && !href.includes("sample=")) {
        link.setAttribute("href", href + (href.includes("?") ? "&" : "?") + "sample=1");
      }
    });
  }
}

// renderPeerPages : 없음 ⇒ pages.html의 <section id="peer-pages">에 config.js PAGES의 동료 페이지 카드를 그림(반환값 없음)
// 그 칸이 없는 다른 페이지에서는 아무것도 하지 않습니다.
function renderPeerPages() {
  const box = document.getElementById("peer-pages");
  if (!box || !hasConfig()) {
    return;
  }
  const list = Array.isArray(CONFIG.PAGES) ? CONFIG.PAGES : [];
  if (list.length === 0) {
    setState(box, "empty", "아직 받은 페이지가 없습니다(안내문 6절)");
    return;
  }
  let html = "";
  for (const p of list) {
    const id = String(p.id || "").trim().toLowerCase();         // 폴더 이름은 아이디 소문자
    html += `
      <a class="peer-card" href="${escapeHTML(rootPath() + "pages/" + id + "/index.html")}">
        <h2>${escapeHTML(p.name || id)}</h2>
        <p>만든 사람: ${escapeHTML(id)}</p>
        <p class="peer-path">pages/${escapeHTML(id)}/</p>
      </a>`;
  }
  box.innerHTML = html;
}

renderLayout();      // 페이지를 열면 바로 한 번 실행(공용 헤더와 푸터)
renderPeerPages();   // pages.html에서만 동료 페이지 카드를 그림
