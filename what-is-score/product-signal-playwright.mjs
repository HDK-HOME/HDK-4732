import { extractNaverProductId } from "./product-signal-debug.mjs";

const TIMEOUT_MS = 30000;
const DESKTOP_VIEWPORT = { width: 1365, height: 900 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const CHROME_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const MOBILE_CHROME_UA =
  "Mozilla/5.0 (Linux; Android 14; SM-S921N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36";

const SIGNAL_KEYWORDS = ["구매", "판매", "주문", "리뷰", "상품평", "후기", "찜", "관심", "좋아요"];
const BLOCK_PATTERNS = [
  { reason: "HTTP_429", pattern: /HTTP 429/i },
  { reason: "CAPTCHA", pattern: /captcha|캡차|자동입력|보안문자/i },
  { reason: "ABNORMAL_TRAFFIC", pattern: /비정상\s*트래픽|비정상적인\s*요청|자동화된\s*요청|자동\s*요청/i },
  { reason: "ACCESS_DENIED", pattern: /접근이\s*제한|접근\s*제한|access\s*denied|forbidden/i },
  { reason: "LOGIN_REQUIRED", pattern: /로그인이\s*필요|로그인\s*후|login required/i },
];

async function main() {
  const { inputUrl, viewportName } = parseArgs(process.argv.slice(2));
  const productId = extractNaverProductId(inputUrl);

  if (!inputUrl) {
    printJson({
      ok: false,
      url: null,
      productId,
      status: null,
      title: null,
      bodyLength: 0,
      detectedSignals: [],
      snippets: [],
      blockedReason: "MISSING_URL",
      message: "상품 URL을 입력해주세요.",
    });
    return;
  }

  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    printJson({
      ok: false,
      url: inputUrl,
      productId,
      status: null,
      title: null,
      bodyLength: 0,
      detectedSignals: [],
      snippets: [],
      blockedReason: "PLAYWRIGHT_NOT_INSTALLED",
      message: "Playwright가 설치되어 있지 않습니다. 프로젝트 폴더에서 npm install 후 다시 실행하세요.",
    });
    return;
  }

  const result = await inspectProductPage(playwright.chromium, inputUrl, productId, viewportName);
  printJson(result);
}

async function inspectProductPage(chromium, inputUrl, productId, viewportName) {
  const viewport = viewportName === "mobile" ? MOBILE_VIEWPORT : DESKTOP_VIEWPORT;
  let browser;
  let context;

  try {
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext({
      viewport,
      locale: "ko-KR",
      timezoneId: "Asia/Seoul",
      userAgent: viewportName === "mobile" ? MOBILE_CHROME_UA : CHROME_UA,
      extraHTTPHeaders: {
        "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    const page = await context.newPage();
    page.setDefaultTimeout(TIMEOUT_MS);
    page.setDefaultNavigationTimeout(TIMEOUT_MS);

    const response = await page.goto(inputUrl, {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUT_MS,
    });

    await settlePage(page);

    const pageData = await page.evaluate(() => {
      const scripts = Array.from(document.scripts)
        .map((script) => script.textContent || "")
        .filter(Boolean)
        .slice(0, 80);

      return {
        title: document.title || "",
        bodyText: document.body?.innerText || "",
        scripts,
      };
    });

    const status = response ? response.status() : null;
    const bodyText = pageData.bodyText || "";
    const scriptText = pageData.scripts.join("\n");
    const blockedReason = detectBlockedReason(status, `${pageData.title}\n${bodyText}\n${scriptText}`);
    const detectedSignals = blockedReason ? [] : detectSignals(bodyText, scriptText);
    const snippets = buildSnippets(bodyText, scriptText);

    return {
      ok: !blockedReason,
      url: page.url() || inputUrl,
      productId,
      status,
      title: pageData.title || null,
      bodyLength: bodyText.length,
      detectedSignals,
      snippets,
      blockedReason,
      message: buildMessage(blockedReason, detectedSignals.length),
    };
  } catch (error) {
    return {
      ok: false,
      url: inputUrl,
      productId,
      status: null,
      title: null,
      bodyLength: 0,
      detectedSignals: [],
      snippets: [],
      blockedReason: error?.name === "TimeoutError" ? "TIMEOUT" : "PLAYWRIGHT_ERROR",
      message: error instanceof Error ? error.message : "Playwright 페이지 로딩 중 오류가 발생했습니다.",
    };
  } finally {
    if (context) {
      await context.close();
    }
    if (browser) {
      await browser.close();
    }
  }
}

async function settlePage(page) {
  try {
    await page.waitForLoadState("networkidle", { timeout: 10000 });
  } catch {
    await page.waitForTimeout(2000);
  }
}

function detectSignals(bodyText, scriptText) {
  const signals = [];
  const sources = [
    { name: "body", text: bodyText },
    { name: "script", text: scriptText },
  ];

  for (const source of sources) {
    for (const keyword of SIGNAL_KEYWORDS) {
      const pattern = new RegExp(`.{0,45}${escapeRegExp(keyword)}.{0,70}`, "gi");
      for (const match of source.text.matchAll(pattern)) {
        signals.push({
          type: keyword,
          source: source.name,
          value: cleanup(match[0]),
          snippet: cleanup(match[0]),
        });
        if (signals.length >= 80) {
          return dedupe(signals);
        }
      }
    }

    const numericPattern = /(?:구매|판매|주문|리뷰|상품평|후기|찜|관심|좋아요)[^0-9]{0,20}([0-9][0-9,.\s]*(?:만|천)?)/gi;
    for (const match of source.text.matchAll(numericPattern)) {
      signals.push({
        type: "number-near-signal",
        source: source.name,
        value: cleanup(match[1]),
        snippet: cleanup(match[0]),
      });
    }
  }

  return dedupe(signals).slice(0, 80);
}

function buildSnippets(bodyText, scriptText) {
  const snippets = [
    {
      type: "body-preview",
      source: "body",
      text: cleanup(bodyText.slice(0, 1200)),
    },
  ];

  for (const keyword of SIGNAL_KEYWORDS) {
    const index = bodyText.indexOf(keyword);
    if (index >= 0) {
      snippets.push({
        type: "keyword-context",
        source: "body",
        keyword,
        text: sliceAround(bodyText, index, 220),
      });
    }
  }

  const jsonCandidates = Array.from(
    scriptText.matchAll(/(?:product|review|purchase|sale|favorite|wish|channel|store|mall)[\s\S]{0,500}/gi)
  )
    .slice(0, 12)
    .map((match) => ({
      type: "script-json-candidate",
      source: "script",
      text: cleanup(match[0].slice(0, 500)),
    }));

  return snippets.concat(jsonCandidates).slice(0, 30);
}

function detectBlockedReason(status, text) {
  if (status === 429) {
    return "HTTP_429";
  }

  for (const item of BLOCK_PATTERNS) {
    if (item.pattern.test(text)) {
      return item.reason;
    }
  }

  return null;
}

function buildMessage(blockedReason, signalCount) {
  if (blockedReason) {
    return "브라우저 렌더링에서도 접근 제한 또는 자동화 차단 신호가 감지되었습니다.";
  }
  if (signalCount) {
    return "브라우저 렌더링 페이지에서 판매신호 후보를 감지했습니다.";
  }
  return "페이지는 열렸지만 구매수, 리뷰수, 찜수 후보를 찾지 못했습니다.";
}

function parseArgs(args) {
  const viewportArg = args.find((arg) => arg.startsWith("--viewport="));
  const viewportName = viewportArg?.split("=")[1] === "mobile" || args.includes("--mobile") ? "mobile" : "desktop";
  const inputUrl = args.find((arg) => !arg.startsWith("--")) || "";
  return { inputUrl, viewportName };
}

function sliceAround(text, index, radius) {
  return cleanup(text.slice(Math.max(0, index - radius), Math.min(text.length, index + radius)));
}

function cleanup(value) {
  return String(value || "").replaceAll(/\s+/g, " ").trim();
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.type}:${item.source}:${item.value || item.text || item.snippet}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function escapeRegExp(value) {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function printJson(payload) {
  console.log(JSON.stringify(payload, null, 2));
}

await main();
