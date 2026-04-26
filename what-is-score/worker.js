import { getRankingPayload } from "./ranking-core.mjs";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.what-is-score.benywade31.workers.dev") {
      url.hostname = "what-is-score.benywade31.workers.dev";
      return withSecurityHeaders(Response.redirect(url.toString(), 301));
    }

    if (url.pathname === "/api/env-check") {
      return json({
        ok: true,
        hasClientId: Boolean(env?.NAVER_CLIENT_ID),
        hasClientSecret: Boolean(env?.NAVER_CLIENT_SECRET),
        envKeys: Object.keys(env || {}).sort(),
      });
    }

    if (url.pathname === "/api/ranking") {
      return handleRankingApi(url, env);
    }

    if (url.pathname === "/ads.txt") {
      return withSecurityHeaders(
        new Response("", {
          status: 200,
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        })
      );
    }

    if (!isKnownStaticPath(url.pathname)) {
      return html404(request, env);
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status === 404) {
      return html404(request, env);
    }

    return withSecurityHeaders(response);
  },
};

async function handleRankingApi(url, env) {
  const store = url.searchParams.get("store")?.trim() || "";
  const keyword = url.searchParams.get("keyword")?.trim() || "";
  const mode = url.searchParams.get("mode")?.trim() || "api";
  const requestedLimit = Number.parseInt(url.searchParams.get("limit") || "100", 10);
  const limit = Number.isNaN(requestedLimit) ? 100 : requestedLimit;
  try {
    const { status, payload } = await getRankingPayload({
      store,
      keyword,
      mode,
      limit,
      runtimeEnv: env,
    });
    return json(payload, status);
  } catch (error) {
    return json(
      {
        ok: false,
        error: "server_error",
        message: error instanceof Error ? error.message : "Unknown server error",
      },
      500
    );
  }
}

function json(payload, status = 200) {
  return withSecurityHeaders(
    new Response(JSON.stringify(payload), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  );
}

async function html404(request, env) {
  const url = new URL(request.url);
  url.pathname = "/404.html";
  url.search = "";
  const response = await env.ASSETS.fetch(new Request(url.toString(), request));
  const headers = new Headers(response.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "no-store");
  return withSecurityHeaders(
    new Response(response.body, {
      status: 404,
      headers,
    })
  );
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isKnownStaticPath(pathname) {
  if (
    pathname === "/" ||
    pathname === "/index.html" ||
    pathname === "/privacy.html" ||
    pathname === "/terms.html" ||
    pathname === "/contact.html" ||
    pathname === "/methodology.html" ||
    pathname === "/404.html" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/favicon.svg"
  ) {
    return true;
  }

  return (
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/extension/icons/") ||
    pathname === "/styles.css" ||
    pathname === "/script.js" ||
    pathname === "/ranking-core.mjs" ||
    pathname === "/manifest.webmanifest"
  );
}
