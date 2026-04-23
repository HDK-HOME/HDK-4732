const dinners = [
  {
    name: "김치나베 돈카츠",
    description:
      "바삭한 튀김과 뜨거운 김치 국물이 같이 있어 지친 날에도 맛의 대비가 선명합니다.",
    mood: "comfort",
    hunger: "heavy",
    budget: "mid",
    context: "solo",
    effort: "normal",
    taste: "rice",
    reason: "기름진 만족감과 칼칼한 국물이 동시에 필요할 때 잘 맞습니다.",
    pairing: "양배추 샐러드, 단무지, 따뜻한 보리차",
    caution: "국물이 짤 수 있으니 밥 양을 조금 남겨두고 조절하세요.",
    ritual: "첫 입은 소스가 덜 밴 가장 바삭한 조각부터 먹고, 뒤에는 국물에 적셔 마무리하세요.",
    home: "냉동 돈카츠와 김치찌개 베이스만 있어도 구현하기 쉽습니다.",
    out: "튀김 회전율이 높은 점심·저녁 피크 직후 매장이 실패 확률이 낮습니다.",
  },
  {
    name: "들깨칼국수",
    description:
      "고소한 국물과 부드러운 면이 늦은 저녁의 긴장을 낮춰주는 메뉴입니다.",
    mood: "comfort",
    hunger: "steady",
    budget: "low",
    context: "solo",
    effort: "normal",
    taste: "noodle",
    reason: "자극보다 온기와 포만감이 필요한 날에 몸이 편합니다.",
    pairing: "겉절이, 오이무침, 차가운 물김치",
    caution: "국물이 진하면 금방 물릴 수 있어 김치가 맛있는 곳을 고르세요.",
    ritual: "국물을 먼저 두 숟갈 먹고 면을 섞으면 고소함이 더 크게 느껴집니다.",
    home: "시판 칼국수면에 들깨가루, 버섯, 애호박을 더하면 충분합니다.",
    out: "회전이 빠른 동네 칼국수집은 면 식감이 안정적인 편입니다.",
  },
  {
    name: "연어 포케",
    description:
      "가벼운데 허전하지 않고, 재료를 조합하는 재미가 있어 혼밥에도 만족도가 높습니다.",
    mood: "fresh",
    hunger: "light",
    budget: "mid",
    context: "solo",
    effort: "quick",
    taste: "vegetable",
    reason: "몸은 가볍게 두고 싶지만 대충 먹었다는 느낌은 피하고 싶을 때 좋습니다.",
    pairing: "아보카도, 현미밥, 와사비 간장, 미소국",
    caution: "소스가 많으면 산뜻함이 사라지니 처음에는 절반만 넣으세요.",
    ritual: "처음에는 재료별로 맛보고, 중간부터 소스를 섞어 한 그릇처럼 드세요.",
    home: "훈제연어, 샐러드 채소, 현미밥, 간장 소스만 있으면 빠르게 만들 수 있습니다.",
    out: "배달 시 소스 분리 요청을 하면 채소 식감이 훨씬 오래 갑니다.",
  },
  {
    name: "마라샹궈",
    description:
      "강한 향과 씹는 재료가 많아 생각을 끊고 기분 전환하기 좋은 저녁입니다.",
    mood: "spicy",
    hunger: "heavy",
    budget: "mid",
    context: "group",
    effort: "normal",
    taste: "protein",
    reason: "자극적인 맛과 선택의 재미가 필요할 때 몰입감이 큽니다.",
    pairing: "꿔바로우, 오이무침, 차가운 우롱차",
    caution: "늦은 밤에는 맵기와 기름 단계를 낮춰야 다음 날 부담이 적습니다.",
    ritual: "채소, 고기, 면 순서로 먹으면 기름진 맛이 천천히 올라옵니다.",
    home: "마라 소스에 숙주, 청경채, 소고기, 넓적당면을 넣으면 충분합니다.",
    out: "재료 가격이 무게로 계산되므로 물기 많은 재료는 적당히 담는 편이 좋습니다.",
  },
  {
    name: "삼겹살과 구운 김치",
    description:
      "대화가 필요한 저녁에 가장 강한 메뉴입니다. 굽는 시간이 자연스럽게 분위기를 만듭니다.",
    mood: "special",
    hunger: "heavy",
    budget: "high",
    context: "group",
    effort: "slow",
    taste: "protein",
    reason: "누군가와 하루를 정리하고 싶을 때 식탁의 리듬이 생깁니다.",
    pairing: "쌈채소, 구운 마늘, 파절이, 된장찌개",
    caution: "너무 배고픈 상태로 가면 굽는 시간이 길게 느껴질 수 있습니다.",
    ritual: "첫 점은 소금만 찍어 먹고, 두 번째부터 김치와 쌈을 조합하세요.",
    home: "팬보다 두꺼운 무쇠팬이나 에어프라이어를 쓰면 기름 튐을 줄일 수 있습니다.",
    out: "환기가 잘 되고 불판 교체가 빠른 곳이 식사 만족도를 크게 좌우합니다.",
  },
  {
    name: "새우 토마토 파스타",
    description:
      "특별하지만 과하지 않고, 산미와 감칠맛이 있어 둘이 먹기 좋은 안정적인 선택입니다.",
    mood: "special",
    hunger: "steady",
    budget: "high",
    context: "date",
    effort: "slow",
    taste: "noodle",
    reason: "분위기를 내고 싶지만 무거운 코스는 부담스러운 날에 어울립니다.",
    pairing: "루콜라 샐러드, 바게트, 탄산수",
    caution: "크림 메뉴와 같이 시키면 전체 식사가 무거워질 수 있습니다.",
    ritual: "새우를 먼저 맛보고, 남은 소스는 빵으로 가볍게 정리하세요.",
    home: "홀토마토, 냉동 새우, 마늘, 올리브오일만 있어도 충분히 깊은 맛이 납니다.",
    out: "면 삶기가 안정적인 곳인지 리뷰에서 '알덴테'보다 '불지 않음' 표현을 확인하세요.",
  },
  {
    name: "순두부찌개 정식",
    description:
      "뜨겁고 부드러운 국물, 계란, 밥이 한 번에 들어와 실패 확률이 낮은 저녁입니다.",
    mood: "comfort",
    hunger: "steady",
    budget: "low",
    context: "solo",
    effort: "quick",
    taste: "rice",
    reason: "머리가 복잡한 날에도 주문과 식사가 단순해서 좋습니다.",
    pairing: "계란말이, 김, 콩나물무침",
    caution: "매운맛을 무리하면 순두부의 부드러움이 사라질 수 있습니다.",
    ritual: "계란을 바로 풀지 말고 절반쯤 익힌 뒤 밥 위에 얹어 드세요.",
    home: "순두부, 찌개 양념, 대파, 계란만 있으면 10분 안에 가능합니다.",
    out: "반찬이 자극적이지 않은 집을 고르면 찌개의 맛이 더 또렷합니다.",
  },
  {
    name: "반미 샌드위치",
    description:
      "바삭한 빵, 새콤한 채소, 짭짤한 고기가 동시에 있어 빠른 저녁으로 좋습니다.",
    mood: "fresh",
    hunger: "steady",
    budget: "low",
    context: "delivery",
    effort: "quick",
    taste: "vegetable",
    reason: "밥은 부담스럽지만 대충 때우고 싶지는 않은 날에 맞습니다.",
    pairing: "라임 탄산수, 고수 추가, 감자튀김 소량",
    caution: "배달 거리가 길면 빵 식감이 죽을 수 있어 가까운 매장을 고르세요.",
    ritual: "반으로 잘라 첫 절반은 그대로, 나머지는 칠리소스를 조금 더해 먹으세요.",
    home: "바게트에 불고기, 피클 채소, 마요 소스를 넣으면 비슷한 즐거움이 납니다.",
    out: "고수와 소스 선택이 가능한 곳이면 취향 반영이 쉬워집니다.",
  },
  {
    name: "제육덮밥",
    description:
      "달고 매운 양념과 밥의 조합이 명확해서 에너지가 필요한 날 빠르게 만족스럽습니다.",
    mood: "spicy",
    hunger: "heavy",
    budget: "low",
    context: "solo",
    effort: "quick",
    taste: "rice",
    reason: "고민할 시간 없이 힘을 채워야 할 때 목적이 분명합니다.",
    pairing: "계란후라이, 상추, 미역국",
    caution: "양념이 과하면 끝맛이 텁텁하니 채소 비율이 있는 곳을 고르세요.",
    ritual: "처음엔 고기와 밥을 따로 먹고, 중간부터 노른자를 터뜨려 섞으세요.",
    home: "앞다리살, 고추장, 간장, 설탕, 양파만 있으면 냉장고 메뉴로 좋습니다.",
    out: "기사식당이나 백반집처럼 밥과 반찬이 안정적인 곳이 강합니다.",
  },
  {
    name: "초밥 세트",
    description:
      "가벼운 포만감과 작은 사치가 동시에 있어 하루를 정리하는 기분이 납니다.",
    mood: "special",
    hunger: "light",
    budget: "high",
    context: "date",
    effort: "normal",
    taste: "protein",
    reason: "기름진 메뉴보다 깔끔하게 기분을 내고 싶은 날에 적합합니다.",
    pairing: "미소국, 차완무시, 생강절임",
    caution: "배가 많이 고픈 날에는 우동이나 후토마키를 함께 고려하세요.",
    ritual: "흰살 생선에서 시작해 진한 생선, 마지막은 계란이나 김말이로 정리하세요.",
    home: "마트 초밥도 접시에 옮기고 미소국을 더하면 만족감이 올라갑니다.",
    out: "늦은 시간 할인 초밥은 가격은 좋지만 밥 식감이 떨어질 수 있습니다.",
  },
  {
    name: "닭한마리",
    description:
      "맑은 국물과 닭고기, 칼국수 마무리까지 있어 긴 저녁 대화에 잘 맞습니다.",
    mood: "comfort",
    hunger: "heavy",
    budget: "mid",
    context: "group",
    effort: "slow",
    taste: "protein",
    reason: "자극보다 든든한 온기와 공유하는 식탁이 필요한 날 좋습니다.",
    pairing: "부추 양념장, 감자, 칼국수 사리",
    caution: "처음부터 양념장을 많이 넣으면 국물의 맑은 맛이 가려집니다.",
    ritual: "닭고기를 먼저 건져 양념장에 찍고, 마지막에 칼국수로 식사를 완성하세요.",
    home: "닭볶음탕용 닭, 대파, 감자, 마늘을 오래 끓이면 비슷한 국물이 납니다.",
    out: "국물 리필과 사리 추가가 자연스러운 집이 여럿이 먹기 편합니다.",
  },
  {
    name: "비빔국수와 만두",
    description:
      "새콤달콤한 면과 따뜻한 만두가 만나 가볍지만 심심하지 않은 저녁입니다.",
    mood: "fresh",
    hunger: "steady",
    budget: "low",
    context: "delivery",
    effort: "quick",
    taste: "noodle",
    reason: "입맛은 없지만 무언가 확실히 먹고 싶은 날 산뜻하게 열어줍니다.",
    pairing: "고기만두, 오이채, 삶은 계란",
    caution: "소스가 미리 섞여 오면 면이 불 수 있어 분리 요청이 좋습니다.",
    ritual: "면을 먼저 비벼 한 입 먹고, 만두를 소스에 살짝 찍어 드세요.",
    home: "소면, 초고추장, 참기름, 김가루만 있어도 빠르게 만들 수 있습니다.",
    out: "분식집에서는 만두가 바로 찐 것인지가 전체 만족도를 좌우합니다.",
  },
];

const dailyQuestions = [
  "밥을 먹고 싶은 건가요, 기분을 바꾸고 싶은 건가요?",
  "오늘 필요한 건 뜨거운 국물인가요, 바삭한 식감인가요?",
  "혼자 조용히 회복하고 싶나요, 누군가와 나누고 싶나요?",
  "내일 아침까지 생각하면 지금 어느 정도의 무게가 적당한가요?",
];

const themeToggle = document.querySelector("#theme-toggle");
const pickButton = document.querySelector("#pick-button");
const saveButton = document.querySelector("#save-button");
const surpriseButton = document.querySelector("#surprise-button");
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
const menuPairing = document.querySelector("#menu-pairing");
const menuCaution = document.querySelector("#menu-caution");
const menuRitual = document.querySelector("#menu-ritual");
const menuHome = document.querySelector("#menu-home");
const menuOut = document.querySelector("#menu-out");
const dailyQuestion = document.querySelector("#daily-question");

const COMMENT_STORAGE_KEY = "dinner-comments-v2";
const COMMENT_AUTHOR_KEY = "dinner-comment-author";
const SAVED_STORAGE_KEY = "dinner-saved-menus";
const THEME_STORAGE_KEY = "dinner-theme";
let currentMenu = dinners[0];
let lastMenuName = "";

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
  menuPairing.textContent = item.menu.pairing;
  menuCaution.textContent = item.menu.caution;
  menuRitual.textContent = item.menu.ritual;
  menuHome.textContent = item.menu.home;
  menuOut.textContent = item.menu.out;
  matchScore.textContent = `${item.score}%`;
  matchCount.textContent =
    item.active === 0
      ? "조건을 고르면 더 정교하게 추천합니다."
      : `${item.active}개 조건 중 ${item.matched}개가 맞는 후보입니다.`;
}

function pickDinner() {
  renderMenu(pickFromCandidates(getCandidates()));
}

function pickSurprise() {
  const menu = dinners[Math.floor(Math.random() * dinners.length)];
  renderMenu({ menu, score: 100, matched: 0, active: 0 });
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderQuickPicks() {
  quickPicks.innerHTML = dinners
    .map(
      (menu) => `
        <article class="quick-card">
          <div>
            <span class="quick-tag">${escapeHtml(menu.context)}</span>
            <h3>${escapeHtml(menu.name)}</h3>
          </div>
          <p>${escapeHtml(menu.description)}</p>
          <dl>
            <div><dt>추천 이유</dt><dd>${escapeHtml(menu.reason)}</dd></div>
            <div><dt>곁들임</dt><dd>${escapeHtml(menu.pairing)}</dd></div>
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
          pairing: currentMenu.pairing,
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
            <span>${escapeHtml(menu.pairing)}</span>
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
surpriseButton.addEventListener("click", pickSurprise);
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

dailyQuestion.textContent =
  dailyQuestions[new Date().getDate() % dailyQuestions.length];
applyTheme(getStoredTheme());
commentAuthor.value = getStoredAuthor();
renderQuickPicks();
renderSavedMenus();
pickDinner();
renderComments();
