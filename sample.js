// sample.js : 키 없이 보는 샘플(가상 영화 12편과 그 박스오피스). 고치지 않습니다.
// 샘플 모드에서는 common.js의 fetchJSON이 네트워크 대신 아래 함수의 결과를 돌려줍니다.
//   TMDB 주소: keys.js에 TMDB_KEY가 없거나 주소에 ?sample=1 ⇒ sampleTMDB(주소)
//   KOBIS 주소: keys.js에 KOBIS_KEY가 없거나 주소에 ?sample=1 ⇒ sampleKOBIS(주소)
// 영화와 줄거리는 모두 지어낸 것이고, 포스터가 없어 대체 표지로 보입니다.

const SAMPLE_MOVIES = [
  { id: 9000001, title: "별빛 정류장", original_title: "Starlight Stop", release_date: "2026-11-05",
    vote_average: 8.6, vote_count: 412, popularity: 88.4, genre_ids: [18, 10749], runtime: 118,
    tagline: "마지막 버스가 떠나기 전에",
    overview: "시골 정류장에서 매일 같은 시각에 마주치는 두 사람이 있다. 막차가 끊기던 날, 두 사람은 처음으로 말을 건넨다." },
  { id: 9000002, title: "배달왕 2: 마지막 배송", original_title: "Delivery King 2", release_date: "2026-10-29",
    vote_average: 7.4, vote_count: 1288, popularity: 152.7, genre_ids: [28, 35], runtime: 112,
    tagline: "배송 완료까지 단 하루",
    overview: "은퇴를 앞둔 배달왕 두식이 마지막 배송에 나선다. 그런데 상자 안에 든 물건이 아무래도 수상하다." },
  { id: 9000003, title: "소금 & 설탕", original_title: "Salt & Sugar", release_date: "2026-10-22",
    vote_average: 6.8, vote_count: 356, popularity: 61.2, genre_ids: [35, 10749], runtime: 104,
    tagline: "맛있는 건 늘 반반",
    overview: "동네 분식집을 물려받은 남매가 맛집 방송 출연을 두고 다툰다. 가게를 살릴 비법은 할머니의 낡은 공책에 있다." },
  { id: 9000004, title: "달빛 DJ", original_title: "Moonlight DJ", release_date: "2026-11-12",
    vote_average: 7.9, vote_count: 640, popularity: 97.5, genre_ids: [10402, 18], runtime: 121,
    tagline: "새벽 두 시, 당신의 신청곡은",
    overview: "새벽 라디오를 진행하는 무명 DJ에게 매일 같은 사연이 도착한다. 사연을 보낸 사람을 찾아 나선 그는 잊고 있던 노래를 다시 듣게 된다." },
  { id: 9000005, title: "검은 숲의 비밀", original_title: "Secret of the Black Forest", release_date: "2026-09-17",
    vote_average: 6.3, vote_count: 905, popularity: 74.9, genre_ids: [27, 9648], runtime: 98,
    tagline: "들어간 사람은 있어도 나온 사람은 없다",
    overview: "캠핑을 떠난 대학생 다섯 명이 지도에 없는 숲길로 들어선다. 휴대폰이 꺼진 뒤부터 이상한 일이 하나씩 벌어진다." },
  { id: 9000006, title: "우주 정비공", original_title: "Space Mechanic", release_date: "2026-08-06",
    vote_average: 8.1, vote_count: 2210, popularity: 133.0, genre_ids: [878, 12], runtime: 135,
    tagline: "고장 난 건 우주선만이 아니었다",
    overview: "달 기지의 정비공 한별은 귀환선이 고장 나 혼자 남겨진다. 남은 산소는 30일, 그는 고물 부품으로 새 엔진을 만들기 시작한다." },
  { id: 9000007, title: "고양이 탐정 나비", original_title: "Detective Cat Nabi", release_date: "2026-07-23",
    vote_average: 7.1, vote_count: 518, popularity: 58.3, genre_ids: [16, 10751, 9648], runtime: 92,
    tagline: "냄새는 거짓말을 하지 않는다",
    overview: "골목 고양이 나비는 사라진 생선가게 열쇠를 찾아 나선다. 동네 고양이들이 남긴 단서를 따라가면 범인은 뜻밖의 곳에 있다." },
  { id: 9000008, title: "그 여름의 하숙집", original_title: "The Boarding House That Summer", release_date: "2026-06-04",
    vote_average: 8.9, vote_count: 3120, popularity: 120.6, genre_ids: [18, 36], runtime: 141,
    tagline: "그해 여름을 기억하는 사람들",
    overview: "오래전 여름, 한 하숙집에 모인 청년들의 이야기. 서로 다른 꿈을 가진 그들은 뜨거운 계절을 함께 지난다." },
  { id: 9000009, title: "열세 번째 증인", original_title: "The Thirteenth Witness", release_date: "2025-12-24",
    vote_average: 5.6, vote_count: 271, popularity: 44.1, genre_ids: [80, 53, 9648], runtime: 109,
    tagline: "모두가 같은 말을 할 때",
    overview: "한 사건의 재판에서 증인 열두 명이 모두 같은 말을 한다. 신참 변호사는 아무도 찾지 않던 열세 번째 증인을 찾아 나선다." },
  { id: 9000010, title: "할머니의 김장", original_title: "Grandma's Kimchi", release_date: "2025-11-27",
    vote_average: 7.7, vote_count: 199, popularity: 21.8, genre_ids: [99, 10751], runtime: 84,
    tagline: "올해도 300포기",
    overview: "해마다 겨울이면 김치 300포기를 담그는 할머니와 그 김치를 기다리는 가족들을 1년 동안 담은 다큐멘터리." },
  { id: 9000011, title: "번개 소년", original_title: "Lightning Boy", release_date: "",
    vote_average: 5.2, vote_count: 48, popularity: 15.4, genre_ids: [28, 14, 10751], runtime: 101,
    tagline: "느린 아이, 빠른 마음",
    overview: "달리기만 하면 꼴찌인 준이가 번개를 맞은 뒤 누구보다 빨라진다. 하지만 빨라진 다리보다 어려운 건 친구를 사귀는 일이었다." },
  { id: 9000012, title: "눈의 나라 기차", original_title: "Train to the Snow Country", release_date: "2026-01-15",
    vote_average: 6.0, vote_count: 733, popularity: 66.7, genre_ids: [12, 16, 14], runtime: 96,
    tagline: "종점은 겨울이 끝나는 곳",
    overview: "눈이 그치지 않는 나라로 가는 기차에 우연히 오른 남매. 기차가 멈출 때마다 새로운 마을과 수상한 승객들을 만난다." }
];

// sampleTMDB : TMDB 요청 주소 ⇒ TMDB와 같은 모양의 가상 응답 객체
// 흉내 내는 경로: movie/now_playing, search/movie, movie/{id}, discover/movie. 그 밖의 경로는 빈 목록
function sampleTMDB(url) {
  // TMDB 장르 번호와 한국어 이름(실제 TMDB와 같은 번호)
  const genreNames = {
    12: "모험", 14: "판타지", 16: "애니메이션", 18: "드라마", 27: "공포", 28: "액션",
    35: "코미디", 36: "역사", 53: "스릴러", 80: "범죄", 99: "다큐멘터리", 878: "SF",
    9648: "미스터리", 10402: "음악", 10749: "로맨스", 10751: "가족"
  };
  const parts = url.split("?");
  const path = parts[0].replace("https://api.themoviedb.org/3/", "");   // 예: "movie/now_playing"
  const params = new URLSearchParams(parts[1] || "");
  const pageNo = Number(params.get("page")) || 1;

  // 목록에 들어가는 영화 한 편(TMDB 목록 응답과 같은 이름들)
  function listItem(m) {
    return {
      adult: false, backdrop_path: null, genre_ids: m.genre_ids, id: m.id,
      original_language: "ko", original_title: m.original_title, overview: m.overview,
      popularity: m.popularity, poster_path: null, release_date: m.release_date,
      title: m.title, video: false, vote_average: m.vote_average, vote_count: m.vote_count
    };
  }
  // 목록 응답(page, results, total_pages, total_results). TMDB는 한 쪽에 20편이라 2쪽부터는 빈 목록
  function listPage(list) {
    const shown = pageNo === 1 ? list : [];
    return {
      page: pageNo,
      results: shown.map(listItem),
      total_pages: Math.ceil(list.length / 20),
      total_results: list.length
    };
  }

  let result;
  const step = path.split("/");                                       // 예: ["movie", "9000001"]
  if (path === "movie/now_playing") {
    result = listPage(SAMPLE_MOVIES);
    result.dates = { maximum: "2026-11-20", minimum: "2026-10-09" };
  } else if (path === "search/movie") {
    // 제목에 검색어가 든 영화만(대소문자, 앞뒤 공백 무시). 검색어가 비면 TMDB처럼 0건
    const word = (params.get("query") || "").trim().toLowerCase();
    result = listPage(SAMPLE_MOVIES.filter(m => word !== "" && m.title.toLowerCase().includes(word)));
  } else if (path === "discover/movie") {
    // with_genres: 쉼표(,)는 모두 가진 영화, 세로줄(|)은 하나라도 가진 영화(TMDB 규칙). 정렬 값은 무시
    let list = SAMPLE_MOVIES;
    const genres = params.get("with_genres");
    if (genres) {
      const anyOne = genres.includes("|");
      const wanted = genres.split(anyOne ? "|" : ",").map(Number);
      list = list.filter(function (m) {
        const found = wanted.filter(g => m.genre_ids.includes(g)).length;
        return anyOne ? found > 0 : found === wanted.length;
      });
    }
    result = listPage(list);
  } else if (step.length === 2 && step[0] === "movie" && !["popular", "top_rated", "upcoming", "latest"].includes(step[1])) {
    // movie/{id}: 상세 한 편(목록에 없던 genres, runtime, tagline, status가 더해짐)
    const m = SAMPLE_MOVIES.find(x => x.id === Number(step[1]));
    if (!m) {
      return { success: false, status_code: 34, status_message: "The resource you requested could not be found." };
    }
    const genres = m.genre_ids.map(function (g) {
      return { id: g, name: genreNames[g] };                          // 상세에는 genre_ids 대신 genres
    });
    result = {
      adult: false, backdrop_path: null, genres: genres, id: m.id, original_language: "ko",
      original_title: m.original_title, overview: m.overview, popularity: m.popularity,
      poster_path: null, release_date: m.release_date, runtime: m.runtime,
      status: m.release_date ? "Released" : "Post Production", tagline: m.tagline,
      title: m.title, video: false, vote_average: m.vote_average, vote_count: m.vote_count
    };
  } else {
    result = { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return JSON.parse(JSON.stringify(result));                          // 실제 응답처럼 늘 새 객체로
}

// sampleKOBIS : KOBIS 요청 주소 ⇒ KOBIS와 같은 모양의 가상 응답 객체(숫자도 KOBIS처럼 글자)
// 흉내 내는 경로: boxoffice/searchDailyBoxOfficeList(일별 박스오피스 10편). 그 밖의 경로는 KOBIS 오류 모양
function sampleKOBIS(url) {
  const parts = url.split("?");
  const path = parts[0].replace("https://www.kobis.or.kr/kobisopenapi/webservice/rest/", "");
  const params = new URLSearchParams(parts[1] || "");
  if (path !== "boxoffice/searchDailyBoxOfficeList.json") {
    return { faultInfo: { message: "샘플 모드에서는 일별 박스오피스만 흉내 냅니다", errorCode: "SAMPLE" } };
  }
  const day = params.get("targetDt") || "";
  if (day.length !== 8 || isNaN(day)) {
    return { faultInfo: { message: "targetDt(날짜 YYYYMMDD) 값이 없습니다(예: targetDt: yesterday())", errorCode: "SAMPLE" } };
  }
  // 가상 순위: [영화 id, 순위 변동, 새로 들어옴 여부, 그날 관객, 누적 관객, 스크린 수]
  const chart = [
    [9000004, 0, "NEW", 152340, 168902, 1320],
    [9000001, -1, "OLD", 98765, 1234567, 1105],
    [9000002, -1, "OLD", 61200, 2875430, 890],
    [9000003, -1, "OLD", 35870, 1502336, 712],
    [9000005, 1, "OLD", 21045, 3301258, 455],
    [9000008, -2, "OLD", 12880, 5120994, 301],
    [9000006, -2, "OLD", 9410, 4087213, 260],
    [9000007, -1, "OLD", 7302, 1876540, 198],
    [9000012, 0, "OLD", 3120, 987021, 88],
    [9000009, -2, "OLD", 1580, 412377, 45]
  ];
  let list = chart.map(function (row, i) {
    const m = SAMPLE_MOVIES.find(x => x.id === row[0]);
    return {
      rank: String(i + 1), rankInten: String(row[1]), rankOldAndNew: row[2],
      movieCd: m.release_date.slice(0, 4) + String(m.id).slice(-4), movieNm: m.title, openDt: m.release_date,
      audiCnt: String(row[3]), audiAcc: String(row[4]), scrnCnt: String(row[5])
    };
  });
  // KOBIS처럼 오늘과 그 뒤의 날짜는 아직 집계 전이라 빈 목록
  const now = new Date();
  const today = String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0");
  if (day >= today) {
    list = [];
  }
  return { boxOfficeResult: { boxofficeType: "일별 박스오피스", showRange: day + "~" + day, dailyBoxOfficeList: list } };
}
