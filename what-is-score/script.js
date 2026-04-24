const STORAGE_KEY = "what-is-score-ranking-state";

const defaultState = {
  keyword: "",
  store: "",
  limit: 100,
  softMode: false,
  history: [],
  rows: [],
};

const sampleState = {
  keyword: "오방난로",
  store: "한일공식스토어",
  limit: 100,
  softMode: false,
  history: [],
  rows: [],
};

const state = loadState();
let lastResponse = null;
let isLoading = false;

const elements = {
  rankingForm: document.querySelector("#rankingForm"),
  keywordInput: document.querySelector("#keywordInput"),
  storeInput: document.querySelector("#storeInput"),
  limitSelect: document.querySelector("#limitSelect"),
  softModeToggle: document.querySelector("#softModeToggle"),
  loadSampleButton: document.querySelector("#loadSampleButton"),
  saveButton: document.querySelector("#saveButton"),
  statusText: document.querySelector("#statusText"),
  resultCard: document.querySelector("#resultCard"),
  summaryBoard: document.querySelector("#summaryBoard"),
  prescriptionCard: document.querySelector("#prescriptionCard"),
  actionGuide: document.querySelector("#actionGuide"),
  actionButtons: document.querySelectorAll(".action-button"),
  resultsTableBody: document.querySelector("#resultsTableBody"),
  resultRowTemplate: document.querySelector("#resultRowTemplate"),
  historyList: document.querySelector("#historyList"),
};

bindEvents();
render();

function bindEvents() {
  elements.rankingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    state.keyword = elements.keywordInput.value.trim();
    state.store = elements.storeInput.value.trim();
    state.limit = Number.parseInt(elements.limitSelect.value, 10) || 100;
    await runLookup();
  });

  elements.softModeToggle.addEventListener("change", (event) => {
    state.softMode = event.target.checked;
    render();
    persistState();
  });

  elements.loadSampleButton.addEventListener("click", () => {
    Object.assign(state, structuredClone(sampleState));
    render();
    persistState();
  });

  elements.saveButton.addEventListener("click", () => {
    state.keyword = elements.keywordInput.value.trim();
    state.store = elements.storeInput.value.trim();
    state.limit = Number.parseInt(elements.limitSelect.value, 10) || 100;
    persistState();
    window.alert("현재 조회 상태를 저장했습니다.");
  });

  elements.actionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderActionGuide(button.dataset.action);
    });
  });
}

function render() {
  syncInputs();
  renderResultCard();
  renderSummaryBoard();
  renderPrescription();
  renderActionGuide();
  renderRows();
  renderHistory();
}

function syncInputs() {
  elements.keywordInput.value = state.keyword || "";
  elements.storeInput.value = state.store || "";
  elements.limitSelect.value = String(state.limit || 100);
  elements.softModeToggle.checked = Boolean(state.softMode);
  elements.statusText.textContent = buildStatusText();
}

function renderResultCard() {
  const result = getStoreResult();

  if (!state.keyword || !state.store) {
    elements.resultCard.className = "result-card empty";
    elements.resultCard.innerHTML = `
      <p class="result-label">아직 조회 전</p>
      <p class="result-rank">-</p>
      <p class="result-message">키워드와 스토어명을 넣고 순위를 확인하세요.</p>
    `;
    return;
  }

  const reaction = buildReaction(result.bestRank);
  const rankMeta = buildRankMeta(result.bestRank);
  const confetti = rankMeta.confetti
    ? `<div class="confetti">${Array.from({ length: 16 }, (_, index) => `<span style="--i:${index}"></span>`).join("")}</div>`
    : "";

  elements.resultCard.className = `result-card ${rankMeta.tone}`;
  elements.resultCard.innerHTML = `
    ${confetti}
    <div class="card-topline">
      <span class="rank-chip">${escapeHtml(rankMeta.badge)}</span>
      <span class="emoji-badge">${rankMeta.emoji}</span>
    </div>
    <p class="result-label">${escapeHtml(state.store)}</p>
    <p class="result-rank">${result.bestRank ? `${result.bestRank}위` : "미노출"}</p>
    <p class="result-message">${escapeHtml(reaction.message)}</p>
    <div class="meta-grid">
      <div><span>오늘의 사장님 칭호</span><strong>${escapeHtml(rankMeta.title)}</strong></div>
      <div><span>상품 구출 난이도</span><strong>${escapeHtml(rankMeta.rescueStars)}</strong></div>
      <div><span>키워드 전투력</span><strong>${rankMeta.battlePower}</strong></div>
      <div><span>${rankMeta.depthLabel}</span><strong>${escapeHtml(rankMeta.depthText)}</strong></div>
    </div>
  `;
}

function renderSummaryBoard() {
  const result = getStoreResult();
  const rank = result.bestRank;
  const summary = buildSingleSummary(rank);

  elements.summaryBoard.innerHTML = `
    <span class="summary-label">종합판정</span>
    <strong>${escapeHtml(summary.title)}</strong>
    <p>${escapeHtml(summary.body)}</p>
  `;
}

function renderPrescription() {
  elements.prescriptionCard.innerHTML = `
    <span class="summary-label">오늘의 한 줄 처방</span>
    <strong>${escapeHtml(pickPrescription())}</strong>
  `;
}

function renderActionGuide(action = "title") {
  const guides = {
    title: {
      title: "상품명 점검하기",
      body: "핵심 키워드는 상품명 앞쪽에 두세요. 멋있는 말보다 고객이 실제 검색하는 단어가 먼저 와야 합니다.",
    },
    thumb: {
      title: "썸네일 점검하기",
      body: "썸네일은 온라인 매장의 간판입니다. 제품이 작게 보이면 클릭이 죽습니다. 첫 컷에서 바로 이해돼야 합니다.",
    },
    longtail: {
      title: "롱테일 키워드 찾기",
      body: "메인 키워드 하나만 보지 말고 용도, 계절, 공간, 대상 단어를 붙여 더 쉬운 전투부터 이기세요.",
    },
  };

  const guide = guides[action] || guides.title;
  elements.actionGuide.innerHTML = `
    <span class="summary-label">다음 행동</span>
    <strong>${escapeHtml(guide.title)}</strong>
    <p>${escapeHtml(guide.body)}</p>
  `;
}

function renderRows() {
  elements.resultsTableBody.innerHTML = "";

  const rows = [...state.rows].sort((a, b) => a.rank - b.rank).slice(0, 30);
  rows.forEach((row) => {
    const element = elements.resultRowTemplate.content.firstElementChild.cloneNode(true);

    element.querySelectorAll("[data-field]").forEach((field) => {
      field.value = row[field.dataset.field] ?? "";
      field.addEventListener("input", () => {
        row[field.dataset.field] = normalizeValue(field.dataset.field, field.value);
      });
      field.addEventListener("change", () => {
        row[field.dataset.field] = normalizeValue(field.dataset.field, field.value);
      });
    });

    elements.resultsTableBody.appendChild(element);
  });
}

function renderHistory() {
  if (!state.history.length) {
    elements.historyList.innerHTML = `
      <article class="stack-item">
        <strong>히스토리 없음</strong>
        <span>조회하면 여기에 쌓입니다.</span>
      </article>
    `;
    return;
  }

  elements.historyList.innerHTML = state.history
    .map((item) => {
      return `
        <article class="stack-item">
          <strong>${escapeHtml(item.keyword)}</strong>
          <span>${escapeHtml(item.summary)}</span>
        </article>
      `;
    })
    .join("");
}

function getStoreResult() {
  const normalizedStore = normalizeText(state.store);
  const targetLoose = normalizeStoreName(state.store);
  const matches = (state.rows || [])
    .filter((row) => {
      const raw = normalizeText(row.storeName);
      const loose = normalizeStoreName(row.storeName);
      return raw.includes(normalizedStore) || loose.includes(targetLoose) || targetLoose.includes(loose);
    })
    .sort((a, b) => a.rank - b.rank);

  return {
    matches,
    bestRank: matches.length ? matches[0].rank : null,
  };
}

function buildReaction(rank) {
  const softMode = Boolean(state.softMode);

  if (!rank) {
    return {
      message: softMode
        ? "아직 노출이 약합니다. 전략을 다시 잡아볼 타이밍입니다."
        : "아직 안 보입니다. 오늘은 네이버가 형을 못 알아본 듯.",
    };
  }

  if (rank <= 5) {
    return { message: "축하합니다!!! 상위노출 중!!!" };
  }

  if (rank <= 10) {
    return {
      message: softMode
        ? "좋습니다. 조금만 더 다듬으면 상위권 고정 가능합니다."
        : "조금만 더 하면 상위노출! 힘내세요 돈이보인다!!!!!",
    };
  }

  if (rank <= 50) {
    return {
      message: softMode
        ? "상위노출 도전 구간입니다. 조금 더 밀어붙이면 됩니다."
        : "상위노출 도전중이시네요. 얼마 안 남았다.",
    };
  }

  if (rank <= 100) {
    return {
      message: softMode
        ? "지금은 전략 수정이 필요한 구간입니다. 아직 기회는 있습니다."
        : "스토어 하지말고 그냥 포기하세요 안팔릴껄?",
    };
  }

  return {
    message: softMode
      ? "지금은 노출이 많이 부족합니다. 재설계를 고려해보세요."
      : "이 정도면 네이버 뒷골목입니다. 다시 세팅합시다.",
  };
}

function buildRankMeta(rank) {
  if (!rank) {
    return {
      title: "심해 탐험가",
      rescueStars: "★★★★★",
      badge: "실종신고",
      battlePower: calculateBattlePower(state.keyword, state.store, 0),
      emoji: "🌊",
      depthLabel: "네이버 심해 깊이",
      depthText: "심해 999m",
      tone: "tone-bad",
      confetti: false,
    };
  }

  if (rank <= 5) {
    return {
      title: "네이버 귀족",
      rescueStars: "★☆☆☆☆",
      badge: "왕좌 방어전",
      battlePower: calculateBattlePower(state.keyword, state.store, 95 - rank),
      emoji: "👑",
      depthLabel: "현재 상태",
      depthText: "수면 위",
      tone: "tone-top",
      confetti: true,
    };
  }

  if (rank <= 10) {
    return {
      title: "상위노출 예비군",
      rescueStars: "★★☆☆☆",
      badge: "멱살권",
      battlePower: calculateBattlePower(state.keyword, state.store, 82 - rank),
      emoji: "💸",
      depthLabel: "현재 상태",
      depthText: "수면 위 접근",
      tone: "tone-good",
      confetti: false,
    };
  }

  if (rank <= 20) {
    return {
      title: "근성의 사장님",
      rescueStars: "★★★☆☆",
      badge: "추격권",
      battlePower: calculateBattlePower(state.keyword, state.store, 64 - rank),
      emoji: "🚀",
      depthLabel: "현재 상태",
      depthText: "중층 돌파중",
      tone: "tone-mid",
      confetti: false,
    };
  }

  if (rank <= 50) {
    return {
      title: "근성의 사장님",
      rescueStars: "★★★☆☆",
      badge: "체력전",
      battlePower: calculateBattlePower(state.keyword, state.store, 48 - Math.floor(rank / 2)),
      emoji: "🔧",
      depthLabel: "현재 상태",
      depthText: "중층 정체",
      tone: "tone-mid",
      confetti: false,
    };
  }

  return {
    title: "스크롤 수행자",
    rescueStars: "★★★★☆",
    badge: "유배지 생존",
    battlePower: calculateBattlePower(state.keyword, state.store, 18 - Math.floor(rank / 8)),
    emoji: "⚠️",
    depthLabel: "네이버 심해 깊이",
    depthText: `지하 ${rank}층`,
    tone: "tone-low",
    confetti: false,
  };
}

function buildSingleSummary(rank) {
  if (!rank) {
    return {
      title: "키워드 실종 상태",
      body: "지금은 고객보다 형이 더 많이 볼 확률이 높습니다. 상품명, 썸네일, 가격부터 다시 보세요.",
    };
  }
  if (rank <= 5) {
    return {
      title: "이 키워드는 돈 됩니다.",
      body: "지금은 왕좌를 지키는 구간입니다. 유지 관리와 방어가 핵심입니다.",
    };
  }
  if (rank <= 10) {
    return {
      title: "상위권 코앞입니다.",
      body: "조금만 더 다듬으면 바로 상위노출 고정권입니다.",
    };
  }
  if (rank <= 50) {
    return {
      title: "가능성은 있는데 아직 칼이 무딥니다.",
      body: "노출은 보이지만 돈 냄새가 강하진 않습니다. 클릭과 전환을 더 밀어야 합니다.",
    };
  }
  return {
    title: "지금은 구조가 필요합니다.",
    body: "이 구간은 그냥 버티는 게 아니라 세팅을 다시 잡아야 올라옵니다.",
  };
}

async function runLookup() {
  if (!state.keyword || !state.store) {
    render();
    return;
  }

  isLoading = true;
  render();

  try {
    const params = new URLSearchParams({
      mode: "api",
      store: state.store,
      keyword: state.keyword,
      limit: String(state.limit || 100),
    });

    const response = await fetch(`/api/ranking?${params.toString()}`);
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      throw new Error(payload.message || "조회 실패");
    }

    lastResponse = payload;
    state.rows = payload.items.map((item) => ({
      id: crypto.randomUUID(),
      rank: item.rank,
      storeName: item.mallName,
      productName: item.title,
      price: item.lprice,
    }));

    saveHistory();
    persistState();
  } catch (error) {
    lastResponse = {
      ok: false,
      message: error instanceof Error ? error.message : "조회 실패",
    };
  } finally {
    isLoading = false;
    render();
  }
}

function saveHistory() {
  if (!state.keyword || !state.store) {
    return;
  }

  const result = getStoreResult();
  const summary = `${state.store} ${result.bestRank ? `${result.bestRank}위` : "미노출"}`;

  state.history = [
    {
      id: crypto.randomUUID(),
      keyword: state.keyword,
      summary,
    },
    ...state.history,
  ].slice(0, 10);
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return structuredClone(defaultState);
    }
    const parsed = JSON.parse(saved);
    parsed.rows = (parsed.rows || []).map((row, index) => ({
      id: row.id || crypto.randomUUID(),
      rank: row.rank || index + 1,
      storeName: row.storeName || "",
      productName: row.productName || "",
      price: row.price || 0,
    }));
    parsed.history = parsed.history || [];
    parsed.limit = parsed.limit || 100;
    parsed.keyword = parsed.keyword || "";
    parsed.store = parsed.store || "";
    parsed.softMode = Boolean(parsed.softMode);
    return parsed;
  } catch {
    return structuredClone(defaultState);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeValue(key, value) {
  if (key === "rank" || key === "price") {
    return Number.parseInt(value, 10) || 0;
  }
  return value;
}

function normalizeText(value) {
  return String(value || "").replaceAll(/\s+/g, "").toLowerCase();
}

function normalizeStoreName(value) {
  return normalizeText(value)
    .replaceAll(/\(주\)|주식회사|공식스토어|공식몰|공식|스토어|smartstore|shop|몰/gi, "")
    .replaceAll(/[^0-9a-z가-힣]/gi, "");
}

function calculateBattlePower(keyword, store, moneyScore) {
  const seed = `${keyword}:${store}:${moneyScore}`;
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }
  const value = Math.max(0, Math.min(9999, moneyScore * 97 + hash));
  return new Intl.NumberFormat("ko-KR").format(value);
}

function pickPrescription() {
  const pool = [
    "상품명은 감성이 아니라 검색어입니다.",
    "고객은 예쁜 상품명을 검색하지 않습니다. 필요한 단어를 검색합니다.",
    "썸네일은 온라인 매장의 간판입니다.",
    "가격이 안 맞으면 순위가 좋아도 새어 나갑니다.",
    "리뷰는 사장님 대신 영업하는 직원입니다.",
  ];
  const seed = `${state.keyword}:${state.store}`;
  let hash = 0;
  for (const char of seed) {
    hash = (hash * 17 + char.charCodeAt(0)) % pool.length;
  }
  return pool[hash];
}

function buildStatusText() {
  if (isLoading) {
    return "조회 중";
  }
  if (lastResponse && lastResponse.ok === false) {
    return `오류: ${lastResponse.message}`;
  }
  if (lastResponse && lastResponse.ok) {
    return `${lastResponse.fetchedCount}개 결과 조회 완료`;
  }
  return "대기중";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

window.addEventListener("beforeunload", persistState);
