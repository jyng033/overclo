const fs = require("fs");
const path = require("path");

const NOTION_VERSION = "2022-06-28";
const DEFAULT_PAGE_TITLE = "홈페이지 제작광고 가이드";
const DEFAULT_MD_PATH = path.join(
  __dirname,
  "홈페이지제작_광고_전용_가이드_2025_2026.md"
);

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const idx = line.indexOf("=");
    if (idx <= 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function notion(token, method, apiPath, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  const res = await fetch(`https://api.notion.com${apiPath}`, {
    method,
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  }).finally(() => clearTimeout(timer));
  const text = await res.text();
  let json = {};
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
  }
  if (!res.ok) {
    throw new Error(
      `Notion API error ${res.status} ${apiPath}\n${JSON.stringify(json)}`
    );
  }
  return json;
}

function getPageTitle(page) {
  const props = page.properties || {};
  for (const k of Object.keys(props)) {
    const v = props[k];
    if (v && v.type === "title") {
      return (v.title || []).map((x) => x.plain_text || "").join("").trim();
    }
  }
  return "";
}

function richText(text) {
  const safe = (text && text.length ? text : " ").toString();
  const arr = [];
  for (let i = 0; i < safe.length; i += 1900) {
    arr.push({
      type: "text",
      text: { content: safe.slice(i, i + 1900) },
    });
  }
  return arr.length ? arr : [{ type: "text", text: { content: " " } }];
}

function parseMarkdown(md) {
  const blocks = [];
  const lines = md.split(/\r?\n/);
  let inCode = false;
  let code = [];
  let inSopSection = false;
  let calloutBuffer = null;

  function flushCallout() {
    if (!calloutBuffer || !calloutBuffer.length) return;
    blocks.push({
      object: "block",
      type: "callout",
      callout: {
        rich_text: richText(calloutBuffer.join("\n")),
        icon: { type: "emoji", emoji: "📌" },
        color: "default",
      },
    });
    calloutBuffer = null;
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    const t = line.trim();

    if (t.startsWith("```")) {
      if (!inCode) {
        inCode = true;
        code = [];
      } else {
        inCode = false;
        blocks.push({
          object: "block",
          type: "code",
          code: { language: "plain text", rich_text: richText(code.join("\n")) },
        });
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!t) continue;

    // 섹션 4(SOP) 인라인 콜아웃 보존 로직
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      flushCallout();
      inSopSection = h2[1].startsWith("4) 채널별 실행 SOP");
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: { rich_text: richText(h2[1]) },
      });
      continue;
    }

    if (inSopSection) {
      if (t === "---") {
        flushCallout();
        inSopSection = false;
        blocks.push({ object: "block", type: "divider", divider: {} });
        continue;
      }

      const h3 = line.match(/^###\s+(.+)$/);
      if (h3) {
        flushCallout();
        calloutBuffer = [`${h3[1]}`];
        continue;
      }

      if (!calloutBuffer) calloutBuffer = [];

      const bSop = line.match(/^\-\s+(.+)$/);
      if (bSop) {
        calloutBuffer.push(`• ${bSop[1]}`);
        continue;
      }

      const nSop = line.match(/^\d+\.\s+(.+)$/);
      if (nSop) {
        calloutBuffer.push(`- ${nSop[1]}`);
        continue;
      }

      calloutBuffer.push(line);
      continue;
    }

    if (t === "---") {
      flushCallout();
      blocks.push({ object: "block", type: "divider", divider: {} });
      continue;
    }

    const h = line.match(/^(#{1,3})\s+(.+)$/);
    if (h) {
      const key = { 1: "heading_1", 2: "heading_2", 3: "heading_3" }[h[1].length];
      const block = { object: "block", type: key };
      block[key] = { rich_text: richText(h[2]) };
      blocks.push(block);
      continue;
    }

    const q = line.match(/^>\s+(.+)$/);
    if (q) {
      blocks.push({
        object: "block",
        type: "quote",
        quote: { rich_text: richText(q[1]) },
      });
      continue;
    }

    const b = line.match(/^\-\s+(.+)$/);
    if (b) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: { rich_text: richText(b[1]) },
      });
      continue;
    }

    const n = line.match(/^\d+\.\s+(.+)$/);
    if (n) {
      blocks.push({
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: { rich_text: richText(n[1]) },
      });
      continue;
    }

    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: { rich_text: richText(line) },
    });
  }

  flushCallout();
  return blocks;
}

async function listChildren(token, blockId) {
  const all = [];
  let cursor = null;
  while (true) {
    const q = cursor
      ? `/v1/blocks/${blockId}/children?page_size=100&start_cursor=${encodeURIComponent(
          cursor
        )}`
      : `/v1/blocks/${blockId}/children?page_size=100`;
    const res = await notion(token, "GET", q);
    all.push(...(res.results || []));
    if (!res.has_more) break;
    cursor = res.next_cursor;
  }
  return all;
}

async function main() {
  loadDotEnv(path.join(__dirname, ".env"));

  const token = process.env.NOTION_TOKEN;
  const pageTitle = process.argv[2] || process.env.NOTION_PAGE_TITLE || DEFAULT_PAGE_TITLE;
  const mdPath = process.argv[3] || process.env.NOTION_MD_PATH || DEFAULT_MD_PATH;

  if (!token) {
    throw new Error(".env 또는 환경변수에 NOTION_TOKEN이 필요합니다.");
  }

  if (!fs.existsSync(mdPath)) {
    throw new Error(`마크다운 파일이 없습니다: ${mdPath}`);
  }

  const search = await notion(token, "POST", "/v1/search", {
    query: pageTitle,
    filter: { value: "page", property: "object" },
    page_size: 20,
  });

  if (!search.results || !search.results.length) {
    throw new Error(`페이지를 찾지 못했습니다: ${pageTitle}`);
  }

  const activePages = search.results.filter((p) => !p.in_trash && !p.archived);
  if (!activePages.length) {
    throw new Error(
      `검색된 '${pageTitle}' 페이지가 모두 보관/휴지통 상태입니다. Notion에서 페이지 상태를 확인해주세요.`
    );
  }

  const exact =
    activePages.find((p) => getPageTitle(p) === pageTitle) || activePages[0];
  const pageId = exact.id;

  const children = await listChildren(token, pageId);
  for (const c of children) {
    if (c.archived) continue;
    try {
      await notion(token, "PATCH", `/v1/blocks/${c.id}`, { archived: true });
    } catch (err) {
      // 일부 블록(동기화/보관 상태)은 archive 불가일 수 있어 무시하고 계속 진행
      if (!String(err.message || "").includes("Can't edit block that is archived")) {
        throw err;
      }
    }
  }

  const md = fs.readFileSync(mdPath, "utf8");
  const blocks = parseMarkdown(md);

  for (let i = 0; i < blocks.length; i += 90) {
    const chunk = blocks.slice(i, i + 90);
    await notion(token, "PATCH", `/v1/blocks/${pageId}/children`, {
      children: chunk,
    });
  }

  console.log(`업로드 완료: ${pageTitle} / 블록 ${blocks.length}개`);
}

main().catch((err) => {
  console.error(String(err && err.message ? err.message : err));
  process.exit(1);
});
