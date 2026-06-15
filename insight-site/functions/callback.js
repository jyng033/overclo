const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const ALLOWED_ORIGINS = [
  "https://overclo-insight.pages.dev",
  "https://www.overclo.com",
];

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function completePage(message, content) {
  const payload = `authorization:github:${message}:${content}`;

  return html(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>GitHub 로그인 처리 중</title>
  </head>
  <body>
    <p>GitHub 로그인 처리 중입니다. 창이 자동으로 닫히지 않으면 관리자 페이지로 돌아가 다시 시도해 주세요.</p>
    <script>
      (function () {
        var allowedOrigins = ${JSON.stringify(ALLOWED_ORIGINS)};
        var payload = ${JSON.stringify(payload)};

        function receiveMessage(event) {
          if (!allowedOrigins.includes(event.origin)) return;
          window.removeEventListener('message', receiveMessage, false);
          window.opener.postMessage(payload, event.origin);
        }

        window.addEventListener('message', receiveMessage, false);

        if (window.opener) {
          window.opener.postMessage('authorizing:github', '*');
        }
      })();
    </script>
  </body>
</html>`);
}

function errorPage(message) {
  return completePage("error", `An error occurred. ${escapeHtml(message)}`);
}

export async function onRequestGet({ request, env }) {
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!clientId || !clientSecret) {
    return html("Missing GitHub OAuth environment variables.", 500);
  }

  if (!code) {
    return errorPage("GitHub authorization code was not provided.");
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "overclo-insight-cms",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: new URL("/callback", url.origin).toString(),
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.access_token) {
    return errorPage(tokenData.error_description || tokenData.error || "GitHub token exchange failed.");
  }

  const content = JSON.stringify({
    token: tokenData.access_token,
    provider: "github",
  });

  return completePage("success", content.replace(/</g, "\\u003c"));
}
