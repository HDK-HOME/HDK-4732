const STORAGE_KEY = "what-is-score-ranking-state";
const EXTENSION_STORE_URL = "";

const defaultState = {
  keyword: "",
  store: "",
  limit: 100,
  softMode: false,
  history: [],
  rows: [],
  signalRecords: [],
};

const sampleState = {
  keyword: "오방난로",
  store: "한일공식스토어",
  limit: 100,
  softMode: false,
  history: [],
  rows: [],
  signalRecords: [],
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
  signalJsonInput: document.querySelector("#signalJsonInput"),
  analyzeSignalButton: document.querySelector("#analyzeSignalButton"),
  signalAnalysisStatus: document.querySelector("#signalAnalysisStatus"),
  signalAnalysisResult: document.querySelector("#signalAnalysisResult"),
  extensionStoreButton: document.querySelector("#extensionStoreButton"),
  resultsTableBody: document.querySelector("#resultsTableBody"),
  resultRowTemplate: document.querySelector("#resultRowTemplate"),
  historyList: document.querySelector("#historyList"),
};

bindEvents();
ingestSignalFromUrl();
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

  elements.analyzeSignalButton.addEventListener("click", analyzePastedSignalJson);
  elements.extensionStoreButton.addEventListener("click", () => {
    if (EXTENSION_STORE_URL) {
      window.open(EXTENSION_STORE_URL, "_blank", "noopener");
    }
  });
}

function render() {
  syncInputs();
  renderResultCard();
  renderSummaryBoard();
  renderPrescription();
  renderActionGuide();
  renderSignalAnalysis();
  renderRows();
  renderHistory();
}

function syncInputs() {
  elements.keywordInput.value = state.keyword || "";
  elements.storeInput.value = state.store || "";
  elements.limitSelect.value = String(state.limit || 100);
  elements.softModeToggle.checked = Boolean(state.softMode);
  elements.statusText.textContent = buildStatusText();
  elements.extensionStoreButton.disabled = !EXTENSION_STORE_URL;
  elements.extensionStoreButton.textContent = EXTENSION_STORE_URL ? "Chrome 웹스토어에서 설치" : "출시 준비중";
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

function analyzePastedSignalJson() {
  try {
    const raw = elements.signalJsonInput.value.trim();
    if (!raw) {
      throw new Error("확장 프로그램 JSON을 붙여넣어주세요.");
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeExtensionSignalPayload(parsed);
    if (!normalized.productId) {
      throw new Error("productId가 없어 기록할 수 없습니다.");
    }

    saveSignalRecord(parsed, normalized);

    elements.signalAnalysisStatus.textContent = "판매신호를 기록했습니다.";
    elements.signalJsonInput.value = "";
    persistState();
    renderSignalAnalysis();
  } catch (error) {
    elements.signalAnalysisStatus.textContent = error instanceof Error ? error.message : "JSON 분석에 실패했습니다.";
  }
}

function ingestSignalFromUrl() {
  const encoded = readSignalParam();
  if (!encoded) {
    logSignalDebug("signal 파라미터 없음");
    return;
  }

  try {
    logSignalDebug("signal 파라미터 수신 성공");
    const payload = JSON.parse(decodeBase64Url(encoded));
    logSignalDebug("디코딩 성공");
    const normalized = normalizeExtensionSignalPayload(payload);
    if (!normalized.productId) {
      throw new Error("productId가 없어 자동 기록할 수 없습니다.");
    }

    saveSignalRecord(payload, normalized);
    elements.signalAnalysisStatus.textContent = "확장 프로그램 분석 결과를 불러왔습니다.";
    logSignalDebug("localStorage 저장 성공");
    removeSignalParamFromUrl();
  } catch (error) {
    elements.signalAnalysisStatus.textContent = error instanceof Error ? error.message : "확장 프로그램 결과를 불러오지 못했습니다.";
    logSignalDebug(`디코딩 실패 또는 localStorage 저장 실패: ${elements.signalAnalysisStatus.textContent}`);
  }
}

function saveSignalRecord(payload, normalized) {
  const recordedAt = payload.collectedAt || new Date().toISOString();
  const recordDate = formatRecordDate(recordedAt);
  const nextRecord = {
    id: crypto.randomUUID(),
    recordedAt,
    recordDate,
    source: payload.source || "chrome-extension",
    currentUrl: payload.currentUrl || "",
    storageKey: buildSignalStorageKey(normalized),
    ...normalized,
  };

  state.signalRecords = [
    nextRecord,
    ...(state.signalRecords || []).filter((record) => !(record.productId === normalized.productId && formatRecordDate(record.recordedAt) === recordDate)),
  ].slice(0, 200);
  persistProductSignalTimeline(nextRecord);
  persistState();
}

function persistProductSignalTimeline(record) {
  const key = buildSignalStorageKey(record);
  const existing = readProductSignalTimeline(key);
  const records = [
    {
      date: record.recordDate,
      saleCount: record.saleCount,
      reviewCount: record.reviewCount,
      interestCustomerCount: record.interestCustomerCount,
      price: record.price,
      originalPrice: record.originalPrice,
      discountRate: record.discountRate,
      collectedAt: record.recordedAt,
    },
    ...(existing.records || []).filter((item) => item.date !== record.recordDate),
  ].sort((a, b) => new Date(a.collectedAt) - new Date(b.collectedAt));

  localStorage.setItem(
    key,
    JSON.stringify({
      productId: record.productId,
      productTitle: record.productTitle,
      storeName: record.storeName,
      records,
    })
  );
}

function readProductSignalTimeline(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

function renderSignalAnalysis() {
  const groups = groupSignalRecords(state.signalRecords);

  if (!groups.length) {
    elements.signalAnalysisResult.innerHTML = `
      <article class="signal-empty-card">
        <strong>아직 분석 기록이 없습니다.</strong>
        <span>확장 프로그램의 붙여넣기용 JSON을 넣으면 상품별 기록이 쌓입니다.</span>
      </article>
    `;
    return;
  }

  elements.signalAnalysisResult.innerHTML = groups
    .map((group) => {
      const latest = group.records[group.records.length - 1];
      const previous = group.records[group.records.length - 2] || null;
      const delta = previous ? buildSignalRecordDelta(previous, latest) : null;
      const threeDayDelta = buildPeriodDelta(group.records, latest, 3);
      const sevenDayDelta = buildPeriodDelta(group.records, latest, 7);
      const trend = buildTrendMessage(group.records, latest);

      return `
        <article class="signal-result-card">
          <div class="signal-result-top">
            <div>
              <span class="summary-label">공개 페이지 감지 신호</span>
              <strong>${escapeHtml(latest.productTitle || "상품명 없음")}</strong>
              <p>${escapeHtml(latest.storeName || "스토어명 없음")} · productId ${escapeHtml(group.productId)}</p>
            </div>
            <span class="signal-confidence">${escapeHtml(latest.confidence || "unknown")}</span>
          </div>
          <div class="signal-metric-grid">
            ${renderSignalMetric("판매신호", latest.saleCount)}
            ${renderSignalMetric("리뷰 수", latest.reviewCount)}
            ${renderSignalMetric("관심고객수", latest.interestCustomerCount)}
            ${renderSignalMetric("현재가", latest.price, "원")}
            ${renderSignalMetric("정가 후보", latest.originalPrice, "원")}
            ${renderSignalMetric("할인율", latest.discountRate, "%")}
            ${renderSignalMetric("3일 판매 변화", threeDayDelta?.saleCount)}
            ${renderSignalMetric("7일 판매 변화", sevenDayDelta?.saleCount)}
            ${renderSignalMetric("3일 리뷰 변화", threeDayDelta?.reviewCount)}
            ${renderSignalMetric("7일 리뷰 변화", sevenDayDelta?.reviewCount)}
          </div>
          <div class="signal-delta-box">
            <strong>${delta ? delta.summary : "첫 기록입니다."}</strong>
            <p>${escapeHtml(trend)}</p>
            <p>네이버 공식 판매량이 아니라 공개 페이지에서 감지한 판매신호입니다.</p>
          </div>
        </article>
      `;
    })
    .join("");
}

function normalizeExtensionSignalPayload(payload) {
  const normalized = payload.normalizedSignals || payload;
  const price = normalizeNullableNumber(normalized.price ?? normalized.discountedSalePrice);
  const originalPrice = normalizeNullableNumber(normalized.originalPrice);

  return {
    productId: String(normalized.productId || payload.productId || ""),
    productTitle: normalized.productTitle || payload.productTitle || "",
    storeName: normalized.storeName || payload.storeName || "",
    saleCount: normalizeNumber(normalized.saleCount),
    reviewCount: normalizeNumber(normalized.reviewCount),
    interestCustomerCount: normalizeNumber(normalized.interestCustomerCount),
    price,
    originalPrice,
    discountRate: normalizeNullableNumber(normalized.discountRate) ?? calculateDiscountRate(price, originalPrice),
    confidence: normalized.confidence || payload.confidence || "unknown",
  };
}

function readSignalParam() {
  const queryValue = new URLSearchParams(window.location.search).get("signal");
  if (queryValue) {
    return queryValue;
  }

  const hash = window.location.hash.replace(/^#/, "");
  return new URLSearchParams(hash).get("signal");
}

function removeSignalParamFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("signal");
  if (url.hash.includes("signal=")) {
    url.hash = "";
  }
  window.history.replaceState({}, document.title, url.toString());
}

function decodeBase64Url(value) {
  const base64 = String(value).replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function groupSignalRecords(records) {
  const groups = new Map();

  (records || []).forEach((record) => {
    if (!record.productId) {
      return;
    }
    if (!groups.has(record.productId)) {
      groups.set(record.productId, []);
    }
    groups.get(record.productId).push(record);
  });

  return Array.from(groups.entries())
    .map(([productId, productRecords]) => ({
      productId,
      records: productRecords.sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)),
    }))
    .sort((a, b) => new Date(b.records[b.records.length - 1].recordedAt) - new Date(a.records[a.records.length - 1].recordedAt));
}

function buildSignalRecordDelta(previous, latest) {
  const saleDelta = latest.saleCount - previous.saleCount;
  const reviewDelta = latest.reviewCount - previous.reviewCount;
  const interestDelta = latest.interestCustomerCount - previous.interestCustomerCount;
  return {
    summary: `이전 기록 대비 판매 ${formatDelta(saleDelta)} · 리뷰 ${formatDelta(reviewDelta)} · 관심 ${formatDelta(interestDelta)}`,
  };
}

function buildTrendMessage(records, latest) {
  const latestDate = new Date(latest.recordedAt);
  const hasThreeDayRecord = records.some((record) => dateDiffDays(new Date(record.recordedAt), latestDate) >= 3);
  const hasSevenDayRecord = records.some((record) => dateDiffDays(new Date(record.recordedAt), latestDate) >= 7);

  if (hasSevenDayRecord) {
    return "7일 이상 간격 기록이 있어 7일 추세 계산이 가능합니다.";
  }
  if (hasThreeDayRecord) {
    return "3일 이상 간격 기록이 있어 3일 추세 계산이 가능합니다.";
  }
  return "기록이 더 쌓이면 3일/7일 추세가 표시됩니다.";
}

function buildPeriodDelta(records, latest, days) {
  const past = findClosestPastRecord(records, latest, days);
  if (!past) {
    return null;
  }

  return {
    saleCount: latest.saleCount - past.saleCount,
    reviewCount: latest.reviewCount - past.reviewCount,
    interestCustomerCount: latest.interestCustomerCount - past.interestCustomerCount,
  };
}

function findClosestPastRecord(records, latest, targetDays) {
  const latestDate = new Date(latest.recordedAt);
  return [...records]
    .filter((record) => record !== latest)
    .map((record) => ({
      record,
      days: dateDiffDays(new Date(record.recordedAt), latestDate),
    }))
    .filter((item) => item.days >= targetDays)
    .sort((a, b) => a.days - b.days)[0]?.record || null;
}

function renderSignalMetric(label, value, suffix = "") {
  const isDelta = label.includes("변화");
  const display =
    value === null || value === undefined
      ? isDelta
        ? "데이터 축적 중"
        : "-"
      : `${isDelta ? formatDelta(value) : formatNumber(value)}${suffix}`;
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(display)}</strong>
    </div>
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
    parsed.signalRecords = (parsed.signalRecords || []).map((record) => ({
      id: record.id || crypto.randomUUID(),
      recordedAt: record.recordedAt || new Date().toISOString(),
      recordDate: record.recordDate || formatRecordDate(record.recordedAt || new Date().toISOString()),
      source: record.source || "chrome-extension",
      currentUrl: record.currentUrl || "",
      storageKey: record.storageKey || buildSignalStorageKey(record),
      productId: String(record.productId || ""),
      productTitle: record.productTitle || "",
      storeName: record.storeName || "",
      saleCount: normalizeNumber(record.saleCount),
      reviewCount: normalizeNumber(record.reviewCount),
      interestCustomerCount: normalizeNumber(record.interestCustomerCount),
      price: normalizeNullableNumber(record.price),
      originalPrice: normalizeNullableNumber(record.originalPrice),
      discountRate: normalizeNullableNumber(record.discountRate),
      confidence: record.confidence || "unknown",
    }));
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

function normalizeNumber(value) {
  const number = Number.parseInt(value, 10);
  return Number.isNaN(number) ? 0 : number;
}

function normalizeNullableNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number.parseInt(value, 10);
  return Number.isNaN(number) ? null : number;
}

function buildSignalStorageKey(record) {
  return `masterhong:signals:${record.storeName || "unknown"}:${record.productId || "unknown"}`;
}

function formatRecordDate(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function logSignalDebug(message) {
  console.log(`[masterhong signal] ${message}`);
  if (elements.signalAnalysisStatus && message !== "signal 파라미터 없음") {
    elements.signalAnalysisStatus.textContent = message;
  }
}

function calculateDiscountRate(price, originalPrice) {
  if (!price || !originalPrice || originalPrice <= price) {
    return 0;
  }
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value || 0);
}

function formatDelta(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value)}`;
}

function dateDiffDays(startDate, endDate) {
  return Math.floor((endDate - startDate) / 86400000);
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
