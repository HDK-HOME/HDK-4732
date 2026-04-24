const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

const HOST = "0.0.0.0";
const PORT = Number.parseInt(process.env.PORT || "8000", 10);
const ROOT = __dirname;
const CLIENT_ID = process.env.NAVER_CLIENT_ID || "";
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || "";
const MAX_RESULTS = 500;
const PAGE_SIZE = 100;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (requestUrl.pathname === "/api/ranking") {
      await handleRankingApi(requestUrl, response);
      return;
    }

    serveStatic(requestUrl.pathname, response);
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: "server_error",
      message: error instanceof Error ? error.message : "Unknown server error",
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`What Is Score server running on http://${HOST}:${PORT}`);
});

async function handleRankingApi(requestUrl, response) {
  const store = requestUrl.searchParams.get("store")?.trim() || "";
  const keyword = requestUrl.searchParams.get("keyword")?.trim() || "";
  const mode = requestUrl.searchParams.get("mode")?.trim() || "api";
  const requestedLimit = Number.parseInt(requestUrl.searchParams.get("limit") || "100", 10);
  const limit = Math.max(1, Math.min(MAX_RESULTS, Number.isNaN(requestedLimit) ? 100 : requestedLimit));

  if (!store || !keyword) {
    sendJson(response, 400, {
      ok: false,
      error: "bad_request",
      message: "store and keyword are required",
    });
    return;
  }

  if (mode !== "api") {
    sendJson(response, 400, {
      ok: false,
      error: "unsupported_mode",
      message: "Only api mode is available right now. Web mode is reserved for future crawling logic.",
    });
    return;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    sendJson(response, 400, {
      ok: false,
      error: "missing_credentials",
      message: "Set NAVER_CLIENT_ID and NAVER_CLIENT_SECRET before calling the API.",
    });
    return;
  }

  const pages = buildPages(limit);
  const allItems = [];

  for (const page of pages) {
    const pageItems = await fetchShoppingPage(keyword, page.start, page.display);
    allItems.push(...pageItems);

    if (pageItems.length < page.display) {
      break;
    }
  }

  const normalizedStore = normalizeText(store);
  const looseNormalizedStore = normalizeStoreName(store);
  const filteredItems = allItems.slice(0, limit).map((item, index) => ({
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

  sendJson(response, 200, {
    ok: true,
    mode,
    modeLabel: "네이버 공식 API 기준",
    keyword,
    store,
    limit,
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
  });
}

async function fetchShoppingPage(keyword, start, display) {
  const url = new URL("https://openapi.naver.com/v1/search/shop.json");
  url.searchParams.set("query", keyword);
  url.searchParams.set("display", String(display));
  url.searchParams.set("start", String(start));
  url.searchParams.set("sort", "sim");

  const result = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": CLIENT_ID,
      "X-Naver-Client-Secret": CLIENT_SECRET,
      Accept: "application/json",
      "User-Agent": "what-is-score/1.0",
    },
  });

  if (!result.ok) {
    const body = await result.text();
    throw new Error(`Naver API error ${result.status}: ${body.slice(0, 300)}`);
  }

  const data = await result.json();
  return Array.isArray(data.items) ? data.items : [];
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

function serveStatic(pathname, response) {
  const normalizedPath = pathname === "/" ? "/index.html" : pathname;
  const safePath = path.normalize(normalizedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendText(response, 404, "Not found");
        return;
      }
      sendText(response, 500, "Server error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(data);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": MIME_TYPES[".json"],
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(text);
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
  const scored = items
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

  return scored;
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
