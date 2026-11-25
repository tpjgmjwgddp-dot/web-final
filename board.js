/* 페이지: 보드(index.html)   만든 사람: 이름(GitHub 아이디)
   맡은 기능: 필수 1 실시간 목록, 2 요청을 바꾸는 검색, 3 정렬 2가지, 5 찜과 찜 모두 지우기
   수업 밖 문법: 없음(있으면 그 줄 위에 // 출처: 주석)
   생성형 AI 사용 기록: 없음 / 있으면 README.md의 생성형 AI 사용 내역에 */

// board.js : 상영 중 목록 불러오기(기본형)
async function loadNowPlaying() {
  const board = document.getElementById("board");
  setState(board, "loading", "영화 목록을 불러오는 중입니다.");
  try {
    const data = await fetchJSON(tmdbUrl("movie/now_playing", { region: "KR" }));
    setState(board, "done", "");
    renderCards(data.results.map(toMovie));   // 0건이면 #3의 빈 결과 문구
  } catch (err) {
    setState(board, "error", "목록을 불러오지 못했습니다(" + err.message + ")");
  }
}
loadNowPlaying();

// TODO 필수 1: 이 renderCards를 #3의 renderCards로 바꾸기(평점 배지, 대체 표지, ♥ 버튼. 맨 아래 바꿔야 하는 4 곳)
// renderCards : 영화 배열 ⇒ 보드에 간단한 카드를 그림(반환값 없음). #3의 renderCards로 바꿀 자리입니다
function renderCards(list) {
  const board = document.getElementById("board");
  let html = "";
  for (const m of list) {
    // 포스터가 없으면 대체 표지(제목 첫 글자)
    let poster = `<div class="poster-fallback">${escapeHTML(m.title[0])}</div>`;
    if (m.poster !== null) {
      poster = `<img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${escapeHTML(m.title)} 포스터">`;
    }
    // 평가가 하나도 없는 영화(평점 0)는 숫자 대신 "평점 없음"
    let rating = "평점 없음";
    if (m.rating > 0) {
      rating = m.rating.toFixed(1);
    }
    // 카드 전체가 상세로 가는 링크(detail.html?id=영화번호).
    // ♥ 버튼은 이 링크 안에 넣지 말고, #3처럼 <article> 카드와 location.href로 바꾼 뒤에 넣습니다
    html += `
      <a class="card" href="detail.html?id=${m.id}">
        ${poster}
        <span class="badge">${rating}</span>
        <h2>${escapeHTML(m.title)}</h2>
        <p class="year">${m.year || "개봉일 미정"}</p>
      </a>`;
  }
  board.innerHTML = html;
  if (list.length === 0) {
    setState(board, "empty", "조건에 맞는 영화가 없습니다.");
  }
}

// TODO 필수 2: 검색창에서 Enter를 치면 tmdbUrl("search/movie", { query: 검색어 })로 다시 불러와 그리기
// TODO 필수 3: #2의 sortBy와 #3의 getView로 정렬 2가지 이상(검색 결과에도 적용)
// TODO 필수 5: #3의 찜(보드 클릭 리스너 하나)을 loadLiked, saveLiked와 영화 id로 옮기고 찜 모두 지우기 버튼

/* 과제 #3 코드를 재사용할 때, 바꿔야 하는 4 곳(STARTER.md 7절과 같음)
   1. 데이터: movies 대신 data.results.map(toMovie)로 만든 배열
   2. 찜 키: "liked" 대신 loadLiked, saveLiked(키 final-liked, web-hw3의 찜과 섞이지 않게)
   3. 찜 기준: 제목 대신 id(data-title ⇒ data-id). 속성값은 문자열이라 Number()로 바꿔 m.id와 비교합니다.
   4. 상세: <dialog> 대신 detail.html?id=영화번호로 이동(카드 안의 링크나 location.href).
      openDetail의 그리기 코드는 detail.js로 가져와 movie/{id} 응답으로 채웁니다.
   #3 renderCards의 평점 배지를 그대로 쓰면 평점 0이 "0"으로 보이니 위 카드처럼 "평점 없음"으로 바꿉니다. */
