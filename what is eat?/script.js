const dinners = [
  {
    name: "매콤한 부대찌개",
    description: "칼칼하고 든든해서 배달로 시켜도 만족도가 높은 편입니다.",
    mood: "spicy",
    budget: "mid",
    context: "delivery",
    moodLabel: "자극적인 거",
    budgetLabel: "적당히",
    contextLabel: "배달/포장",
  },
  {
    name: "연어 포케",
    description: "부담 없이 깔끔하게 먹고 싶을 때 가장 안전한 선택입니다.",
    mood: "fresh",
    budget: "mid",
    context: "solo",
    moodLabel: "가벼운 거",
    budgetLabel: "적당히",
    contextLabel: "혼밥",
  },
  {
    name: "삼겹살",
    description: "오늘 하루 수고했다 싶으면 둘 이상 모였을 때 만족도가 높습니다.",
    mood: "comfort",
    budget: "high",
    context: "group",
    moodLabel: "든든한 거",
    budgetLabel: "오늘은 투자",
    contextLabel: "같이 먹음",
  },
  {
    name: "마라탕",
    description: "선택지를 조절할 수 있어서 자극적인 메뉴가 당길 때 강합니다.",
    mood: "spicy",
    budget: "mid",
    context: "delivery",
    moodLabel: "자극적인 거",
    budgetLabel: "적당히",
    contextLabel: "배달/포장",
  },
  {
    name: "돈카츠 정식",
    description: "과하게 모험하지 않으면서도 만족스럽게 배를 채우기 좋습니다.",
    mood: "comfort",
    budget: "mid",
    context: "solo",
    moodLabel: "든든한 거",
    budgetLabel: "적당히",
    contextLabel: "혼밥",
  },
  {
    name: "초밥",
    description: "가볍지만 분위기 있게 먹고 싶을 때 잘 맞는 메뉴입니다.",
    mood: "special",
    budget: "high",
    context: "group",
    moodLabel: "기분 내고 싶음",
    budgetLabel: "오늘은 투자",
    contextLabel: "같이 먹음",
  },
  {
    name: "김치볶음밥",
    description: "비용 부담이 적고 실패 확률이 낮아서 빠르게 결정하기 좋습니다.",
    mood: "comfort",
    budget: "low",
    context: "solo",
    moodLabel: "든든한 거",
    budgetLabel: "가볍게",
    contextLabel: "혼밥",
  },
  {
    name: "쌀국수",
    description: "자극적이지 않으면서 산뜻하게 먹고 싶은 날에 잘 맞습니다.",
    mood: "fresh",
    budget: "mid",
    context: "group",
    moodLabel: "가벼운 거",
    budgetLabel: "적당히",
    contextLabel: "같이 먹음",
  },
  {
    name: "치킨",
    description: "같이 먹기도 쉽고 배달 만족도도 높아서 무난한 카드입니다.",
    mood: "special",
    budget: "mid",
    context: "delivery",
    moodLabel: "기분 내고 싶음",
    budgetLabel: "적당히",
    contextLabel: "배달/포장",
  },
];

const themeToggle = document.querySelector("#theme-toggle");
const pickButton = document.querySelector("#pick-button");
const moodSelect = document.querySelector("#mood");
const budgetSelect = document.querySelector("#budget");
const contextSelect = document.querySelector("#context");
const quickPicks = document.querySelector("#quick-picks");
const matchCount = document.querySelector("#match-count");

const menuName = document.querySelector("#menu-name");
const menuDescription = document.querySelector("#menu-description");
const menuMood = document.querySelector("#menu-mood");
const menuBudget = document.querySelector("#menu-budget");
const menuContext = document.querySelector("#menu-context");

function getStoredTheme() {
  return localStorage.getItem("dinner-theme") || "dark";
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.dataset.theme = isLight ? "light" : "dark";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "다크 모드로 전환" : "라이트 모드로 전환"
  );
  themeToggle.querySelector(".theme-toggle__label").textContent = isLight
    ? "Dark mode"
    : "Light mode";
  document.documentElement.style.colorScheme = isLight ? "light" : "dark";
}

function saveTheme(theme) {
  localStorage.setItem("dinner-theme", theme);
}

function matchesFilters(menu) {
  const moodMatch = moodSelect.value === "any" || menu.mood === moodSelect.value;
  const budgetMatch =
    budgetSelect.value === "any" || menu.budget === budgetSelect.value;
  const contextMatch =
    contextSelect.value === "any" || menu.context === contextSelect.value;

  return moodMatch && budgetMatch && contextMatch;
}

function getCandidates() {
  const filtered = dinners.filter(matchesFilters);
  return filtered.length > 0 ? filtered : dinners;
}

function renderMenu(menu, candidateCount) {
  menuName.textContent = menu.name;
  menuDescription.textContent = menu.description;
  menuMood.textContent = menu.moodLabel;
  menuBudget.textContent = menu.budgetLabel;
  menuContext.textContent = menu.contextLabel;
  matchCount.textContent =
    candidateCount === dinners.length
      ? "전체 메뉴 기준으로 추천 중"
      : `${candidateCount}개 조건 일치 메뉴 중에서 추천 중`;
}

function pickDinner() {
  const candidates = getCandidates();
  const next = candidates[Math.floor(Math.random() * candidates.length)];
  renderMenu(next, candidates.length);
}

function renderQuickPicks() {
  quickPicks.innerHTML = dinners
    .slice(0, 6)
    .map(
      (menu) => `
        <article class="quick-card">
          <h4>${menu.name}</h4>
          <p>${menu.description}</p>
          <span class="quick-tag">${menu.contextLabel}</span>
        </article>
      `
    )
    .join("");
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);
  saveTheme(nextTheme);
});

pickButton.addEventListener("click", pickDinner);
[moodSelect, budgetSelect, contextSelect].forEach((select) => {
  select.addEventListener("change", pickDinner);
});

applyTheme(getStoredTheme());
renderQuickPicks();
pickDinner();
