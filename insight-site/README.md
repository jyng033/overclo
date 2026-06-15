# Overclo Insight

오버클로 인사이트 전용 Hugo 정적 사이트입니다. 기존 홈페이지 루트 구조와 분리해서 운영합니다.

## 로컬 실행

이 PC에 Hugo가 설치되어 있으면 아래 명령으로 확인합니다.

```powershell
cd insight-site
hugo server -D
```

빌드:

```powershell
cd insight-site
hugo --minify
```

## 배포

Cloudflare Pages 권장 설정:

```text
Root directory: insight-site
Build command: hugo --minify
Build output directory: public
Custom domain: 사용하지 않음
```

## 관리자

관리자 주소:

```text
https://www.overclo.com/insight/admin
```

Decap CMS는 GitHub 저장소에 게시글과 이미지를 저장합니다. 실제 운영 전 GitHub 인증 설정을 완료해야 합니다.

## Decap CMS GitHub 인증

Cloudflare Pages에서 Decap CMS의 `github` backend를 사용하려면 GitHub OAuth 중계 설정이 필요합니다.

준비할 값:

```text
GitHub OAuth App Client ID
GitHub OAuth App Client Secret
OAuth proxy URL
```

GitHub OAuth App 권장 설정:

```text
Application name: Overclo Insight CMS
Homepage URL: https://www.overclo.com/insight/admin
Authorization callback URL: https://overclo-insight.pages.dev/callback
```

OAuth proxy가 준비되면 `static/admin/config.yml`의 backend에 아래 값을 추가합니다.

```yaml
backend:
  name: github
  repo: jyng033/overclo
  branch: main
  base_url: https://overclo-insight.pages.dev
  auth_endpoint: auth
```

CMS 사용자는 `jyng033/overclo` 저장소에 push 권한이 있어야 글 발행이 가능합니다.
