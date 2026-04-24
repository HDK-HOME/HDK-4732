(() => {
const SIGNAL_GROUPS = [
  {
    type: "purchase",
    label: "구매/판매/주문",
    keywords: ["구매", "판매", "주문", "purchase", "sale", "sales", "order", "orders"],
  },
  {
    type: "review",
    label: "리뷰/상품평/후기",
    keywords: ["리뷰", "상품평", "후기", "review", "reviews"],
  },
  {
    type: "favorite",
    label: "찜/관심/좋아요",
    keywords: ["찜", "관심", "좋아요", "favorite", "favorites", "wish", "wishes", "like", "likes"],
  },
];

const EXCLUDED_BODY_SIGNAL_PATTERNS = [
  /도착\s*확률/i,
  /도착보장/i,
  /배송비|무료배송|배송\s*비/i,
  /[0-9,]+\s*원/,
  /사업자등록번호|통신판매업신고번호/i,
  /고객센터|전화전클릭|팩스|1588|1599|080-/i,
  /\border\b\s*[:=]?\s*\d{1,3}\b/i,
  /평점|별점|rating/i,
  /이미지|image|thumbnail|photo/i,
  /할인율|할인\s*율|discountRate|discount\s*rate/i,
];

const BLOCK_PATTERNS = [
  { reason: "LOGIN_REQUIRED", pattern: /로그인이\s*필요|로그인\s*후|login required/i },
  { reason: "CAPTCHA", pattern: /captcha|캡차|자동입력|보안문자/i },
  { reason: "ABNORMAL_TRAFFIC", pattern: /비정상\s*트래픽|비정상적인\s*요청|자동화된\s*요청|자동\s*요청/i },
  { reason: "ACCESS_DENIED", pattern: /접근이\s*제한|접근\s*제한|access\s*denied|forbidden/i },
  { reason: "SERVICE_UNAVAILABLE", pattern: /현재\s*서비스\s*접속이\s*불가|잠시\s*후\s*다시\s*접속/i },
];

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "COLLECT_SIGNALS") {
    const result = collectSignals();
    sendResponse(result);
    return true;
  }

  return false;
});

globalThis.__WHAT_IS_SCORE_COLLECT_SIGNALS__ = collectSignals;

function collectSignals() {
  const currentUrl = location.href;
  const bodyText = normalizeText(document.body?.innerText || "");
  const scripts = Array.from(document.scripts)
    .map((script) => script.textContent || "")
    .filter(Boolean);
  const scriptText = scripts.join("\n");
  const blockedReason = detectBlockedReason(`${document.title}\n${bodyText}\n${scriptText}`);
  const detectedSignals = blockedReason ? [] : detectSignals(bodyText, scriptText);
  const scriptJsonCandidates = blockedReason ? [] : extractScriptJsonCandidates(scriptText);
  const productId = extractProductId(currentUrl, scriptText);
  const catalogId = extractCatalogId(currentUrl, scriptText);
  const productTitle = extractProductTitle(scriptText) || getMeta("og:title") || document.title || null;
  const storeName = extractStoreName(currentUrl, scriptText) || getMeta("og:site_name");
  const normalizedSignals = blockedReason
    ? buildBlockedNormalizedSignals(productId, catalogId, productTitle, storeName, blockedReason)
    : buildNormalizedSignals({
        currentUrl,
        scriptText,
        bodyText,
        productId,
        catalogId,
        productTitle,
        storeName,
      });

  const result = {
    ok: !blockedReason,
    source: "chrome-extension",
    schemaVersion: 2,
    collectedAt: new Date().toISOString(),
    currentUrl,
    normalizedSignals,
    productId,
    catalogId,
    documentTitle: document.title || null,
    metaTitle: getMeta("og:title") || getMeta("twitter:title") || getMetaByName("title"),
    metaDescription: getMeta("og:description") || getMetaByName("description"),
    productTitle,
    storeName,
    bodyTextPreview: bodyText.slice(0, 1600),
    scriptJsonCandidates,
    detectedSignals,
    blockedReason,
    rawCandidates: {
      bodyLength: bodyText.length,
      scriptCount: scripts.length,
      jsonCandidateCount: scriptJsonCandidates.length,
    },
    confidence: normalizedSignals.confidence,
    message: blockedReason
      ? "현재 페이지에서 차단/로그인/캡차/비정상 트래픽 문구가 감지되었습니다."
      : "사용자 브라우저에서 공개 페이지를 읽어 감지한 판매신호입니다. 네이버 공식 판매량 지표가 아닌 추정/공개 신호입니다.",
  };

  return result;
}

function buildNormalizedSignals({ scriptText, bodyText, productId, catalogId, productTitle, storeName }) {
  const saleCount = firstNumberByKeys(scriptText, ["saleCount"]);
  const reviewCount =
    firstNumberByPath(scriptText, ["reviewAmount", "totalReviewCount"]) ||
    firstNumberByKeys(scriptText, ["totalReviewCount", "reviewCount"]) ||
    extractReviewCount(bodyText);
  const interestCustomerCount =
    firstNumberByKeys(scriptText, [
      "zzimProductCount",
      "zzimCount",
      "wishCount",
      "favoriteCount",
      "interestCustomerCount",
      "interestCount",
      "keepCount",
    ]) || extractInterestCustomerCount(bodyText);
  const priceFields = extractPriceFields(scriptText, bodyText);

  const normalized = {
    saleCount,
    reviewCount,
    interestCustomerCount,
    price: priceFields.price,
    originalPrice: priceFields.originalPrice,
    discountRate: priceFields.discountRate,
    productId,
    catalogId,
    productTitle,
    storeName,
    channelName: firstStringValue(scriptText, "channelName") || storeName,
    productNo: firstNumberByKeys(scriptText, ["productNo", "channelProductNo"]),
    discountedSalePrice: priceFields.price,
    confidence: "none",
    sources: {
      saleCount: saleCount !== null ? "script.saleCount" : null,
      reviewCount: reviewCount !== null ? "script.totalReviewCount|script.reviewAmount.totalReviewCount|body.review" : null,
      interestCustomerCount: interestCustomerCount !== null ? "script.zzimProductCount|body.interest" : null,
      price: priceFields.price !== null ? priceFields.priceSource : null,
      originalPrice: priceFields.originalPrice !== null ? priceFields.originalPriceSource : null,
      discountRate: priceFields.discountRate !== null ? priceFields.discountRateSource : null,
    },
  };

  const strongCount = [saleCount, reviewCount, interestCustomerCount].filter((value) => value !== null).length;
  if (saleCount !== null && reviewCount !== null) {
    normalized.confidence = "high";
  } else if (strongCount > 0) {
    normalized.confidence = "medium";
  } else {
    normalized.confidence = "low";
  }

  return normalized;
}

function buildBlockedNormalizedSignals(productId, catalogId, productTitle, storeName, blockedReason) {
  return {
    saleCount: null,
    reviewCount: null,
    interestCustomerCount: null,
    productId,
    catalogId,
    productTitle,
    storeName,
    channelName: storeName,
    productNo: productId ? Number.parseInt(productId, 10) : null,
    price: null,
    originalPrice: null,
    discountRate: null,
    discountedSalePrice: null,
    confidence: "blocked",
    blockedReason,
    sources: {},
  };
}

function extractProductId(currentUrl, scriptText) {
  try {
    const url = new URL(currentUrl);
    const queryId = url.searchParams.get("productId") || url.searchParams.get("productNo") || url.searchParams.get("nv_mid");
    if (isLikelyId(queryId)) {
      return queryId;
    }

    const pathMatch = url.pathname.match(/(?:products|product)[/-](\d{6,})/i);
    if (pathMatch) {
      return pathMatch[1];
    }

    const numericSegments = url.pathname.match(/\d{6,}/g);
    if (numericSegments) {
      return numericSegments[numericSegments.length - 1];
    }
  } catch {
    const rawMatch = String(currentUrl).match(/(?:products|product)[/-](\d{6,})/i);
    if (rawMatch) {
      return rawMatch[1];
    }
  }

  return firstMatch(scriptText, /(?:productId|productNo|channelProductNo)["'\s:=]+["']?(\d{6,})/i);
}

function extractCatalogId(currentUrl, scriptText) {
  try {
    const url = new URL(currentUrl);
    const queryId = url.searchParams.get("catalogId") || url.searchParams.get("cat_id");
    if (isLikelyId(queryId)) {
      return queryId;
    }

    const pathMatch = url.pathname.match(/(?:catalog|catalogs)[/-](\d{6,})/i);
    if (pathMatch) {
      return pathMatch[1];
    }
  } catch {
    return null;
  }

  return firstMatch(scriptText, /(?:catalogId|catalogNo)["'\s:=]+["']?(\d{6,})/i);
}

function extractProductTitle(scriptText) {
  return (
    firstStringValue(scriptText, "productName") ||
    firstStringValue(scriptText, "productTitle") ||
    firstStringValue(scriptText, "name") ||
    firstStringValue(scriptText, "title")
  );
}

function extractStoreName(currentUrl, scriptText) {
  const scriptStore =
    firstStringValue(scriptText, "channelName") ||
    firstStringValue(scriptText, "storeName") ||
    firstStringValue(scriptText, "mallName") ||
    firstStringValue(scriptText, "sellerName");

  if (scriptStore) {
    return scriptStore;
  }

  try {
    const url = new URL(currentUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    if (url.hostname.includes("smartstore.naver.com") || url.hostname.includes("brand.naver.com")) {
      return parts[0] || null;
    }
  } catch {
    return null;
  }

  return null;
}

function detectSignals(bodyText, scriptText) {
  const signals = [];
  const sources = [
    { source: "body", text: bodyText },
    { source: "script", text: scriptText },
  ];

  for (const group of SIGNAL_GROUPS) {
    for (const source of sources) {
      for (const keyword of group.keywords) {
        const contextPattern = new RegExp(`.{0,70}${escapeRegExp(keyword)}.{0,90}`, "gi");
        for (const match of source.text.matchAll(contextPattern)) {
          const snippet = cleanup(match[0]);
          if (shouldExcludeSignalSnippet(snippet, source.source, keyword)) {
            continue;
          }
          signals.push({
            type: group.type,
            label: group.label,
            keyword,
            valueText: extractValueText(snippet),
            valueNumber: parseSignalNumber(snippet),
            source: source.source,
            snippet,
          });
          if (signals.length >= 100) {
            return dedupeSignals(signals);
          }
        }
      }

      const numberPattern = new RegExp(
        `(?:${group.keywords.map(escapeRegExp).join("|")})[^0-9]{0,24}([0-9][0-9,.\\s]*(?:만|천)?)`,
        "gi"
      );
      for (const match of source.text.matchAll(numberPattern)) {
        const snippet = cleanup(match[0]);
        if (shouldExcludeSignalSnippet(snippet, source.source, group.label)) {
          continue;
        }
        signals.push({
          type: group.type,
          label: group.label,
          keyword: group.label,
          valueText: cleanup(match[1]),
          valueNumber: parseKoreanNumber(match[1]),
          source: source.source,
          snippet,
        });
      }
    }
  }

  return dedupeSignals(signals).slice(0, 100);
}

function extractScriptJsonCandidates(scriptText) {
  const keyPattern =
    /(?:productId|productNo|catalogId|channelProductNo|productName|channelName|storeName|mallName|sellerName|purchase|sale|order|review|favorite|wish|like)[\s\S]{0,500}/gi;

  return Array.from(scriptText.matchAll(keyPattern))
    .slice(0, 30)
    .map((match) => cleanup(match[0]).slice(0, 500));
}

function detectBlockedReason(text) {
  for (const item of BLOCK_PATTERNS) {
    if (item.pattern.test(text)) {
      return item.reason;
    }
  }
  return null;
}

function buildConfidence(signals) {
  if (signals.some((signal) => signal.valueNumber !== null && signal.source === "body")) {
    return "visible";
  }
  if (signals.some((signal) => signal.valueNumber !== null && signal.source === "script")) {
    return "script-candidate";
  }
  if (signals.length) {
    return "candidate";
  }
  return "none";
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

function firstNumberByPath(text, path) {
  const [parent, child] = path;
  const parentPattern = new RegExp(`["']${escapeRegExp(parent)}["']\\s*:\\s*\\{([\\s\\S]{0,1500}?)\\}`, "i");
  const parentMatch = String(text || "").match(parentPattern);
  if (!parentMatch) {
    return null;
  }
  return firstNumberByKeys(parentMatch[1], [child]);
}

function extractInterestCustomerCount(bodyText) {
  const patterns = [
    /관심\s*고객\s*수\s*([0-9][0-9,.\s]*(?:만|천)?)/i,
    /([0-9][0-9,.\s]*(?:만|천)?)\s*(?:명의\s*)?관심\s*고객/i,
    /찜\s*([0-9][0-9,.\s]*(?:만|천)?)/i,
  ];

  for (const pattern of patterns) {
    const match = String(bodyText || "").match(pattern);
    if (match) {
      return parseKoreanNumber(match[1]);
    }
  }

  return null;
}

function extractReviewCount(bodyText) {
  const patterns = [
    /([0-9][0-9,.\s]*(?:만|천)?)\s*건\s*(?:리뷰|상품평|후기)/i,
    /(?:리뷰|상품평|후기)\s*([0-9][0-9,.\s]*(?:만|천)?)\s*건?/i,
  ];

  for (const pattern of patterns) {
    const match = String(bodyText || "").match(pattern);
    if (match) {
      return parseKoreanNumber(match[1]);
    }
  }

  return null;
}

function extractBodyPrice(bodyText) {
  const patterns = [
    /(?:현재가|판매가|할인가|상품가격|가격)\s*([0-9][0-9,.\s]*)\s*원/i,
    /([0-9][0-9,.\s]*)\s*원\s*(?:구매혜택|상품정보|혜택|배송)/i,
  ];

  for (const pattern of patterns) {
    const match = String(bodyText || "").match(pattern);
    if (match) {
      return parseKoreanNumber(match[1]);
    }
  }

  return null;
}

function extractPriceFields(scriptText, bodyText) {
  const discountedPrice = firstNumberByKeys(scriptText, ["discountedSalePrice", "mobileDiscountedSalePrice"]);
  const listedPrice = firstNumberByKeys(scriptText, ["salePrice", "dispSalePrice", "mobileSalePrice", "price"]);
  const bodyProductPrice = extractBodyProductPrice(bodyText);
  const bodyAnyPrice = extractBodyPrice(bodyText);
  const discountRate = firstNumberByKeys(scriptText, ["discountRate", "mobileDiscountRate"]) || extractDiscountRate(bodyText);
  const candidates = [discountedPrice, listedPrice, bodyProductPrice, bodyAnyPrice]
    .filter((value) => value !== null && value > 0);
  const uniqueCandidates = Array.from(new Set(candidates)).sort((a, b) => a - b);

  if (uniqueCandidates.length >= 2 && discountRate) {
    return {
      price: uniqueCandidates[0],
      originalPrice: uniqueCandidates[uniqueCandidates.length - 1],
      discountRate,
      priceSource: "priceCandidates.lowestWithDiscountRate",
      originalPriceSource: "priceCandidates.highestWithDiscountRate",
      discountRateSource: "script.discountRate|body.discountRate",
    };
  }

  const price = discountedPrice || bodyProductPrice || bodyAnyPrice || listedPrice || null;
  const originalPrice = listedPrice && price && listedPrice > price ? listedPrice : null;

  return {
    price,
    originalPrice,
    discountRate: discountRate || calculateDiscountRate(price, originalPrice),
    priceSource: discountedPrice
      ? "script.discountedSalePrice|script.mobileDiscountedSalePrice"
      : bodyProductPrice
        ? "body.productPrice"
        : bodyAnyPrice
          ? "body.price"
          : listedPrice
            ? "script.salePrice"
            : null,
    originalPriceSource: originalPrice !== null ? "script.salePrice|script.dispSalePrice" : null,
    discountRateSource: discountRate ? "script.discountRate|body.discountRate" : originalPrice ? "computed" : null,
  };
}

function extractBodyProductPrice(bodyText) {
  const patterns = [
    /상품\s*가격\s*([0-9][0-9,.\s]*)\s*원/i,
    /판매\s*가격\s*([0-9][0-9,.\s]*)\s*원/i,
    /현재\s*판매가\s*([0-9][0-9,.\s]*)\s*원/i,
  ];

  for (const pattern of patterns) {
    const match = String(bodyText || "").match(pattern);
    if (match) {
      return parseKoreanNumber(match[1]);
    }
  }

  return null;
}

function extractDiscountRate(bodyText) {
  const patterns = [
    /([0-9]{1,2})\s*%\s*(?:할인|SALE|sale)?/i,
    /할인율\s*([0-9]{1,2})\s*%/i,
  ];

  for (const pattern of patterns) {
    const match = String(bodyText || "").match(pattern);
    if (match) {
      return parseKoreanNumber(match[1]);
    }
  }

  return null;
}

function calculateDiscountRate(price, originalPrice) {
  if (!price || !originalPrice || originalPrice <= price) {
    return null;
  }
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function shouldExcludeSignalSnippet(snippet, source, keyword) {
  if (source === "script" && /\border|orders\b/i.test(keyword) && !/(orderCount|order_count|totalOrder|purchase|sale)/i.test(snippet)) {
    return true;
  }

  return EXCLUDED_BODY_SIGNAL_PATTERNS.some((pattern) => pattern.test(snippet));
}

function getMeta(property) {
  return document.querySelector(`meta[property="${property}"]`)?.content?.trim() || null;
}

function getMetaByName(name) {
  return document.querySelector(`meta[name="${name}"]`)?.content?.trim() || null;
}

function firstMatch(text, pattern) {
  const match = String(text || "").match(pattern);
  return match ? cleanup(match[1]) : null;
}

function firstStringValue(text, key) {
  const pattern = new RegExp(`["']${escapeRegExp(key)}["']\\s*:\\s*["']([^"']{2,160})["']`, "i");
  return firstMatch(text, pattern);
}

function isLikelyId(value) {
  return Boolean(value && /^\d{6,}$/.test(value));
}

function extractValueText(snippet) {
  const match =
    snippet.match(/([0-9][0-9,.\s]*(?:만|천)?\s*(?:개|건|회|명)?)/) ||
    snippet.match(/(?:구매|판매|주문|리뷰|상품평|후기|찜|관심|좋아요)\s*([^ ]{1,30})/);
  return match ? cleanup(match[1]) : null;
}

function parseSignalNumber(snippet) {
  const valueText = extractValueText(snippet);
  return parseKoreanNumber(valueText);
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

function normalizeText(value) {
  return cleanup(value).replaceAll(/\n{3,}/g, "\n\n");
}

function cleanup(value) {
  return String(value || "").replaceAll(/\s+/g, " ").trim();
}

function dedupeSignals(signals) {
  const seen = new Set();
  return signals.filter((signal) => {
    const key = `${signal.type}:${signal.source}:${signal.keyword}:${signal.snippet}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function escapeRegExp(value) {
  return String(value).replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

})();
