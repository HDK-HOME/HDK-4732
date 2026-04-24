import { getRankingPayload } from "./ranking-core.mjs";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

    return env.ASSETS.fetch(request);
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
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
