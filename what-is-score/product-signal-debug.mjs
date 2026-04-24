const DEFAULT_TIMEOUT_MS = 10000;
const MAX_SNIPPETS_PER_SIGNAL = 8;
const NAVER_RATE_LIMIT_MESSAGE =
  "네이버가 자동 요청을 제한했습니다. 서버 직접 수집 대신 브라우저 기반 수집, 외부 크롤링 API, 또는 수동 입력 기반 추적 방식이 필요합니다.";

const SIGNAL_PATTERNS = [
  {
    key: "purchaseCountText",
    label: "purchase",
    patterns: [
      /(?:구매|판매|주문)\s*(?:건수|수|횟수|누적)?\s*[:：]?\s*([0-9,.\s]+(?:만|천)?\s*(?:개|건|회|명)?)/gi,
      /([0-9,.\s]+(?:만|천)?\s*(?:개|건|회|명)?)\s*(?:구매|판매|주문)/gi,
      /purchase(?:Count|Cnt|_count)?["'\s:=]+([0-9,]+)/gi,
      /sale(?:Count|Cnt|_count)?["'\s:=]+([0-9,]+)/gi,
    ],
  },
  {
    key: "reviewCount",
    label: "review",
    patterns: [
      /(?:리뷰|상품평|후기)\s*(?:수)?\s*[:：]?\s*([0-9,.\s]+(?:만|천)?\s*(?:개|건|회|명)?)/gi,
      /([0-9,.\s]+(?:만|천)?\s*(?:개|건|회|명)?)\s*(?:리뷰|상품평|후기)/gi,
      /review(?:Count|Cnt|_count)?["'\s:=]+([0-9,]+)/gi,
    ],
  },
  {
    key: "favoriteCount",
    label: "favorite",
    patterns: [
      /(?:찜|관심|좋아요)\s*(?:수)?\s*[:：]?\s*([0-9,.\s]+(?:만|천)?\s*(?:개|건|회|명)?)/gi,
      /([0-9,.\s]+(?:만|천)?\s*(?:개|건|회|명)?)\s*(?:찜|관심|좋아요)/gi,
      /(?:favorite|wish|like)(?:Count|Cnt|_count)?["'\s:=]+([0-9,]+)/gi,
    ],
  },
];

export function extractNaverProductId(inputUrl) {
  if (!inputUrl) {
    return null;
  }

  try {
    const url = new URL(inputUrl);
    const productIdFromQuery =
      url.searchParams.get("productId") ||
      url.searchParams.get("productNo") ||
      url.searchParams.get("nv_mid") ||
      url.searchParams.get("NaPm");

    if (productIdFromQuery && /^\d{6,}$/.test(productIdFromQuery)) {
      return productIdFromQuery;
    }

    const pathMatch = url.pathname.match(/(?:products|catalog|product)[/-](\d{6,})/i);
    if (pathMatch) {
      return pathMatch[1];
    }

    const numericSegments = url.pathname.match(/\d{6,}/g);
    return numericSegments ? numericSegments[numericSegments.length - 1] : null;
  } catch {
    const rawMatch = String(inputUrl).match(/(?:products|catalog|product)[/-](\d{6,})/i);
    return rawMatch ? rawMatch[1] : null;
  }
}

export async function debugProductSignal(inputUrl, options = {}) {
  const productId = extractNaverProductId(inputUrl);

  if (!inputUrl) {
    return {
      ok: false,
      productId,
      detectedSignals: [],
      message: "상품 URL을 입력해주세요.",
    };
  }

  let page;
  try {
    page = await fetchProductPage(inputUrl, options);
  } catch (error) {
    return {
      ok: false,
      productId,
      detectedSignals: [],
      message: error instanceof Error ? error.message : "상품 페이지를 가져오지 못했습니다.",
    };
  }

  const normalizedText = normalizePageText(page.body);
  const detectedSignals = detectSignals(page.body, normalizedText);
  const metadata = detectMetadata(page.body, normalizedText);

  return {
    ok: true,
    productId: productId || metadata.productId || null,
    detectedSignals,
    purchaseCountText: pickFirstValue(detectedSignals, "purchaseCountText"),
    reviewCount: parseKoreanNumber(pickFirstValue(detectedSignals, "reviewCount")),
    favoriteCount: parseKoreanNumber(pickFirstValue(detectedSignals, "favoriteCount")),
    productTitle: metadata.productTitle,
    storeName: metadata.storeName,
    fetchStatus: page.status,
    finalUrl: page.finalUrl,
    contentType: page.contentType,
    message: detectedSignals.length
      ? "공개 페이지 텍스트/스크립트에서 판매신호 후보를 감지했습니다."
      : "페이지는 가져왔지만 구매수, 리뷰수, 찜수 후보를 찾지 못했습니다.",
  };
}

async function fetchProductPage(inputUrl, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(inputUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        referer: "https://shopping.naver.com/",
        "user-agent":
          options.userAgent ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
    });

    const body = await response.text();
    if (!response.ok) {
      if (response.status === 429) {
        throw new ProductSignalFetchError(NAVER_RATE_LIMIT_MESSAGE, response.status);
      }
      throw new Error(`상품 페이지 fetch 실패: HTTP ${response.status}`);
    }

    return {
      status: response.status,
      finalUrl: response.url,
      contentType: response.headers.get("content-type") || "",
      body,
    };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("상품 페이지 fetch 시간이 초과되었습니다.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

class ProductSignalFetchError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ProductSignalFetchError";
    this.status = status;
  }
}

function detectSignals(rawHtml, normalizedText) {
  const haystacks = [
    { source: "text", value: normalizedText },
    { source: "script", value: extractScriptText(rawHtml) },
  ];
  const signals = [];

  for (const signal of SIGNAL_PATTERNS) {
    for (const haystack of haystacks) {
      for (const pattern of signal.patterns) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(haystack.value)) && signals.length < 120) {
          signals.push({
            type: signal.key,
            source: haystack.source,
            value: cleanupValue(match[1] || match[0]),
            snippet: buildSnippet(haystack.value, match.index, match[0].length),
          });

          const sameTypeCount = signals.filter((item) => item.type === signal.key).length;
          if (sameTypeCount >= MAX_SNIPPETS_PER_SIGNAL) {
            break;
          }
        }
      }
    }
  }

  return dedupeSignals(signals);
}

function detectMetadata(rawHtml, normalizedText) {
  return {
    productId: firstMatch(rawHtml, /(?:productId|productNo|channelProductNo|nv_mid)["'\s:=]+["']?(\d{6,})/i),
    productTitle:
      firstMeta(rawHtml, "og:title") ||
      firstMeta(rawHtml, "twitter:title") ||
      firstMatch(normalizedText, /상품명\s*[:：]?\s*([^\n]{2,80})/),
    storeName:
      firstMeta(rawHtml, "og:site_name") ||
      firstMatch(rawHtml, /(?:channelName|storeName|mallName)["'\s:=]+["']([^"']{2,80})/i) ||
      firstMatch(normalizedText, /(?:스토어|판매자|상호)\s*[:：]?\s*([^\n]{2,60})/),
  };
}

function normalizePageText(html) {
  return String(html || "")
    .replaceAll(/<script[\s\S]*?<\/script>/gi, "\n")
    .replaceAll(/<style[\s\S]*?<\/style>/gi, "\n")
    .replaceAll(/<[^>]+>/g, "\n")
    .replaceAll(/&nbsp;/g, " ")
    .replaceAll(/&amp;/g, "&")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function extractScriptText(html) {
  return Array.from(String(html || "").matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi))
    .map((match) => match[1])
    .join("\n")
    .replaceAll(/\s+/g, " ");
}

function firstMeta(html, property) {
  const escaped = property.replaceAll(":", "\\:");
  return (
    firstMatch(html, new RegExp(`<meta[^>]+property=["']${escaped}["'][^>]+content=["']([^"']+)["']`, "i")) ||
    firstMatch(html, new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escaped}["']`, "i")) ||
    null
  );
}

function firstMatch(value, pattern) {
  const match = String(value || "").match(pattern);
  return match ? cleanupValue(match[1]) : null;
}

function pickFirstValue(signals, type) {
  const signal = signals.find((item) => item.type === type);
  return signal ? signal.value : null;
}

function cleanupValue(value) {
  return String(value || "")
    .replaceAll(/\\u003c|\\u003e/gi, "")
    .replaceAll(/\\"/g, '"')
    .replaceAll(/\s+/g, " ")
    .trim();
}

function buildSnippet(value, index, length) {
  const start = Math.max(0, index - 80);
  const end = Math.min(value.length, index + length + 80);
  return cleanupValue(value.slice(start, end));
}

function dedupeSignals(signals) {
  const seen = new Set();
  return signals.filter((signal) => {
    const key = `${signal.type}:${signal.source}:${signal.value}:${signal.snippet}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
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

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const inputUrl = process.argv[2];
  const result = await debugProductSignal(inputUrl);
  console.log(JSON.stringify(result, null, 2));
}
