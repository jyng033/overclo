# Overclo 작업 가이드

이 문서는 새 채팅이나 다른 기기에서 작업할 때 프로젝트 구조를 다시 설명하지 않기 위한 기준 문서입니다. Codex로 작업을 시작하면 먼저 이 파일을 읽고 진행하세요.

## Codex 필수 지침

이 저장소에서 작업 요청을 받으면 먼저 이 파일을 읽고 따른다. 사용자가 별도로 다른 기준을 말하지 않는 한 아래 원칙을 기본값으로 삼는다.

```text
1. 실제 운영본은 루트 index.html / portfolio.html이다.
2. renewal 폴더는 CSS, JS, 이미지 에셋으로 운영에 사용 중이므로 삭제하지 않는다.
3. renewal/index.html, renewal/portfolio.html은 중복 보존본이다. 단독 수정만으로는 라이브 메인에 반영되지 않는다.
4. 라이브 메인 수정은 index.html 우선, 라이브 포트폴리오 수정은 portfolio.html 우선으로 한다.
5. CSS는 renewal/global.css, renewal/styles.css, renewal/portfolio.css를 우선 확인한다.
6. .html 확장자 숨김은 vercel.json의 cleanUrls와 redirects로 유지한다.
7. 로컬에서 /portfolio가 깨지면 portfolio.html로 테스트한다. 이것은 Vercel cleanUrls와 로컬 정적 서버 차이 때문이다.
8. 사용자가 "푸시해줘"라고 요청하면 변경사항을 확인한 뒤 main 브랜치에 커밋하고 origin/main으로 push한다.
9. 커밋 전 git status --short --branch, git diff --stat으로 변경 범위를 확인한다.
10. 관련 없는 변경사항이 있으면 섞어 커밋하지 않는다.
```

## 현재 운영 구조

Vercel 프로젝트의 Root Directory는 저장소 최상위 `./`입니다.

운영 URL과 실제 파일 매핑은 아래 기준으로 봅니다.

```text
https://www.overclo.com/          -> index.html
https://www.overclo.com/portfolio -> portfolio.html
```

`renewal` 폴더는 삭제 대상이 아니라 운영 에셋 폴더로 사용 중입니다.

```text
renewal/global.css      공통 CSS
renewal/styles.css      메인 페이지 CSS
renewal/portfolio.css   포트폴리오 CSS
renewal/cursor.js       커서 스크립트
renewal/re_img/         메인/공통 이미지
```

루트 HTML은 CSS와 이미지를 아래처럼 참조합니다.

```html
<link rel="stylesheet" href="/renewal/global.css" />
<link rel="stylesheet" href="/renewal/styles.css" />
```

따라서 `renewal` 폴더 전체를 지우면 라이브 페이지가 깨집니다.

## 어떤 파일을 수정해야 하나

메인 페이지 운영본:

```text
index.html
renewal/styles.css
renewal/global.css
renewal/re_img/
```

포트폴리오 페이지 운영본:

```text
portfolio.html
renewal/portfolio.css
renewal/global.css
image_overclo/portfolio/
```

중복 HTML 보존본:

```text
renewal/index.html
renewal/portfolio.html
```

위 두 파일은 현재 직접 운영 URL에서는 쓰지 않습니다. 다만 과거 작업 경로와 호환을 위해 남겨둔 파일입니다. 삭제하지 말고, 큰 HTML 구조 변경을 할 때는 루트 운영본과 함께 맞춰둘지 판단하세요.

기본 원칙:

```text
라이브 메인 수정      -> index.html 우선
라이브 포트폴리오 수정 -> portfolio.html 우선
CSS 수정              -> renewal/*.css
이미지 추가           -> URL 기준에 맞는 실제 배포 폴더에 추가
```

## 리다이렉트와 clean URL

`.html` 확장자가 보이지 않도록 `vercel.json`에서 `cleanUrls`를 유지합니다.

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

주요 리다이렉트:

```text
/index.html             -> /
/portfolio.html         -> /portfolio
/renewal                -> /
/renewal/index.html     -> /
/renewal/portfolio      -> /portfolio
/renewal/portfolio.html -> /portfolio
/work                   -> /portfolio
/work.html              -> /portfolio
/about                  -> /#why
/contact                -> /#contact
```

이 설정 때문에 라이브에서는 `/portfolio`가 정상 작동하지만, 일반 로컬 정적 서버에서는 `/portfolio`가 `Cannot GET /portfolio`가 될 수 있습니다.

로컬 테스트용 링크는 가능하면 `.html`을 포함해서 확인합니다.

```text
http://localhost:PORT/index.html
http://localhost:PORT/portfolio.html?tab=detail
```

라이브에서는 Vercel이 자동으로 확장자 없는 URL로 정리합니다.

```text
/portfolio.html?tab=detail -> /portfolio?tab=detail
```

## 서비스 카드와 포트폴리오 탭 연결

메인 서비스 카드 3개는 포트폴리오의 각 탭으로 이동합니다.

```text
홈페이지 카드   -> /portfolio.html?tab=web       -> 라이브: /portfolio?tab=web
상세페이지 카드 -> /portfolio.html?tab=detail    -> 라이브: /portfolio?tab=detail
카달로그 카드   -> /portfolio.html?tab=packaging -> 라이브: /portfolio?tab=packaging
```

포트폴리오 탭 ID:

```text
web        홈페이지
detail     상세페이지
blog       홈페이지형 블로그
packaging  브랜딩 패키지
video      광고영상
```

포트폴리오 페이지 스크립트는 `?tab=` 값을 읽어 해당 탭을 자동 활성화합니다. 탭을 추가하거나 이름을 바꿀 때는 아래 항목을 함께 맞춥니다.

```text
.work-tabs a[data-tab="..."]
.tab-panel[data-panel="..."]
서비스 카드 href의 ?tab=...
포트폴리오 스크립트의 activateWorkTab 동작
```

## 이미지 경로 기준

루트 운영 HTML에서 `renewal/re_img` 이미지를 쓸 때는 절대 경로를 사용합니다.

```html
<img src="/renewal/re_img/홈페이지.jpg" alt="홈페이지 제작" />
```

`renewal/index.html` 안에서 같은 이미지를 쓸 때는 상대 경로가 남아 있을 수 있습니다.

```html
<img src="./re_img/홈페이지.jpg" alt="홈페이지 제작" />
```

현재 실제 운영 URL은 루트 HTML 기준이므로, 라이브 이슈를 볼 때는 먼저 루트 `index.html`, `portfolio.html`을 확인합니다.

포트폴리오 이미지들은 주로 아래 경로를 씁니다.

```text
image_overclo/portfolio/
image_overclo/portfolio/detail_page/
image_overclo/portfolio/blog/
image_overclo/portfolio/packaging/
```

새 이미지가 라이브에서 안 뜨면 아래 순서로 확인합니다.

```powershell
Test-Path renewal\re_img\파일명.jpg
Test-Path image_overclo\portfolio\파일명.jpg
git status --short
curl.exe -I "https://www.overclo.com/실제/이미지/경로.jpg"
```

## 로컬 작업 체크리스트

작업 전:

```powershell
git status --short --branch
git pull origin main
```

로컬에서 단순 확인:

```powershell
python -m http.server 8787
```

접속 예시:

```text
http://127.0.0.1:8787/index.html
http://127.0.0.1:8787/portfolio.html?tab=packaging
```

주의:

```text
http://127.0.0.1:8787/portfolio
```

일반 정적 서버에서는 위 경로가 깨질 수 있습니다. 이것은 Vercel의 `cleanUrls` 기능이 로컬 서버에 없기 때문입니다.

## 커밋과 푸시 절차

변경 확인:

```powershell
git status --short --branch
git diff --stat
git diff -- index.html portfolio.html renewal\styles.css renewal\portfolio.css vercel.json
```

스테이지:

```powershell
git add index.html portfolio.html renewal/index.html renewal/portfolio.html renewal/styles.css renewal/portfolio.css renewal/global.css renewal/re_img vercel.json
```

필요한 파일만 골라서 올리세요. 관련 없는 변경이 있으면 함께 커밋하지 않습니다.

커밋:

```powershell
git commit -m "작업 내용 요약"
```

푸시:

```powershell
git push origin main
```

푸시 후 확인:

```powershell
git status --short --branch
git log -1 --oneline
```

Vercel이 GitHub `main` 브랜치 push를 감지해 자동 배포합니다. 배포 완료 후 라이브에서 확인합니다.

```powershell
curl.exe -L https://www.overclo.com/ | Select-String -Pattern "확인할텍스트"
curl.exe -L https://www.overclo.com/portfolio | Select-String -Pattern "확인할텍스트"
curl.exe -I https://www.overclo.com/index.html
curl.exe -I https://www.overclo.com/portfolio.html
```

정상 리다이렉트 예시:

```text
/index.html     -> /
/portfolio.html -> /portfolio
```

## 헷갈리기 쉬운 점

1. 루트 `index.html`과 `renewal/index.html`이 둘 다 있습니다.
   - 실제 메인은 루트 `index.html`입니다.
   - `renewal/index.html`만 수정하면 `https://www.overclo.com/`에는 반영되지 않습니다.

2. 루트 `portfolio.html`과 `renewal/portfolio.html`이 둘 다 있습니다.
   - 실제 포트폴리오는 루트 `portfolio.html`입니다.
   - `renewal/portfolio.html`만 수정하면 `/portfolio`에는 반영되지 않습니다.

3. CSS는 루트가 아니라 `renewal` 폴더 안 파일을 씁니다.
   - 메인 CSS: `renewal/styles.css`
   - 포트폴리오 CSS: `renewal/portfolio.css`
   - 공통 CSS: `renewal/global.css`

4. 로컬 `/portfolio` 에러는 배포 에러가 아닐 수 있습니다.
   - 로컬에서는 `portfolio.html?tab=...`로 테스트합니다.
   - 라이브에서는 Vercel이 `/portfolio?tab=...`로 정리합니다.

5. `renewal` 폴더는 삭제하지 않습니다.
   - HTML은 중복일 수 있지만 CSS, 이미지, JS는 운영에서 사용합니다.

## 새 채팅에서 Codex에게 먼저 요청할 문장

```text
먼저 OVERCLO_WORK_GUIDE.md 읽고 현재 운영 구조 기준으로 작업해줘.
루트 index.html/portfolio.html이 운영본이고 renewal 폴더는 CSS/이미지 에셋으로 유지하는 구조야.
```
