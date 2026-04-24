let latestResult = null;
const MASTERHONG_WEBAPP_URL = "https://what-is-score.benywade31.workers.dev/";

const elements = {
  analyzeProductButton: document.querySelector("#analyzeProductButton"),
  collectButton: document.querySelector("#collectButton"),
  openWebAppButton: document.querySelector("#openWebAppButton"),
  copyJsonButton: document.querySelector("#copyJsonButton"),
  copyPasteButton: document.querySelector("#copyPasteButton"),
  statusText: document.querySelector("#statusText"),
  summary: document.querySelector("#summary"),
  normalizedBoard: document.querySelector("#normalizedBoard"),
  signalList: document.querySelector("#signalList"),
  previewBox: document.querySelector("#previewBox"),
};

elements.analyzeProductButton.addEventListener("click", analyzeProductInWebApp);
elements.collectButton.addEventListener("click", collectFromActiveTab);
elements.openWebAppButton.addEventListener("click", openLatestResultInWebApp);
elements.copyJsonButton.addEventListener("click", () => {
  latestResult = ensureNormalizedResult(latestResult);
  copyText(JSON.stringify(buildCopyResult(latestResult), null, 2));
});
elements.copyPasteButton.addEventListener("click", () => copyText(buildPastePayload(latestResult)));

async function collectFromActiveTab() {
  setStatus("현재 탭을 분석 중입니다.");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      throw new Error("활성 탭을 찾지 못했습니다.");
    }

    await injectLatestContentScript(tab.id);
    const result = await chrome.tabs.sendMessage(tab.id, { type: "COLLECT_SIGNALS" });
    latestResult = ensureNormalizedResult(result);
    renderResult(latestResult);
    setStatus(result.blockedReason ? "차단 후보가 감지되었습니다." : "수집 완료");
  } catch (error) {
    setStatus("현재 페이지에서 content script를 실행할 수 없습니다.");
    renderError(error instanceof Error ? error.message : "알 수 없는 오류");
  }
}

async function analyzeProductInWebApp() {
  setStatus("상품 신호를 분석하고 웹앱을 여는 중입니다.");

  try {
    const result = await collectCurrentTabSignals();
    latestResult = ensureNormalizedResult(result);
    renderResult(latestResult);

    const payload = buildWebAppSignalPayload(latestResult);
    const signal = encodeBase64Url(JSON.stringify(payload));
    const url = `${MASTERHONG_WEBAPP_URL}?signal=${encodeURIComponent(signal)}`;
    console.log("[masterhong] opening web app with signal", url);
    await chrome.tabs.create({ url });
    setStatus("마스터홍에서 결과를 열었습니다.");
  } catch (error) {
    setStatus("상품 분석 연결에 실패했습니다.");
    renderError(error instanceof Error ? error.message : "알 수 없는 오류");
  }
}

async function collectCurrentTabSignals() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("활성 탭을 찾지 못했습니다.");
  }

  await injectLatestContentScript(tab.id);
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => globalThis.__WHAT_IS_SCORE_COLLECT_SIGNALS__(),
  });
  return result.result;
}

function renderResult(result) {
  result = ensureNormalizedResult(result);
  const normalized = result.normalizedSignals || {};
  elements.copyJsonButton.disabled = !result;
  elements.copyPasteButton.disabled = !result;
  elements.openWebAppButton.disabled = !result;
  elements.previewBox.textContent = JSON.stringify(result, null, 2);

  elements.summary.className = result.blockedReason ? "summary blocked" : "summary";
  elements.summary.innerHTML = `
    <strong>${escapeHtml(normalized.productTitle || result.productTitle || result.metaTitle || result.documentTitle || "상품명 후보 없음")}</strong>
    <span>${escapeHtml(normalized.storeName || result.storeName || "스토어 후보 없음")}</span>
    <dl>
      <div><dt>productId</dt><dd>${escapeHtml(normalized.productId || result.productId || "-")}</dd></div>
      <div><dt>catalogId</dt><dd>${escapeHtml(normalized.catalogId || result.catalogId || "-")}</dd></div>
      <div><dt>confidence</dt><dd>${escapeHtml(normalized.confidence || result.confidence || "-")}</dd></div>
      <div><dt>blockedReason</dt><dd>${escapeHtml(result.blockedReason || "-")}</dd></div>
    </dl>
    <p>${escapeHtml(result.message || "감지 후보입니다.")}</p>
  `;

  renderNormalizedSignals(normalized);
  renderSignals(result.detectedSignals || []);
}

function renderNormalizedSignals(normalized) {
  const metrics = [
    { label: "상품명", value: normalized.productTitle, source: "normalized.productTitle", text: true },
    { label: "스토어명", value: normalized.storeName, source: "normalized.storeName", text: true },
    { label: "판매신호", value: normalized.saleCount, source: normalized.sources?.saleCount },
    { label: "리뷰 수", value: normalized.reviewCount, source: normalized.sources?.reviewCount },
    { label: "관심/찜", value: normalized.interestCustomerCount, source: normalized.sources?.interestCustomerCount },
    { label: "현재가", value: normalized.price ?? normalized.discountedSalePrice, source: normalized.sources?.price },
    { label: "정가 후보", value: normalized.originalPrice, source: normalized.sources?.originalPrice },
    { label: "할인율", value: normalized.discountRate, source: normalized.sources?.discountRate },
    { label: "신뢰도", value: normalized.confidence, source: "normalized.confidence", text: true },
  ];

  elements.normalizedBoard.innerHTML = metrics
    .map((metric) => {
      return `
        <article class="metric-card">
          <span>${escapeHtml(metric.label)}</span>
          <strong>${metric.value === null || metric.value === undefined ? "-" : escapeHtml(metric.text ? metric.value : formatNumber(metric.value))}</strong>
          <em>${escapeHtml(metric.source || "감지 후보 없음")}</em>
        </article>
      `;
    })
    .join("");
}

function renderSignals(signals) {
  if (!signals.length) {
    elements.signalList.innerHTML = `
      <article class="signal-card empty">
        <strong>감지 후보 없음</strong>
        <span>차단 페이지이거나 판매신호 후보를 찾지 못했습니다.</span>
      </article>
    `;
    return;
  }

  elements.signalList.innerHTML = signals
    .slice(0, 20)
    .map((signal) => {
      return `
        <article class="signal-card">
          <div>
            <strong>${escapeHtml(signal.label || signal.type)}</strong>
            <span>${escapeHtml(signal.source)} · ${escapeHtml(signal.keyword || "-")}</span>
          </div>
          <p>${escapeHtml(signal.snippet || signal.valueText || "")}</p>
          <em>감지 후보${signal.valueNumber !== null && signal.valueNumber !== undefined ? ` · 숫자 후보 ${escapeHtml(signal.valueNumber)}` : ""}</em>
        </article>
      `;
    })
    .join("");
}

function renderError(message) {
  elements.summary.className = "summary blocked";
  elements.summary.innerHTML = `
    <strong>수집 실패</strong>
    <span>${escapeHtml(message)}</span>
  `;
  elements.signalList.innerHTML = "";
  elements.normalizedBoard.innerHTML = "";
  elements.previewBox.textContent = "{}";
  elements.copyJsonButton.disabled = true;
  elements.copyPasteButton.disabled = true;
  elements.openWebAppButton.disabled = true;
}

function buildPastePayload(result) {
  if (!result) {
    return "";
  }

  result = ensureNormalizedResult(result);

  const payload = {
    source: result.source,
    schemaVersion: 2,
    currentUrl: result.currentUrl,
    collectedAt: result.collectedAt,
    normalizedSignals: result.normalizedSignals,
    productId: result.normalizedSignals?.productId || result.productId,
    catalogId: result.normalizedSignals?.catalogId || result.catalogId,
    productTitle: result.normalizedSignals?.productTitle || result.productTitle,
    storeName: result.normalizedSignals?.storeName || result.storeName,
    saleCount: result.normalizedSignals?.saleCount ?? null,
    reviewCount: result.normalizedSignals?.reviewCount ?? null,
    interestCustomerCount: result.normalizedSignals?.interestCustomerCount ?? null,
    price: result.normalizedSignals?.price ?? result.normalizedSignals?.discountedSalePrice ?? null,
    originalPrice: result.normalizedSignals?.originalPrice ?? null,
    discountedSalePrice: result.normalizedSignals?.discountedSalePrice ?? null,
    confidence: result.normalizedSignals?.confidence || result.confidence,
    blockedReason: result.blockedReason,
    detectedSignalsPreview: (result.detectedSignals || []).slice(0, 10),
    message:
      result.message ||
      "사용자 브라우저에서 공개 페이지를 읽어 감지한 판매신호입니다. 네이버 공식 판매량 지표가 아닌 추정/공개 신호입니다.",
  };

  return JSON.stringify(payload, null, 2);
}

function buildCopyResult(result) {
  result = ensureNormalizedResult(result);
  return {
    schemaVersion: 2,
    normalizedSignals: result.normalizedSignals,
    ok: result.ok,
    source: result.source,
    collectedAt: result.collectedAt,
    currentUrl: result.currentUrl,
    productId: result.productId,
    catalogId: result.catalogId,
    documentTitle: result.documentTitle,
    metaTitle: result.metaTitle,
    metaDescription: result.metaDescription,
    productTitle: result.productTitle,
    storeName: result.storeName,
    bodyTextPreview: result.bodyTextPreview,
    scriptJsonCandidates: result.scriptJsonCandidates,
    detectedSignals: result.detectedSignals,
    blockedReason: result.blockedReason,
    rawCandidates: result.rawCandidates,
    confidence: result.confidence,
    message: result.message,
  };
}

function buildWebAppSignalPayload(result) {
  result = ensureNormalizedResult(result);
  return {
    schemaVersion: 2,
    source: result.source || "chrome-extension",
    currentUrl: result.currentUrl,
    collectedAt: result.collectedAt || new Date().toISOString(),
    productId: result.normalizedSignals?.productId || result.productId,
    normalizedSignals: result.normalizedSignals,
  };
}

async function openLatestResultInWebApp() {
  if (!latestResult) {
    setStatus("먼저 현재 탭 분석을 실행해주세요.");
    return;
  }

  const payload = buildWebAppSignalPayload(latestResult);
  const signal = encodeBase64Url(JSON.stringify(payload));
  await chrome.tabs.create({ url: `${MASTERHONG_WEBAPP_URL}?signal=${encodeURIComponent(signal)}` });
}

async function injectLatestContentScript(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function ensureNormalizedResult(result) {
  if (!result) {
    return result;
  }

  if (hasNormalizedSignals(result.normalizedSignals)) {
    return {
      schemaVersion: result.schemaVersion || 2,
      normalizedSignals: result.normalizedSignals,
      ...result,
      schemaVersion: 2,
    };
  }

  const fallbackText = [
    result.bodyTextPreview || "",
    ...(result.scriptJsonCandidates || []),
    ...(result.detectedSignals || []).map((signal) => signal.snippet || signal.valueText || ""),
  ].join("\n");

  const priceFields = extractPriceFields(fallbackText);

  const normalizedSignals = {
    saleCount: firstNumberByKeys(fallbackText, ["saleCount"]),
    reviewCount: firstNumberByKeys(fallbackText, ["totalReviewCount", "reviewCount"]) || extractReviewCount(fallbackText),
    interestCustomerCount:
      firstNumberByKeys(fallbackText, [
        "zzimProductCount",
        "zzimCount",
        "wishCount",
        "favoriteCount",
        "interestCustomerCount",
        "interestCount",
      ]) || extractInterestCustomerCount(fallbackText),
    price: priceFields.price,
    originalPrice: priceFields.originalPrice,
    discountRate: priceFields.discountRate,
    productId: result.productId || extractProductId(result.currentUrl || ""),
    productTitle: result.productTitle || result.metaTitle || result.documentTitle || null,
    storeName: result.storeName || null,
    confidence: "low",
    sources: {},
  };

  normalizedSignals.discountedSalePrice = normalizedSignals.price;
  normalizedSignals.sources = {
    saleCount: normalizedSignals.saleCount !== null ? "fallback.script.saleCount" : null,
    reviewCount: normalizedSignals.reviewCount !== null ? "fallback.review" : null,
    interestCustomerCount: normalizedSignals.interestCustomerCount !== null ? "fallback.interest" : null,
    price: normalizedSignals.price !== null ? priceFields.priceSource : null,
    originalPrice: normalizedSignals.originalPrice !== null ? priceFields.originalPriceSource : null,
    discountRate: normalizedSignals.discountRate !== null ? priceFields.discountRateSource : null,
  };

  const strongCount = [
    normalizedSignals.saleCount,
    normalizedSignals.reviewCount,
    normalizedSignals.interestCustomerCount,
  ].filter((value) => value !== null).length;
  normalizedSignals.confidence = normalizedSignals.saleCount !== null && normalizedSignals.reviewCount !== null ? "high" : strongCount ? "medium" : "low";

  return {
    schemaVersion: 2,
    normalizedSignals,
    ...result,
    normalizedSignals,
    confidence: normalizedSignals.confidence,
    message:
      result.message ||
      "사용자 브라우저에서 공개 페이지를 읽어 감지한 판매신호입니다. 네이버 공식 판매량 지표가 아닌 추정/공개 신호입니다.",
  };
}

function hasNormalizedSignals(normalized) {
  return Boolean(
    normalized &&
      Object.prototype.hasOwnProperty.call(normalized, "saleCount") &&
      Object.prototype.hasOwnProperty.call(normalized, "reviewCount") &&
      Object.prototype.hasOwnProperty.call(normalized, "interestCustomerCount") &&
      Object.prototype.hasOwnProperty.call(normalized, "price") &&
      Object.prototype.hasOwnProperty.call(normalized, "originalPrice") &&
      Object.prototype.hasOwnProperty.call(normalized, "discountRate") &&
      Object.prototype.hasOwnProperty.call(normalized, "productId") &&
      Object.prototype.hasOwnProperty.call(normalized, "productTitle") &&
      Object.prototype.hasOwnProperty.call(normalized, "storeName") &&
      Object.prototype.hasOwnProperty.call(normalized, "confidence")
  );
}

function firstNumberByKeys(text, keys) {
  for (const key of keys) {
    const patterns = [
      new RegExp(`\\\\?["']${escapeRegExp(key)}\\\\?["']\\s*:\\s*\\\\?["']?([0-9][0-9,.]*)\\\\?["']?`, "i"),
      new RegExp(`${escapeRegExp(key)}\\s*[:=]\\s*"?([0-9][0-9,.]*)"?`, "i"),
    ];

    for (const pattern of patterns) {
      const match = String(text || "").match(pattern);
      if (match) {
        return parseKoreanNumber(match[1]);
      }
    }
  }
  return null;
}

function extractReviewCount(text) {
  return firstNumberByPatterns(text, [
    /([0-9][0-9,.\s]*(?:만|천)?)\s*건\s*(?:리뷰|상품평|후기)/i,
    /(?:리뷰|상품평|후기)\s*([0-9][0-9,.\s]*(?:만|천)?)\s*건?/i,
  ]);
}

function extractInterestCustomerCount(text) {
  return firstNumberByPatterns(text, [
    /관심\s*고객\s*수\s*([0-9][0-9,.\s]*(?:만|천)?)/i,
    /([0-9][0-9,.\s]*(?:만|천)?)\s*(?:명의\s*)?관심\s*고객/i,
    /찜\s*([0-9][0-9,.\s]*(?:만|천)?)/i,
  ]);
}

function extractBodyPrice(text) {
  return firstNumberByPatterns(text, [
    /(?:현재가|판매가|할인가|상품가격|가격)\s*([0-9][0-9,.\s]*)\s*원/i,
    /([0-9][0-9,.\s]*)\s*원\s*(?:구매혜택|상품정보|혜택|배송)/i,
  ]);
}

function extractPriceFields(text) {
  const discountedPrice = firstNumberByKeys(text, ["discountedSalePrice", "mobileDiscountedSalePrice"]);
  const listedPrice = firstNumberByKeys(text, ["salePrice", "dispSalePrice", "mobileSalePrice", "price"]);
  const bodyProductPrice = extractBodyProductPrice(text);
  const bodyAnyPrice = extractBodyPrice(text);
  const discountRate = firstNumberByKeys(text, ["discountRate", "mobileDiscountRate"]) || extractDiscountRate(text);
  const candidates = [discountedPrice, listedPrice, bodyProductPrice, bodyAnyPrice]
    .filter((value) => value !== null && value > 0);
  const uniqueCandidates = Array.from(new Set(candidates)).sort((a, b) => a - b);

  if (uniqueCandidates.length >= 2 && discountRate) {
    return {
      price: uniqueCandidates[0],
      originalPrice: uniqueCandidates[uniqueCandidates.length - 1],
      discountRate,
      priceSource: "fallback.priceCandidates.lowestWithDiscountRate",
      originalPriceSource: "fallback.priceCandidates.highestWithDiscountRate",
      discountRateSource: "fallback.discountRate",
    };
  }

  const price = discountedPrice || bodyProductPrice || bodyAnyPrice || listedPrice || null;
  const originalPrice = listedPrice && price && listedPrice > price ? listedPrice : null;

  return {
    price,
    originalPrice,
    discountRate: discountRate || calculateDiscountRate(price, originalPrice),
    priceSource: discountedPrice
      ? "fallback.discountedSalePrice"
      : bodyProductPrice
        ? "fallback.body.productPrice"
        : bodyAnyPrice
          ? "fallback.body.price"
          : listedPrice
            ? "fallback.salePrice"
            : null,
    originalPriceSource: originalPrice !== null ? "fallback.salePrice|fallback.dispSalePrice" : null,
    discountRateSource: discountRate ? "fallback.discountRate" : originalPrice ? "fallback.computed" : null,
  };
}

function extractBodyProductPrice(text) {
  return firstNumberByPatterns(text, [
    /상품\s*가격\s*([0-9][0-9,.\s]*)\s*원/i,
    /판매\s*가격\s*([0-9][0-9,.\s]*)\s*원/i,
    /현재\s*판매가\s*([0-9][0-9,.\s]*)\s*원/i,
  ]);
}

function extractDiscountRate(text) {
  return firstNumberByPatterns(text, [
    /([0-9]{1,2})\s*%\s*(?:할인|SALE|sale)?/i,
    /할인율\s*([0-9]{1,2})\s*%/i,
  ]);
}

function calculateDiscountRate(price, originalPrice) {
  if (!price || !originalPrice || originalPrice <= price) {
    return null;
  }
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function firstNumberByPatterns(text, patterns) {
  for (const pattern of patterns) {
    const match = String(text || "").match(pattern);
    if (match) {
      return parseKoreanNumber(match[1]);
    }
  }
  return null;
}

function extractProductId(currentUrl) {
  try {
    const url = new URL(currentUrl);
    const queryId = url.searchParams.get("productId") || url.searchParams.get("productNo") || url.searchParams.get("nv_mid");
    if (queryId && /^\d{6,}$/.test(queryId)) {
      return queryId;
    }
    const pathMatch = url.pathname.match(/(?:products|product)[/-](\d{6,})/i);
    if (pathMatch) {
      return pathMatch[1];
    }
  } catch {
    const rawMatch = String(currentUrl || "").match(/(?:products|product)[/-](\d{6,})/i);
    return rawMatch ? rawMatch[1] : null;
  }
  return null;
}

function parseKoreanNumber(value) {
  if (!value) {
    return null;
  }
  const normalized = String(value).replaceAll(",", "").replaceAll(/\s+/g, "");
  const number = Number.parseFloat(normalized);
  if (Number.isNaN(number)) {
    return null;
  }
  if (normalized.includes("만")) {
    return Math.round(number * 10000);
  }
  if (normalized.includes("천")) {
    return Math.round(number * 1000);
  }
  return Math.round(number);
}

function escapeRegExp(value) {
  return String(value).replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function copyText(text) {
  if (!text) {
    return;
  }

  await navigator.clipboard.writeText(text);
  setStatus("클립보드에 복사했습니다.");
}

function setStatus(message) {
  elements.statusText.textContent = message;
}

function formatNumber(value) {
  if (typeof value !== "number") {
    return value;
  }
  return new Intl.NumberFormat("ko-KR").format(value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
