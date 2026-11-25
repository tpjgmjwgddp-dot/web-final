/* 페이지: 상세(detail.html)   만든 사람: 이름(GitHub 아이디)
   맡은 기능: 필수 4 상세(두 번째 호출, 목록에 없던 정보 2개)
   수업 밖 문법: 없음(있으면 그 줄 위에 // 출처: 주석)
   생성형 AI 사용 기록: 없음 / 있으면 README.md의 생성형 AI 사용 내역에 */

// detail.js : 주소의 id로 영화 한 편 불러오기(두 번째 호출, board.js의 기본형과 같은 짜임)
async function loadDetail() {
  const detail = document.getElementById("detail");
  const id = getParam("id");   // detail.html?id=영화번호 의 번호(글자)
  if (!id) {
    setState(detail, "error", "영화 번호가 없습니다(보드에서 카드를 눌러 들어오세요)");
    return;
  }
  setState(detail, "loading", "영화 정보를 불러오는 중입니다.");
  try {
    const data = await fetchJSON(tmdbUrl("movie/" + id));
    setState(detail, "done", "");
    const movie = toMovie(data);   // #3 영화 객체 모양(title, poster, rating, overview 등)
    document.title = movie.title;  // 브라우저 탭 제목
    // 포스터가 없으면 대체 표지(제목 첫 글자)
    let poster = `<div class="poster-fallback">${escapeHTML(movie.title[0])}</div>`;
    if (movie.poster !== null) {
      poster = `<img class="poster" src="${posterUrl(movie.poster, "w342")}" alt="${escapeHTML(movie.title)} 포스터">`;
    }
    detail.innerHTML = `
      ${poster}
      <div class="info">
        <h1>${escapeHTML(movie.title)}</h1>
      </div>`;
    // TODO 필수 4: 목록에 없던 정보 2개 이상을 여기에(장르, 상영시간 등). 응답 data의 genres, runtime, tagline 등을 씁니다
  } catch (err) {
    setState(detail, "error", "영화 정보를 불러오지 못했습니다(" + err.message + ")");
  }
}
loadDetail();
