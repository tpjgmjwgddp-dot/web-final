/* 페이지: 박스오피스(boxoffice.html)   만든 사람: 이름(GitHub 아이디)
   맡은 기능: 필수 6 KOBIS 박스오피스 + TMDB 영화 포스터 매칭
   수업 밖 문법: 없음(있으면 그 줄 위에 // 출처: 주석)
   생성형 AI 사용 기록: 없음 / 있으면 README.md의 생성형 AI 사용 내역에 */

// boxoffice.js : KOBIS 어제 박스오피스 불러오기(board.js의 기본형과 같은 짜임)
async function loadBoxOffice() {
  const list = document.getElementById("boxoffice");
  setState(list, "loading", "어제 박스오피스를 불러오는 중입니다.");
  try {
    const data = await fetchJSON(kobisUrl("boxoffice/searchDailyBoxOfficeList", { targetDt: yesterday() }));
    setState(list, "done", "");
    renderBoxOffice(data.boxOfficeResult.dailyBoxOfficeList);   // KOBIS 응답 경로
  } catch (err) {
    setState(list, "error", "박스오피스를 불러오지 못했습니다(" + err.message + ")");
  }
}
loadBoxOffice();

// renderBoxOffice : KOBIS 박스오피스 배열 ⇒ 순위 목록을 그림(반환값 없음)
// KOBIS는 숫자도 글자로 줍니다("152340"). 계산하거나 쉼표를 넣을 때는 Number()로 바꿉니다.
function renderBoxOffice(movies) {
  const list = document.getElementById("boxoffice");
  let html = "";
  for (const m of movies) {
    html += `
      <li class="bo-item">
        <span class="bo-rank">${escapeHTML(m.rank)}</span>
        <div class="bo-poster"><div class="poster-fallback">${escapeHTML(m.movieNm[0])}</div></div>
        <div class="bo-info">
          <h2>${escapeHTML(m.movieNm)}</h2>
          <p>개봉 ${escapeHTML(m.openDt.trim() || "정보 없음")}</p>
          <p>누적 관객 ${formatNumber(m.audiAcc)}명(어제 ${formatNumber(m.audiCnt)}명)</p>
          <p class="bo-change">순위 변동 ${changeText(m)}</p>
        </div>
      </li>`;
  }
  list.innerHTML = html;
  if (movies.length === 0) {
    setState(list, "empty", "어제 박스오피스 자료가 없습니다.");
  }
  // TODO 필수 6: TMDB 영화 포스터 매칭을 만들어 여기서 부르기(파일 끝의 4단계 주석)
}

// formatNumber : 숫자(글자도 됨) ⇒ 천 단위 쉼표 글자(#2, #3과 같음)
function formatNumber(n) {
  return Number(n).toLocaleString("ko-KR");
}

// changeText : 박스오피스 영화 한 편 ⇒ 순위 변동 글자(새로 들어옴 NEW, 올라감 ▲, 내려감 ▼, 그대로 -)
function changeText(m) {
  if (m.rankOldAndNew === "NEW") {
    return "NEW";
  }
  const n = Number(m.rankInten);     // 어제보다 몇 계단 올랐나("2" 올라감, "-1" 내려감, "0" 그대로)
  if (n > 0) {
    return "▲ " + n;
  }
  if (n < 0) {
    return "▼ " + (-n);
  }
  return "-";
}

/* TMDB 영화 포스터 매칭(필수 6, 여러분이 만듭니다): 영화마다 4단계
   1. 찾기: 영화명으로 TMDB를 검색합니다. fetchJSON(tmdbUrl("search/movie", { query: m.movieNm }))
   2. 고르기: 응답 data.results의 첫 결과에서 poster_path를 꺼냅니다.
   3. 확인: 개봉 연도가 같은지 봅니다(m.openDt.slice(0, 4)와 release_date.slice(0, 4)). 다르면 다음 결과를 보거나 포기합니다.
   4. 넣기: 찾으면 그 영화의 .bo-poster 안을 <img class="poster" src="posterUrl(poster_path, "w342")">로 바꾸고,
      못 찾으면(0건, poster_path가 null, 오류) 대체 표지를 그대로 둡니다.
   주의: 영화가 10편이라 TMDB 요청도 10번입니다. for...of 안에서 한 편씩 await해도 됩니다
   (Promise.all로 한꺼번에 하는 방법은 수업 밖 문법이라 쓰면 출처 주석).
   샘플 모드에서는 가상 영화라 포스터가 없어 모두 대체 표지로 남습니다(키를 넣으면 실제 포스터). */
