const dinners = [
  {
    name: "김치나베 돈카츠",
    description:
      "바삭한 튀김이랑 뜨거운 김치 국물이 같이 와서 지친 날에 딱 좋아.",
    mood: "comfort",
    hunger: "heavy",
    budget: "mid",
    context: "solo",
    effort: "normal",
    taste: "rice",
    reason: "기름진 만족감이랑 칼칼한 국물이 동시에 필요할 때 잘 맞아.",
    drink: "시원한 맥주나 제로콜라",
    calories: 850,
    calorieLevel: 4,
    calorieComment: "튀김이랑 국물이 같이 와서 오늘은 꽤 묵직한 편이야.",
    verdict: "든든함은 확실한데 늦게 먹으면 내일 아침 얼굴이 살짝 부을 수 있어.",
    caution: "국물이 짤 수 있으니까 밥은 조금 남겨두고 조절해.",
    ritual: "첫 입은 제일 바삭한 조각부터 먹고, 뒤에는 국물에 적셔 먹어봐.",
    home: "냉동 돈카츠랑 김치찌개 베이스만 있어도 꽤 그럴듯해.",
    out: "튀김 회전 빠른 집이면 실패 확률이 낮아.",
  },
  {
    name: "들깨칼국수",
    description:
      "고소한 국물과 부드러운 면이 늦은 저녁 긴장을 풀어줘.",
    mood: "comfort",
    hunger: "steady",
    budget: "low",
    context: "solo",
    effort: "normal",
    taste: "noodle",
    reason: "자극보다 따뜻함이 필요한 날에 몸이 편해.",
    drink: "막걸리 한 잔이나 보리차",
    calories: 620,
    calorieLevel: 3,
    calorieComment: "면이라 탄수화물은 있지만 튀김류보단 부담이 덜해.",
    verdict: "속은 편한데 국물까지 다 마시면 나트륨 때문에 다음 날 조금 부을 수 있어.",
    caution: "국물이 너무 진하면 금방 물릴 수 있어. 김치 맛있는 곳으로 가.",
    ritual: "국물 먼저 두 숟갈 먹고 면을 섞으면 고소함이 확 살아나.",
    home: "칼국수면에 들깨가루, 버섯, 애호박만 넣어도 충분해.",
    out: "회전 빠른 동네 칼국수집이면 면 식감이 안정적이야.",
  },
  {
    name: "연어 포케",
    description:
      "가벼운데 허전하지 않고, 재료 조합하는 재미가 있어.",
    mood: "fresh",
    hunger: "light",
    budget: "mid",
    context: "solo",
    effort: "quick",
    taste: "vegetable",
    reason: "가볍게 먹고 싶은데 대충 때운 느낌은 싫을 때 좋아.",
    drink: "탄산수나 드라이 화이트와인",
    calories: 520,
    calorieLevel: 2,
    calorieComment: "밥 양만 조절하면 꽤 가벼운 축에 들어가.",
    verdict: "내일 몸이 무겁진 않을 거야. 대신 배고픈 날엔 밤에 간식 생각날 수 있어.",
    caution: "소스 많이 넣으면 산뜻함이 죽어. 처음엔 절반만 넣어.",
    ritual: "처음엔 재료별로 먹고, 중간부터 소스를 섞어봐.",
    home: "훈제연어, 샐러드 채소, 현미밥, 간장 소스면 금방 만들어.",
    out: "배달이면 소스 분리 요청해. 채소 식감이 훨씬 오래가.",
  },
  {
    name: "마라샹궈",
    description:
      "강한 향과 씹는 재미가 있어서 생각 끊고 먹기 좋아.",
    mood: "spicy",
    hunger: "heavy",
    budget: "mid",
    context: "group",
    effort: "normal",
    taste: "protein",
    reason: "자극적인 맛이랑 고르는 재미가 필요할 때 몰입감이 커.",
    drink: "차가운 맥주나 무가당 우롱차",
    calories: 980,
    calorieLevel: 5,
    calorieComment: "기름, 소스, 당면이 붙으면 칼로리가 빠르게 올라가.",
    verdict: "스트레스는 풀리는데 내일 얼굴 붓기랑 속 쓰림은 감수해야 해.",
    caution: "늦은 밤이면 맵기랑 기름 단계를 낮춰. 다음 날 덜 힘들어.",
    ritual: "채소, 고기, 면 순서로 먹으면 기름진 맛이 천천히 올라와.",
    home: "마라 소스에 숙주, 청경채, 소고기, 넓적당면 넣으면 끝이야.",
    out: "무게 계산이니까 물기 많은 재료는 적당히 담아.",
  },
  {
    name: "삼겹살과 구운 김치",
    description:
      "대화가 필요한 저녁에 제일 강한 카드야. 굽는 시간이 분위기를 만들어.",
    mood: "special",
    hunger: "heavy",
    budget: "high",
    context: "group",
    effort: "slow",
    taste: "protein",
    reason: "누군가랑 하루를 정리하고 싶을 때 식탁 리듬이 생겨.",
    drink: "소주, 라거 맥주, 탄산수",
    calories: 1100,
    calorieLevel: 5,
    calorieComment: "고기 양이 늘면 바로 고칼로리야. 쌈 비율을 올리면 조금 낫고.",
    verdict: "만족감은 최상인데 술까지 붙으면 다이어트는 오늘 쉬는 날이라고 봐.",
    caution: "너무 배고픈 상태로 가면 굽는 시간이 길게 느껴져.",
    ritual: "첫 점은 소금만 찍고, 두 번째부터 김치랑 쌈으로 가.",
    home: "두꺼운 팬이나 에어프라이어 쓰면 기름 튐을 줄일 수 있어.",
    out: "환기 좋고 불판 빨리 바꿔주는 곳이 만족도 높아.",
  },
  {
    name: "새우 토마토 파스타",
    description:
      "특별한데 과하지 않아. 둘이 먹기 좋은 안전한 선택이야.",
    mood: "special",
    hunger: "steady",
    budget: "high",
    context: "date",
    effort: "slow",
    taste: "noodle",
    reason: "분위기는 내고 싶은데 무거운 코스는 부담스러울 때 좋아.",
    drink: "화이트와인이나 탄산수",
    calories: 760,
    calorieLevel: 3,
    calorieComment: "오일과 면이 있어서 가볍진 않지만 크림보단 덜 무거워.",
    verdict: "데이트 전후로도 무난해. 마늘 향만 강한 집이면 대화 전에 물 챙겨.",
    caution: "크림 메뉴랑 같이 시키면 전체가 좀 무거워질 수 있어.",
    ritual: "새우 먼저 먹고, 남은 소스는 빵으로 가볍게 정리해.",
    home: "홀토마토, 냉동 새우, 마늘, 올리브오일이면 충분히 맛 나.",
    out: "리뷰에서 면이 안 불었다는 말이 있는지 보면 좋아.",
  },
  {
    name: "순두부찌개 정식",
    description:
      "뜨거운 국물, 순두부, 계란, 밥이 한 번에 와서 실패 확률이 낮아.",
    mood: "comfort",
    hunger: "steady",
    budget: "low",
    context: "solo",
    effort: "quick",
    taste: "rice",
    reason: "머리 복잡한 날에도 주문이 쉽고 먹기 편해.",
    drink: "차가운 보리차나 소주 한 잔",
    calories: 650,
    calorieLevel: 3,
    calorieComment: "밥 한 공기까지 먹으면 중간 이상이야. 그래도 튀김보단 낫다.",
    verdict: "속은 따뜻해지는데 국물 다 마시면 붓기 가능성 있어. 소개팅 전날엔 국물 적당히.",
    caution: "너무 맵게 가면 순두부의 부드러움이 사라져.",
    ritual: "계란 바로 풀지 말고 살짝 익힌 뒤 밥 위에 얹어봐.",
    home: "순두부, 찌개 양념, 대파, 계란만 있으면 10분 컷이야.",
    out: "반찬이 과하지 않은 집이면 찌개 맛이 더 또렷해.",
  },
  {
    name: "반미 샌드위치",
    description:
      "바삭한 빵, 새콤한 채소, 짭짤한 고기가 한 번에 와.",
    mood: "fresh",
    hunger: "steady",
    budget: "low",
    context: "delivery",
    effort: "quick",
    taste: "vegetable",
    reason: "밥은 부담스럽고, 대충 때우긴 싫을 때 딱 맞아.",
    drink: "라임 탄산수나 가벼운 라거",
    calories: 560,
    calorieLevel: 2,
    calorieComment: "빵 메뉴치고는 채소가 있어서 부담이 낮은 편이야.",
    verdict: "가볍게 기분 전환하기 좋아. 감자튀김 추가하면 바로 다른 게임이 돼.",
    caution: "배달 거리가 길면 빵이 눅눅해져. 가까운 매장으로 가.",
    ritual: "반으로 잘라서 첫 절반은 그대로, 나머지는 칠리소스 살짝 더해.",
    home: "바게트에 불고기, 피클 채소, 마요 넣으면 비슷한 재미가 나.",
    out: "고수랑 소스 선택 가능한 곳이면 취향 맞추기 쉬워.",
  },
  {
    name: "제육덮밥",
    description:
      "달고 매운 양념이랑 밥 조합이 확실해서 빠르게 만족스러워.",
    mood: "spicy",
    hunger: "heavy",
    budget: "low",
    context: "solo",
    effort: "quick",
    taste: "rice",
    reason: "고민할 시간 없이 힘 채워야 할 때 목적이 분명해.",
    drink: "제로콜라나 차가운 보리차",
    calories: 820,
    calorieLevel: 4,
    calorieComment: "양념이랑 밥이 강해서 생각보다 칼로리가 높아.",
    verdict: "에너지는 확 차는데 양념 때문에 물이 계속 당길 수 있어. 야식으론 무거워.",
    caution: "양념이 과하면 텁텁해. 채소가 좀 있는 곳이 좋아.",
    ritual: "처음엔 고기랑 밥 따로 먹고, 중간부터 노른자 터뜨려 섞어.",
    home: "앞다리살, 고추장, 간장, 설탕, 양파면 냉장고 털기 가능해.",
    out: "기사식당이나 백반집처럼 밥이 안정적인 곳이 강해.",
  },
  {
    name: "초밥 세트",
    description:
      "가벼운 포만감이랑 작은 사치가 같이 와서 하루 마무리 느낌이 나.",
    mood: "special",
    hunger: "light",
    budget: "high",
    context: "date",
    effort: "normal",
    taste: "protein",
    reason: "기름진 메뉴 말고 깔끔하게 기분 내고 싶을 때 좋아.",
    drink: "사케, 샴페인, 드라이 화이트와인",
    calories: 620,
    calorieLevel: 3,
    calorieComment: "깔끔해 보여도 밥이 있어서 세트로 먹으면 중간 정도야.",
    verdict: "얼굴 붓기 걱정은 비교적 덜해. 많이 배고픈 날엔 먹고 나서 허전할 수 있어.",
    caution: "많이 배고프면 우동이나 후토마키를 같이 봐.",
    ritual: "흰살 생선부터 시작해서 진한 생선, 마지막은 계란으로 정리해.",
    home: "마트 초밥도 접시에 옮기고 미소국 더하면 만족감 올라가.",
    out: "늦은 할인 초밥은 싸지만 밥 식감이 떨어질 수 있어.",
  },
  {
    name: "닭한마리",
    description:
      "맑은 국물, 닭고기, 칼국수 마무리까지 있어서 오래 먹기 좋아.",
    mood: "comfort",
    hunger: "heavy",
    budget: "mid",
    context: "group",
    effort: "slow",
    taste: "protein",
    reason: "자극보다 든든한 온기랑 같이 먹는 느낌이 필요할 때 좋아.",
    drink: "소주, 청주, 탄산수",
    calories: 900,
    calorieLevel: 4,
    calorieComment: "닭고기는 괜찮은데 칼국수 사리까지 가면 꽤 올라가.",
    verdict: "몸보신 느낌은 좋은데 국물과 사리를 끝까지 가면 다음 날 몸이 무거울 수 있어.",
    caution: "처음부터 양념장 많이 넣으면 맑은 국물 맛이 가려져.",
    ritual: "닭고기 먼저 양념장에 찍고, 마지막에 칼국수로 끝내.",
    home: "닭, 대파, 감자, 마늘 오래 끓이면 비슷한 국물이 나.",
    out: "국물 리필과 사리 추가 편한 집이면 여럿이 먹기 좋아.",
  },
  {
    name: "비빔국수와 만두",
    description:
      "새콤달콤한 면이랑 따뜻한 만두가 만나서 가벼운데 심심하지 않아.",
    mood: "fresh",
    hunger: "steady",
    budget: "low",
    context: "delivery",
    effort: "quick",
    taste: "noodle",
    reason: "입맛은 없는데 뭔가 확실히 먹고 싶을 때 산뜻하게 열어줘.",
    drink: "탄산수나 가벼운 맥주",
    calories: 700,
    calorieLevel: 3,
    calorieComment: "국수만 보면 가벼운데 만두가 붙으면 중간 이상이야.",
    verdict: "상큼해서 기분은 좋아져. 다만 매운 양념이면 늦은 밤 속이 예민할 수 있어.",
    caution: "소스가 미리 섞여 오면 면이 불어. 가능하면 분리 요청해.",
    ritual: "면 먼저 한 입 먹고, 만두를 소스에 살짝 찍어 먹어봐.",
    home: "소면, 초고추장, 참기름, 김가루만 있어도 금방 돼.",
    out: "분식집은 만두가 바로 찐 건지가 만족도를 좌우해.",
  },
];

const themeToggle = document.querySelector("#theme-toggle");
const randomBoxButton = document.querySelector("#random-box-button");
const randomBoxResult = document.querySelector("#random-box-result");
const pickButton = document.querySelector("#pick-button");
const saveButton = document.querySelector("#save-button");
const moodSelect = document.querySelector("#mood");
const hungerSelect = document.querySelector("#hunger");
const budgetSelect = document.querySelector("#budget");
const contextSelect = document.querySelector("#context");
const effortSelect = document.querySelector("#effort");
const tasteSelect = document.querySelector("#taste");
const quickPicks = document.querySelector("#quick-picks");
const savedList = document.querySelector("#saved-list");
const savedEmpty = document.querySelector("#saved-empty");
const matchCount = document.querySelector("#match-count");
const matchScore = document.querySelector("#match-score");
const commentForm = document.querySelector("#comment-form");
const commentAuthor = document.querySelector("#comment-author");
const commentMenu = document.querySelector("#comment-menu");
const commentBody = document.querySelector("#comment-body");
const commentList = document.querySelector("#comment-list");
const commentEmpty = document.querySelector("#comment-empty");
const commentCount = document.querySelector("#comment-count");
const commentSort = document.querySelector("#comment-sort");
const useCurrentMenuButton = document.querySelector("#use-current-menu");

const menuName = document.querySelector("#menu-name");
const menuDescription = document.querySelector("#menu-description");
const menuReason = document.querySelector("#menu-reason");
const menuDrink = document.querySelector("#menu-drink");
const menuCaution = document.querySelector("#menu-caution");
const menuRitual = document.querySelector("#menu-ritual");
const menuHome = document.querySelector("#menu-home");
const menuOut = document.querySelector("#menu-out");
const menuCalories = document.querySelector("#menu-calories");
const calorieComment = document.querySelector("#calorie-comment");
const menuVerdict = document.querySelector("#menu-verdict");
const calorieBars = [...document.querySelectorAll(".calorie-meter span")];

const COMMENT_STORAGE_KEY = "dinner-comments-v2";
const COMMENT_AUTHOR_KEY = "dinner-comment-author";
const SAVED_STORAGE_KEY = "dinner-saved-menus";
const THEME_STORAGE_KEY = "dinner-theme";
let currentMenu = dinners[0];
let lastMenuName = "";

const contextLabels = {
  solo: "혼밥",
  date: "둘이 먹기",
  group: "여럿이",
  delivery: "배달/포장",
};

function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || "dark";
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.dataset.theme = isLight ? "light" : "dark";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "다크 모드로 전환" : "라이트 모드로 전환"
  );
  themeToggle.querySelector(".theme-toggle__label").textContent = isLight
    ? "Dark"
    : "Light";
  document.documentElement.style.colorScheme = isLight ? "light" : "dark";
}

function saveTheme(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function getPreferenceValues() {
  return {
    mood: moodSelect.value,
    hunger: hungerSelect.value,
    budget: budgetSelect.value,
    context: contextSelect.value,
    effort: effortSelect.value,
    taste: tasteSelect.value,
  };
}

function scoreMenu(menu) {
  const preferences = getPreferenceValues();
  const fields = Object.keys(preferences);
  const activeFields = fields.filter((field) => preferences[field] !== "any");

  if (activeFields.length === 0) {
    return { score: 100, matched: fields.length, active: 0 };
  }

  const matched = activeFields.filter((field) => menu[field] === preferences[field]).length;
  const score = Math.round((matched / activeFields.length) * 100);
  return { score, matched, active: activeFields.length };
}

function getCandidates() {
  const ranked = dinners
    .map((menu) => ({ menu, ...scoreMenu(menu) }))
    .sort((a, b) => b.score - a.score || b.matched - a.matched);
  const topScore = ranked[0].score;
  return ranked.filter((item) => item.score === topScore);
}

function pickFromCandidates(candidates) {
  const options =
    candidates.length > 1
      ? candidates.filter((item) => item.menu.name !== lastMenuName)
      : candidates;
  return options[Math.floor(Math.random() * options.length)];
}

function renderMenu(item) {
  currentMenu = item.menu;
  lastMenuName = item.menu.name;
  menuName.textContent = item.menu.name;
  menuDescription.textContent = item.menu.description;
  menuReason.textContent = item.menu.reason;
  menuDrink.textContent = item.menu.drink;
  menuCaution.textContent = item.menu.caution;
  menuRitual.textContent = item.menu.ritual;
  menuHome.textContent = item.menu.home;
  menuOut.textContent = item.menu.out;
  menuCalories.textContent = `약 ${item.menu.calories.toLocaleString("ko-KR")}kcal`;
  calorieComment.textContent = item.menu.calorieComment;
  menuVerdict.textContent = item.menu.verdict;
  updateCalorieMeter(item.menu.calorieLevel);
  matchScore.textContent = `${item.score}%`;
  matchCount.textContent =
    item.active === 0
      ? "조건 고르면 더 잘 맞춰줄게."
      : `${item.active}개 중 ${item.matched}개 맞는 후보야.`;
}

function updateCalorieMeter(level) {
  calorieBars.forEach((bar, index) => {
    const isActive = index < level;
    bar.classList.toggle("is-active", isActive);
    bar.dataset.level = String(level);
  });
}

function pickDinner() {
  renderMenu(pickFromCandidates(getCandidates()));
}

function pickSurprise() {
  const menu = dinners[Math.floor(Math.random() * dinners.length)];
  renderMenu({ menu, score: 100, matched: 0, active: 0 });
  renderRandomBox(menu);
}

function spinRandomBox() {
  randomBoxResult.classList.add("is-spinning");
  randomBoxResult.innerHTML = "<span>돌리는 중</span><b>잠깐만, 메뉴 섞는 중</b>";

  window.setTimeout(() => {
    pickSurprise();
    randomBoxResult.classList.remove("is-spinning");
  }, 520);
}

function renderRandomBox(menu) {
  randomBoxResult.innerHTML = `
    <span>오늘은 이거</span>
    <b>${escapeHtml(menu.name)}</b>
    <p>${escapeHtml(menu.reason)}</p>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getContextLabel(context) {
  return contextLabels[context] || "상황 추천";
}

function renderQuickPicks() {
  quickPicks.innerHTML = dinners
    .map(
      (menu) => `
        <article class="quick-card">
          <div>
            <span class="quick-tag">${escapeHtml(getContextLabel(menu.context))}</span>
            <h3>${escapeHtml(menu.name)}</h3>
          </div>
          <p>${escapeHtml(menu.description)}</p>
          <dl>
            <div><dt>추천 이유</dt><dd>${escapeHtml(menu.reason)}</dd></div>
            <div><dt>음료</dt><dd>${escapeHtml(menu.drink)}</dd></div>
            <div><dt>칼로리</dt><dd>약 ${menu.calories.toLocaleString("ko-KR")}kcal</dd></div>
          </dl>
        </article>
      `
    )
    .join("");
}

function getStoredList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveStoredList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSavedMenus() {
  return getStoredList(SAVED_STORAGE_KEY);
}

function saveCurrentMenu() {
  const savedMenus = getSavedMenus();
  const exists = savedMenus.some((menu) => menu.name === currentMenu.name);
  const nextMenus = exists
    ? savedMenus
    : [
        {
          name: currentMenu.name,
          reason: currentMenu.reason,
          drink: currentMenu.drink,
          calories: currentMenu.calories,
          calorieLevel: currentMenu.calorieLevel,
          savedAt: Date.now(),
        },
        ...savedMenus,
      ].slice(0, 6);
  saveStoredList(SAVED_STORAGE_KEY, nextMenus);
  renderSavedMenus();
}

function deleteSavedMenu(name) {
  const nextMenus = getSavedMenus().filter((menu) => menu.name !== name);
  saveStoredList(SAVED_STORAGE_KEY, nextMenus);
  renderSavedMenus();
}

function renderSavedMenus() {
  const savedMenus = getSavedMenus();
  savedEmpty.hidden = savedMenus.length > 0;
  savedList.innerHTML = savedMenus
    .map(
      (menu) => `
        <article class="saved-card">
          <div>
            <h3>${escapeHtml(menu.name)}</h3>
            <p>${escapeHtml(menu.reason)}</p>
            <span>${escapeHtml(menu.drink || "음료는 취향대로")}</span>
            <em>약 ${Number(menu.calories || 0).toLocaleString("ko-KR")}kcal</em>
          </div>
          <button class="comment-chip" type="button" data-saved-delete="${escapeHtml(
            menu.name
          )}">삭제</button>
        </article>
      `
    )
    .join("");
}

function getStoredComments() {
  return getStoredList(COMMENT_STORAGE_KEY);
}

function saveComments(comments) {
  saveStoredList(COMMENT_STORAGE_KEY, comments);
}

function storeAuthor(name) {
  localStorage.setItem(COMMENT_AUTHOR_KEY, name);
}

function getStoredAuthor() {
  return localStorage.getItem(COMMENT_AUTHOR_KEY) || "";
}

function formatRelativeTime(timestamp) {
  const diffMinutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
}

function sortComments(comments) {
  const copy = [...comments];
  if (commentSort.value === "popular") {
    copy.sort((a, b) => b.likes - a.likes || b.createdAt - a.createdAt);
    return copy;
  }

  copy.sort((a, b) => b.createdAt - a.createdAt);
  return copy;
}

function renderComments() {
  const comments = sortComments(getStoredComments());
  commentCount.textContent = `${comments.length}개`;
  commentEmpty.hidden = comments.length > 0;

  commentList.innerHTML = comments
    .map((comment) => {
      const avatar = escapeHtml(comment.author.slice(0, 1).toUpperCase());
      const likedClass = comment.liked ? " is-active" : "";
      const menuTag = comment.menu
        ? `<span class="comment-menu-tag">${escapeHtml(comment.menu)}</span>`
        : "";

      return `
        <article class="comment-card" data-comment-id="${comment.id}">
          <div class="comment-card__top">
            <div class="comment-card__author">
              <div class="comment-avatar">${avatar}</div>
              <div>
                <div class="comment-name">${escapeHtml(comment.author)}</div>
                <div class="comment-time">${formatRelativeTime(comment.createdAt)}</div>
              </div>
            </div>
            ${menuTag}
          </div>
          <p class="comment-body">${escapeHtml(comment.body)}</p>
          <div class="comment-actions">
            <button class="comment-chip${likedClass}" type="button" data-action="like">
              만족 ${comment.likes}
            </button>
            <button class="comment-chip" type="button" data-action="delete">
              삭제
            </button>
          </div>
        </article>
      `;
    })
    .join("");
}

function updateComment(commentId, updater) {
  const nextComments = getStoredComments().map((comment) =>
    comment.id === commentId ? updater(comment) : comment
  );
  saveComments(nextComments);
  renderComments();
}

function deleteComment(commentId) {
  const nextComments = getStoredComments().filter((comment) => comment.id !== commentId);
  saveComments(nextComments);
  renderComments();
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);
  saveTheme(nextTheme);
});

pickButton.addEventListener("click", pickDinner);
randomBoxButton.addEventListener("click", spinRandomBox);
saveButton.addEventListener("click", saveCurrentMenu);
[moodSelect, hungerSelect, budgetSelect, contextSelect, effortSelect, tasteSelect].forEach(
  (select) => {
    select.addEventListener("change", pickDinner);
  }
);

savedList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-saved-delete]");
  if (!deleteButton) {
    return;
  }
  deleteSavedMenu(deleteButton.dataset.savedDelete);
});

commentSort.addEventListener("change", renderComments);

useCurrentMenuButton.addEventListener("click", () => {
  commentMenu.value = currentMenu.name;
  commentBody.focus();
});

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const author = commentAuthor.value.trim();
  const menu = commentMenu.value.trim();
  const body = commentBody.value.trim();

  if (!author || !body) {
    return;
  }

  const nextComment = {
    id: crypto.randomUUID(),
    author,
    menu,
    body,
    likes: 0,
    liked: false,
    createdAt: Date.now(),
  };

  const comments = getStoredComments();
  comments.push(nextComment);
  saveComments(comments);
  storeAuthor(author);
  commentForm.reset();
  commentAuthor.value = author;
  renderComments();
});

commentList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) {
    return;
  }

  const commentCard = actionButton.closest("[data-comment-id]");
  if (!commentCard) {
    return;
  }

  const commentId = commentCard.dataset.commentId;
  const action = actionButton.dataset.action;

  if (action === "like") {
    updateComment(commentId, (comment) => ({
      ...comment,
      liked: !comment.liked,
      likes: comment.liked ? Math.max(0, comment.likes - 1) : comment.likes + 1,
    }));
  }

  if (action === "delete") {
    deleteComment(commentId);
  }
});

applyTheme(getStoredTheme());
commentAuthor.value = getStoredAuthor();
renderQuickPicks();
renderSavedMenus();
pickDinner();
renderComments();
