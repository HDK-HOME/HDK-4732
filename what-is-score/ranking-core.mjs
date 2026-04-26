export const MAX_RESULTS = 500;
export const PAGE_SIZE = 100;

export function resolveCredentials(runtimeEnv = {}, processEnv = {}) {
  return {
    clientId: runtimeEnv.NAVER_CLIENT_ID || processEnv.NAVER_CLIENT_ID || "",
    clientSecret: runtimeEnv.NAVER_CLIENT_SECRET || processEnv.NAVER_CLIENT_SECRET || "",
  };
}

export async function getRankingPayload({ store, keyword, mode = "api", limit = 100, runtimeEnv = {}, processEnv = {} }) {
  const safeLimit = clampLimit(limit);

  if (!store || !keyword) {
    return {
      status: 400,
      payload: {
        ok: false,
        error: "bad_request",
        message: "store and keyword are required",
      },
    };
  }

  if (mode !== "api") {
    return {
      status: 400,
      payload: {
        ok: false,
        error: "unsupported_mode",
        message: "Only api mode is available right now. Web mode is reserved for future crawling logic.",
      },
    };
  }

  const { clientId, clientSecret } = resolveCredentials(runtimeEnv, processEnv);

  if (!clientId || !clientSecret) {
    return {
      status: 400,
      payload: {
        ok: false,
        error: "missing_credentials",
        message: "Set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET before calling the API.",
      },
    };
  }

  const pages = buildPages(safeLimit);
  const allItems = [];

  for (const page of pages) {
    const pageItems = await fetchShoppingPage(keyword, page.start, page.display, clientId, clientSecret);
    allItems.push(...pageItems);

    if (pageItems.length < page.display) {
      break;
    }
  }

  const normalizedStore = normalizeText(store);
  const looseNormalizedStore = normalizeStoreName(store);
  const filteredItems = allItems.slice(0, safeLimit).map((item, index) => ({
    rank: index + 1,
    title: stripTags(item.title || ""),
    mallName: item.mallName || "",
    normalizedMallName: normalizeStoreName(item.mallName || ""),
    link: item.link || "",
    image: item.image || "",
    lprice: Number.parseInt(item.lprice || "0", 10) || 0,
    productId: item.productId || "",
  }));

  const matches = filteredItems.filter((item) => {
    const exact = normalizeText(item.mallName).includes(normalizedStore);
    const loose =
      looseNormalizedStore &&
      item.normalizedMallName &&
      (item.normalizedMallName.includes(looseNormalizedStore) ||
        looseNormalizedStore.includes(item.normalizedMallName));
    return exact || loose;
  });

  const best = matches[0] || null;
  const candidateMallNames = buildCandidateMallNames(filteredItems, normalizedStore, looseNormalizedStore);

  return {
    status: 200,
    payload: {
      ok: true,
      mode,
      modeLabel: "네이버 공식 API 기준",
      keyword,
      store,
      limit: safeLimit,
      fetchedCount: filteredItems.length,
      bestRank: best ? best.rank : null,
      matches,
      debugMallNames: filteredItems.map((item) => ({
        rank: item.rank,
        title: item.title,
        mallName: item.mallName,
        normalizedMallName: item.normalizedMallName,
        link: item.link,
        lprice: item.lprice,
      })),
      candidateMallNames,
      items: filteredItems,
    },
  };
}

async function fetchShoppingPage(keyword, start, display, clientId, clientSecret) {
  const url = new URL("https://openapi.naver.com/v1/search/shop.json");
  url.searchParams.set("query", keyword);
  url.searchParams.set("display", String(display));
  url.searchParams.set("start", String(start));
  url.searchParams.set("sort", "sim");

  const result = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
      Accept: "application/json",
      "User-Agent": "what-is-score/1.0",
    },
  });

  if (!result.ok) {
    throw new Error(`Naver API request failed with status ${result.status}`);
  }

  const data = await result.json();
  return Array.isArray(data.items) ? data.items : [];
}

function clampLimit(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 100;
  }
  return Math.max(1, Math.min(MAX_RESULTS, parsed));
}

function buildPages(limit) {
  const pages = [];
  for (let start = 1; start <= limit; start += PAGE_SIZE) {
    const remaining = limit - start + 1;
    pages.push({
      start,
      display: Math.min(PAGE_SIZE, remaining),
    });
  }
  return pages;
}

function normalizeText(value) {
  return String(value || "").replaceAll(/\s+/g, "").toLowerCase();
}

function normalizeStoreName(value) {
  return normalizeText(value)
    .replaceAll(/\(주\)|주식회사|공식스토어|공식몰|공식|스토어|smartstore|shop|몰/gi, "")
    .replaceAll(/[^0-9a-z가-힣]/gi, "");
}

function stripTags(value) {
  return String(value || "").replaceAll(/<[^>]+>/g, "");
}

function buildCandidateMallNames(items, normalizedStore, looseNormalizedStore) {
  const seen = new Set();
  return items
    .map((item) => {
      const raw = normalizeText(item.mallName);
      const loose = item.normalizedMallName;
      let score = 0;

      if (raw === normalizedStore) {
        score += 100;
      }
      if (raw.includes(normalizedStore) || normalizedStore.includes(raw)) {
        score += 60;
      }
      if (loose && looseNormalizedStore && loose === looseNormalizedStore) {
        score += 90;
      }
      if (loose && looseNormalizedStore && (loose.includes(looseNormalizedStore) || looseNormalizedStore.includes(loose))) {
        score += 50;
      }
      score += sharedCharacters(loose, looseNormalizedStore);

      return {
        rank: item.rank,
        mallName: item.mallName,
        normalizedMallName: item.normalizedMallName,
        title: item.title,
        score,
      };
    })
    .filter((item) => {
      const key = `${item.mallName}-${item.rank}`;
      if (seen.has(key) || item.score <= 0) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((left, right) => right.score - left.score || left.rank - right.rank)
    .slice(0, 10);
}

function sharedCharacters(left, right) {
  if (!left || !right) {
    return 0;
  }

  let score = 0;
  for (const char of new Set(left.split(""))) {
    if (right.includes(char)) {
      score += 2;
    }
  }
  return score;
}
