const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");

let rankingCorePromise;
const HOST = "0.0.0.0";
const PORT = Number.parseInt(process.env.PORT || "8000", 10);
const ROOT = __dirname;

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
    if (requestUrl.pathname === "/api/env-check") {
      sendJson(response, 200, {
        ok: true,
        hasClientId: Boolean(process.env.NAVER_CLIENT_ID),
        hasClientSecret: Boolean(process.env.NAVER_CLIENT_SECRET),
      });
      return;
    }

    if (requestUrl.pathname === "/api/ranking") {
      await handleRankingApi(requestUrl, response);
      return;
    }

    serveStatic(requestUrl.pathname, response);
  } catch (error) {
    sendJson(response, 500, {
      ok: false,
      error: "server_error",
      message: "네이버 쇼핑 API 조회 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`마스터홍 server running on http://${HOST}:${PORT}`);
});

async function handleRankingApi(requestUrl, response) {
  const store = requestUrl.searchParams.get("store")?.trim() || "";
  const keyword = requestUrl.searchParams.get("keyword")?.trim() || "";
  const mode = requestUrl.searchParams.get("mode")?.trim() || "api";
  const requestedLimit = Number.parseInt(requestUrl.searchParams.get("limit") || "100", 10);
  const limit = Number.isNaN(requestedLimit) ? 100 : requestedLimit;
  const rankingCore = await loadRankingCore();
  const { status, payload } = await rankingCore.getRankingPayload({
    store,
    keyword,
    mode,
    limit,
    processEnv: process.env,
  });
  sendJson(response, status, payload);
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
        serve404(response);
        return;
      }
      sendText(response, 500, "Server error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    });
    response.end(data);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": MIME_TYPES[".json"],
    "Cache-Control": "no-store",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  });
  response.end(text);
}

function serve404(response) {
  fs.readFile(path.join(ROOT, "404.html"), (error, data) => {
    if (error) {
      sendText(response, 404, "Not found");
      return;
    }
    response.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    });
    response.end(data);
  });
}

async function loadRankingCore() {
  if (!rankingCorePromise) {
    rankingCorePromise = import(path.join(ROOT, "ranking-core.mjs"));
  }
  return rankingCorePromise;
}
