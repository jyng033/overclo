# Overclo Magazine Work Guide

작성일: 2026-06-10
최종 변경: 2026-06-10

이 문서는 오버클로 매거진을 기존 홈페이지에 영향을 주지 않는 방식으로 제작하고 운영하기 위한 작업 기준이다.

## 1. 최우선 작업 원칙

- 현재 요청 범위에만 초점을 맞춘다. 이전에 완료된 작업, 기존 운영 방식, 다른 기기에서의 작업 흐름에 타격이 생기는 변경은 기본적으로 금지한다.
- 수정은 항상 이전 작업에 영향이 없는 방식을 우선한다. 예를 들어 기존 루트 정적 사이트 구조, GitHub 공유 구조, 배포 구조, 사용자가 이미 쓰는 로컬 확인 방식은 보존 대상이다.
- 다른 방법이 도저히 없어서 기존 구조나 이전 작업에 영향을 줄 수밖에 없다면, 작업 전에 반드시 사용자에게 다음 내용을 상세히 보고하고 확인을 받은 뒤 진행한다: 변경 이유, 영향 범위, 되돌리는 방법, 대안, 예상 리스크.
- 임시 해결을 위해 기존 파일을 이동/삭제/추적 제외하거나, 배포 구조만 보고 로컬 작업 구조를 깨뜨리는 변경을 하지 않는다.
- 기존 `index.html`, `portfolio.html`, `renewal/`, `image_overclo/`는 보존한다.
- 기존 로컬 확인 방식인 `http://127.0.0.1:5500/index.html`이 깨지지 않아야 한다.
- 매거진 작업은 기본적으로 `magazine-site/` 안에서 진행하고, 기존 홈페이지와 연결이 필요한 경우 `vercel.json` rewrite만 최소 수정한다.
- 기존 홈페이지 전체를 Next.js 같은 JS 앱으로 전환하지 않는다.
- 배포 설정 변경이 기존 홈페이지에 영향을 줄 수 있으면 먼저 보고하고 승인받는다.

## 2. 현재 결정된 방향

```text
기존 홈페이지: 현재 정적 HTML 구조 유지
매거진 사이트: Hugo 기반 정적 사이트
관리자 페이지: Decap CMS
배포: Cloudflare Pages 무료 플랜
콘텐츠 저장: GitHub
매거진 주소: www.overclo.com/magazine
게시글 주소: www.overclo.com/magazine/[slug]
관리자 주소: www.overclo.com/magazine/admin
Cloudflare 원본: overclo-magazine.pages.dev
댓글: 1차 제외, 추후 검토
카테고리: 1차 제외, 추후 검토
```

이 방식은 운영 비용을 최소화하고, 오버클로가 글과 이미지 데이터를 직접 보유하면서, 개발 지식이 없는 직원도 관리자 화면에서 글을 발행할 수 있게 만드는 것을 목표로 한다.

## 3. 작업 전 확인 순서

작업을 시작하기 전 항상 다음을 확인한다.

```text
1. git status 확인
2. 사용자 또는 이전 작업의 미완료 변경 확인
3. 이번 작업이 기존 홈페이지 파일을 건드리는지 확인
4. 기존 로컬 구조에 영향이 있는지 확인
5. 매거진 전용 폴더 안에서 해결 가능한지 확인
```

기존 홈페이지 파일을 수정해야 할 때는 수정 이유가 명확해야 한다. 단순히 매거진을 만들기 위한 이유라면 기존 홈페이지 파일 대신 매거진 폴더 안에서 해결한다.

## 4. 권장 프로젝트 구조

```text
overclo/
  index.html
  portfolio.html
  renewal/
  image_overclo/
  docs/
  magazine-site/
    config.toml
    content/
      posts/
    layouts/
      _default/
      partials/
    static/
      admin/
        index.html
        config.yml
      uploads/
    assets/
```

주의:

- `magazine-site/`는 매거진 전용 격리 영역이다.
- 루트의 기존 정적 파일과 이미지 폴더를 이동하지 않는다.
- Cloudflare Pages는 `magazine-site/`를 루트 디렉터리로 빌드한다.
- Vercel은 `/magazine` 경로를 Cloudflare Pages 원본으로 rewrite한다.
- 기존 홈페이지 정적 파일과 로컬 구조는 유지한다.

## 5. 단계별 작업 가이드

### Phase 1. 문서 정리

목표:

- 계획서와 작업 가이드를 변경된 방향에 맞게 정리한다.
- 기존 Next/Supabase 전환 계획은 보류 상태로 명시한다.

완료 기준:

```text
docs/MAGAZINE_PLATFORM_PLAN.md
docs/MAGAZINE_WORK_GUIDE.md
```

두 문서가 Hugo, Cloudflare Pages, Decap CMS 기반 계획을 설명한다.

### Phase 2. 매거진 기본 프로젝트 생성

목표:

- 기존 홈페이지를 건드리지 않고 `magazine-site/`에 매거진 사이트를 만든다.

작업:

```text
1. magazine-site/ 폴더 생성
2. Hugo 설정 파일 생성
3. 기본 레이아웃 생성
4. 매거진 목록 페이지 생성
5. 게시글 상세 페이지 생성
6. 샘플 게시글 생성
7. 기본 스타일 생성
```

완료 기준:

```text
magazine-site/에서 Hugo 빌드가 성공한다.
생성된 매거진 목록과 상세 페이지가 정상 표시된다.
기존 index.html 로컬 구조는 변하지 않는다.
```

### Phase 3. SEO 자동화

목표:

- 글 내용에 맞는 SEO 메타를 자동으로 출력한다.

작업:

```text
1. 기본 title 템플릿
2. description 템플릿
3. canonical 템플릿
4. OG/Twitter 메타 템플릿
5. Article JSON-LD
6. BreadcrumbList JSON-LD
7. sitemap.xml
8. rss.xml
9. robots.txt
```

자동화 기준:

```text
seo_title이 있으면 seo_title 사용
seo_title이 없으면 title 사용
seo_description이 있으면 seo_description 사용
seo_description이 없으면 description 사용
description이 없으면 본문 요약 사용
featured_image가 있으면 og:image로 사용
featured_image가 없으면 사이트 기본 이미지 사용
```

주의:

- 검색량 높은 키워드를 자동으로 억지 삽입하지 않는다.
- 글 내용과 맞는 제목과 설명을 우선한다.
- 발행 후 Search Console 데이터를 보고 개선한다.

### Phase 4. 관리자 CMS 설정

목표:

- 개발 지식이 없는 직원이 관리자 화면에서 글을 작성하고 발행할 수 있게 한다.

작업:

```text
1. static/admin/index.html 생성
2. static/admin/config.yml 생성
3. posts collection 설정
4. 이미지 업로드 경로 설정
5. 제목/요약/본문/대표이미지/SEO 필드 구성
6. draft/published 상태 관리
7. 관리자 로그인 방식 설정
```

관리자 작성 필드:

```text
제목
URL 주소
요약
대표 이미지
대표 이미지 설명
본문
SEO 제목
SEO 설명
공개 여부
발행일
작성자
```

직원 기준 완료 조건:

```text
Markdown을 몰라도 글 작성 가능
이미지를 직접 업로드 가능
발행 여부를 화면에서 선택 가능
SEO 제목/설명을 화면에서 수정 가능
```

### Phase 5. 로컬 검수

목표:

- 기존 홈페이지와 매거진이 각각 정상 동작하는지 확인한다.

확인 항목:

```text
기존 index.html 로컬 확인
기존 portfolio.html 로컬 확인
magazine-site Hugo 빌드
매거진 목록 페이지
게시글 상세 페이지
대표 이미지
모바일 화면
SEO 메타
sitemap
rss
```

기존 홈페이지가 깨지면 매거진 작업을 완료한 것으로 보지 않는다.

### Phase 6. Cloudflare Pages 배포 및 Vercel rewrite

목표:

- 매거진 원본은 Cloudflare Pages에 무료 배포하고, 방문자에게는 `www.overclo.com/magazine`으로 노출한다.

Cloudflare Pages 설정:

```text
Project name: overclo-magazine
Production branch: main
Root directory: magazine-site
Build command: hugo --minify
Build output directory: public
Custom domain: 사용하지 않음
```

주의:

- Cloudflare custom domain은 초기에는 연결하지 않는다.
- Cloudflare Pages 원본 주소는 `overclo-magazine.pages.dev`로 둔다.
- Vercel `vercel.json`에 `/magazine` rewrite만 추가한다.
- 기존 `www.overclo.com` 홈페이지 정적 파일은 이동하지 않는다.

Vercel rewrite:

```text
/magazine -> https://overclo-magazine.pages.dev/
/magazine/:path* -> https://overclo-magazine.pages.dev/:path*
```

### Phase 7. 운영 등록

작업:

```text
1. Google Search Console에서 www.overclo.com 속성 기준으로 /magazine sitemap 제출
2. sitemap.xml 제출
3. Naver Search Advisor 등록 검토
4. 관리자 계정 2FA 확인
5. 직원 발행 테스트
6. 발행 후 자동 배포 테스트
```

## 6. 글 발행 운영 방식

직원 발행 흐름:

```text
1. www.overclo.com/magazine/admin 접속
2. 로그인
3. 새 글 작성 클릭
4. 제목, 요약, 대표 이미지, 본문 입력
5. SEO 제목/설명 확인
6. 임시저장 또는 발행 선택
7. 저장
8. GitHub에 자동 반영
9. Cloudflare Pages 자동 배포
10. Vercel rewrite를 통해 www.overclo.com/magazine에 노출
```

운영자가 직접 수정 가능한 항목:

```text
제목
본문
요약
대표 이미지
이미지 설명
SEO 제목
SEO 설명
발행 상태
발행일
```

개발자가 관리해야 하는 항목:

```text
템플릿
디자인
SEO 출력 구조
CMS 필드 설정
빌드 설정
배포 설정
보안 설정
```

## 7. SEO 운영 기준

초기 자동화:

- 글 제목과 요약을 기반으로 SEO 제목과 설명을 출력한다.
- 대표 이미지를 OG 이미지로 사용한다.
- 게시글마다 canonical을 자동 출력한다.
- sitemap과 RSS를 자동 생성한다.
- Article 구조화 데이터를 자동 출력한다.

운영 개선:

```text
노출 많고 클릭률 낮음: 제목/설명 개선
평균 순위 5~15위: 본문 보강, 내부 링크 추가
예상 외 검색어 유입: 소제목과 본문 보완
성과 좋은 글: 후속 글 작성
```

주의:

- SEO 자동화가 검색량 데이터를 실시간으로 분석해서 완벽한 키워드를 선택하는 것은 아니다.
- 무료 운영에서는 Search Console 데이터를 쌓은 뒤 사람이 개선하는 방식이 가장 현실적이다.
- 본문과 맞지 않는 키워드를 넣으면 장기 SEO에 불리할 수 있다.

## 8. 댓글 기능 기준

댓글은 1차 제작 범위에서 제외한다.

추후 필요 시 다음 중 하나를 선택한다.

```text
Giscus:
  무료
  GitHub Discussions 기반
  관리 쉬움
  방문자 로그인 경험은 제한적일 수 있음

자체 승인형 댓글:
  Supabase Free 또는 Cloudflare D1/Workers 사용
  방문자 경험 좋음
  구현과 보안 관리 부담 증가
```

댓글을 추가할 때의 기본 원칙:

- 승인 전 공개하지 않는다.
- HTML 입력을 허용하지 않는다.
- 스팸 방지 장치를 둔다.
- 개인정보를 최소 수집한다.

## 9. 보안 기준

관리자:

- GitHub 계정에는 2FA를 적용한다.
- 저장소 쓰기 권한은 필요한 직원에게만 준다.
- 퇴사자나 담당 변경 시 GitHub 권한을 즉시 회수한다.
- Decap CMS 설정에 비밀키를 저장하지 않는다.

배포:

- Cloudflare Pages 권한은 최소 인원에게만 준다.
- 환경변수가 필요한 경우 공개 저장소에 커밋하지 않는다.
- 관리자 페이지는 검색엔진 노출 대상이 아니다.

콘텐츠:

- 업로드 이미지 파일 크기를 제한한다.
- 이미지 alt 텍스트를 작성한다.
- 외부 스크립트 삽입은 제한한다.

## 10. QA 체크리스트

기존 홈페이지:

```text
index.html 로컬 확인 정상
portfolio.html 로컬 확인 정상
renewal 이미지 경로 정상
image_overclo 이미지 경로 정상
공유 대표 이미지 설정 유지
GitHub에서 다른 기기로 받아도 구조 정상
```

매거진:

```text
목록 페이지 정상
상세 페이지 정상
대표 이미지 정상
본문 이미지 정상
모바일 정상
SEO title 정상
SEO description 정상
OG image 정상
sitemap 정상
RSS 정상
```

관리자:

```text
/admin 접속 정상
로그인 정상
글 작성 가능
이미지 업로드 가능
임시저장 가능
발행 가능
발행 후 자동 배포 정상
직원이 테스트 글을 문제없이 작성 가능
```

## 11. Git 작업 기준

- 작업 전 `git status`를 확인한다.
- 사용자 변경이 있는 파일은 덮어쓰지 않는다.
- 매거진 작업은 가능한 `magazine-site/`와 `docs/`에 한정한다.
- 기존 홈페이지 파일 수정이 필요한 경우 변경 이유를 설명한다.
- 커밋 메시지는 작업 내용을 명확히 적는다.
- 푸시 전 빌드 또는 최소 검수를 진행한다.

## 12. 보류된 작업

다음은 현재 방향에서는 보류한다.

```text
Next.js 전면 전환
Supabase DB 기반 CMS
admin.overclo.com 별도 앱
자체 댓글 DB
다중 role 기반 세밀한 권한 시스템
예약 발행 워크플로
대규모 검색/필터 시스템
```

보류 사유:

- 현재 목적 대비 비용과 복잡도가 크다.
- 기존 홈페이지 구조에 영향을 줄 수 있다.
- 무료 운영과 쉬운 유지보수라는 우선순위에 맞지 않는다.

## 13. 재검토 기준

다음 조건이 생기면 정적 매거진에서 운영형 CMS로 확장할지 재검토한다.

```text
월간 게시글 수가 크게 증가
관리자 권한 구분이 꼭 필요
예약 발행과 승인 워크플로 필요
자체 댓글이 핵심 기능화
검색/카테고리/태그 관리가 복잡해짐
콘텐츠 운영 예산 확보
```

## 14. 참고 기준

- Hugo: https://gohugo.io/
- Cloudflare Pages: https://pages.cloudflare.com/
- Decap CMS: https://decapcms.org/
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Console: https://search.google.com/search-console
