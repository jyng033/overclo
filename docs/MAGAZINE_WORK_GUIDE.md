# Overclo Magazine Work Guide

작성일: 2026-06-10

이 문서는 오버클로 사이트를 운영형 매거진 플랫폼으로 전환할 때 따라야 할 작업 기준이다.

## 1. 작업 원칙

- 기존 공개 URL은 유지한다.
- 관리자 영역은 `admin.overclo.com`으로 분리한다.
- 보안 검증은 UI가 아니라 서버와 DB 정책에서 수행한다.
- 공개 페이지는 빠르고 검색엔진이 읽기 쉬워야 한다.
- SEO 자동화는 본문 내용 기반으로 제안하고, 관리자가 수정할 수 있어야 한다.
- 댓글은 승인 전 공개하지 않는다.
- 모든 민감키는 서버 환경변수에만 둔다.

## 2. 권장 작업 순서

### Phase 1. Next.js 기반 전환

목표:

- 기존 정적 HTML 사이트를 Next.js 앱으로 이전한다.
- 사용자에게 보이는 홈/포트폴리오 디자인과 URL은 유지한다.

작업:

```text
1. Next.js App Router 프로젝트 생성
2. 기존 index.html을 / app page로 이전
3. 기존 portfolio.html을 /portfolio page로 이전
4. CSS와 이미지 경로 정리
5. vercel.json redirect 정책 반영
6. 기존 SEO 메타 유지
7. 로컬/배포 화면 검수
```

완료 기준:

```text
/
/portfolio
/index.html -> /
/portfolio.html -> /portfolio
```

위 주소가 정상 동작한다.

### Phase 2. Supabase 기반 구성

목표:

- 운영형 게시글, 댓글, 관리자 권한을 저장할 DB와 Auth를 구성한다.

작업:

```text
1. Supabase 프로젝트 생성
2. 환경변수 추가
3. Auth 이메일 로그인 설정
4. 관리자 초대 정책 결정
5. DB migration 작성
6. RLS 활성화
7. owner 계정 생성
```

환경변수 예시:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL
```

주의:

- `NEXT_PUBLIC_`이 붙은 값만 브라우저에 노출된다.
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트 코드에서 import하지 않는다.

### Phase 3. 관리자 앱

목표:

- `admin.overclo.com`에서 관리자 로그인과 기본 대시보드를 제공한다.

작업:

```text
1. admin 앱 생성
2. 로그인 화면 구현
3. 세션 검증 middleware 구현
4. 관리자 role 검증 함수 구현
5. 대시보드 구현
6. 권한 없는 계정 차단
7. 로그아웃 구현
```

완료 기준:

- 비로그인 사용자는 `/login`으로 이동한다.
- 일반 Supabase 사용자는 관리자 화면에 접근할 수 없다.
- owner/admin만 관리자 기능에 접근할 수 있다.

### Phase 4. 게시글 관리

목표:

- 관리자가 매거진 글을 작성, 수정, 저장, 발행할 수 있다.

작업:

```text
1. 게시글 목록
2. 게시글 작성 폼
3. 에디터 구현
4. 대표 이미지 업로드
5. 임시저장
6. 발행
7. 예약발행
8. 비공개
9. 수정 이력 저장
10. 발행 전 미리보기
```

게시글 필수 필드:

```text
title
slug
excerpt
content
status
visibility
author
featured_image
seo_title
seo_description
primary_keyword
secondary_keywords
published_at
updated_at
```

### Phase 5. 매거진 공개 페이지

목표:

- 방문자가 `/magazine`에서 글 목록을 보고, `/magazine/[slug]`에서 글을 읽을 수 있다.

작업:

```text
1. MAGAZINE 내비게이션 추가
2. /magazine 목록 페이지
3. 최신 글 카드
4. 추천 글 영역
5. 페이지네이션
6. /magazine/[slug] 상세 페이지
7. 관련 글
8. 문의 CTA
9. 댓글 영역
```

초기에는 내부 카테고리를 만들지 않는다. 추후 필요 시 `tags` 또는 `category` 테이블을 추가한다.

### Phase 6. SEO 자동화

목표:

- 게시글마다 본문 내용에 맞는 SEO 메타를 자동 생성하고, 관리자가 수정할 수 있게 한다.

작업:

```text
1. SEO 자동 생성 함수 작성
2. SEO 수동 수정 UI 작성
3. SEO 점검 결과 표시
4. Article JSON-LD 생성
5. BreadcrumbList JSON-LD 생성
6. canonical 생성
7. OG/Twitter 메타 생성
8. sitemap 자동 생성
9. RSS 생성
```

자동 생성 규칙:

```text
seo_title = 제목 또는 관리자 입력 SEO 제목
seo_description = excerpt 또는 본문 첫 문단 기반 요약
slug = 관리자 입력값 우선, 없으면 제목 기반 영문/숫자 slug
og_title = seo_title
og_description = seo_description
og_image = 게시글 대표 이미지, 없으면 사이트 기본 대표 이미지
canonical = https://www.overclo.com/magazine/[slug]
```

관리자에게 보여줄 점검 항목:

```text
제목 있음
설명 있음
대표 이미지 있음
이미지 alt 있음
URL 중복 없음
본문 길이 충분
내부 링크 있음
공개 상태일 때 sitemap 포함
```

### Phase 7. 댓글

목표:

- 방문자는 댓글을 남기고, 관리자는 승인/숨김/삭제할 수 있다.

작업:

```text
1. 댓글 작성 폼
2. 서버 검증
3. pending 저장
4. 승인된 댓글만 공개
5. 관리자 댓글 목록
6. 승인/숨김/스팸/삭제 처리
7. rate limit
8. honeypot 필드
```

댓글 정책:

- HTML 입력 허용 금지
- 승인 전 공개 금지
- 이메일은 공개하지 않음
- IP는 원문 저장하지 않고 hash 저장
- 반복 스팸은 숨김 또는 차단 후보로 분류

### Phase 8. 보안 점검

작업:

```text
1. RLS 활성화 확인
2. anon 접근 정책 확인
3. authenticated 접근 정책 확인
4. service role key 노출 여부 확인
5. admin route 접근 차단 확인
6. 댓글 rate limit 확인
7. 파일 업로드 검증 확인
8. CSP/security headers 적용
9. robots noindex for admin 확인
10. audit log 기록 확인
```

필수 보안 헤더:

```text
Content-Security-Policy
X-Frame-Options
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

### Phase 9. 배포 및 운영

작업:

```text
1. Vercel 프로젝트 구성
2. www.overclo.com 연결
3. admin.overclo.com 연결
4. 환경변수 Production/Preview 분리
5. Supabase URL 설정
6. Auth redirect URL 설정
7. Search Console 제출
8. Naver Search Advisor 제출
9. sitemap 확인
10. 로그/에러 모니터링 설정
```

## 3. DB Migration 작성 기준

- 모든 테이블은 `created_at`, `updated_at`을 둔다.
- 공개 삭제 대신 `deleted_at` 기반 soft delete를 우선한다.
- 공개 페이지에서 자주 조회하는 컬럼은 인덱스를 둔다.
- RLS는 테이블 생성 직후 활성화한다.
- 정책명은 역할과 동작이 드러나게 작성한다.

정책명 예시:

```text
posts_select_published_for_anon
posts_manage_for_admins
comments_insert_pending_for_anon
comments_select_approved_for_anon
comments_moderate_for_admins
```

## 4. 관리자 권한 검증 기준

서버 함수에서 항상 다음 순서로 검증한다.

```text
1. Supabase 세션이 있는가
2. auth user id가 admin_users에 있는가
3. admin status가 active인가
4. 필요한 role을 가지고 있는가
5. 대상 리소스에 대한 작업 권한이 있는가
```

클라이언트에서 버튼을 숨기는 것은 편의 기능일 뿐이다. 실제 권한 검증은 서버와 DB에서 수행한다.

## 5. SEO 작성/운영 기준

SEO 자동화는 다음 원칙을 따른다.

- 본문 주제와 맞지 않는 키워드를 강제로 넣지 않는다.
- 제목은 사람이 클릭하고 싶은 문장으로 작성한다.
- description은 검색결과에서 읽히는 요약문으로 작성한다.
- 대표 키워드는 글의 주제를 설명하는 용도로 저장한다.
- 검색량 키워드는 Google Search Console과 Keyword Planner 데이터를 보고 운영 중 개선한다.

발행 후 개선 기준:

```text
노출 많고 CTR 낮음: title/description 개선
평균 순위 5~15위: 본문 보강 및 내부 링크 추가
예상 외 검색어 유입: 소제목/본문 보완
성과 좋은 글: 후속 글 작성
```

## 6. QA 체크리스트

공개 사이트:

```text
홈 정상
포트폴리오 정상
매거진 목록 정상
게시글 상세 정상
모바일 레이아웃 정상
OG 이미지 정상
댓글 승인 전 비노출
댓글 승인 후 노출
```

관리자:

```text
로그인 정상
권한 없는 계정 차단
게시글 임시저장
게시글 발행
게시글 수정
게시글 삭제/보관
이미지 업로드
SEO 수정
댓글 승인
댓글 숨김
댓글 삭제
```

보안:

```text
service role key 미노출
RLS 활성화
비공개 글 접근 차단
draft 글 접근 차단
admin noindex
업로드 파일 검증
rate limit 적용
```

## 7. 구현 전 결정해야 할 것

- 관리자 초대 방식: owner가 이메일 초대
- 댓글 작성자 이메일 필수 여부
- 댓글 비밀번호 기능 제공 여부
- 댓글 답글 제공 여부
- 게시글 에디터: Markdown 기반 또는 Rich Text 기반
- 이미지 저장소 공개/비공개 정책
- AI 기반 SEO 자동 제안 사용 여부
- 기존 HTML을 그대로 이전할지, 디자인을 정리하면서 이전할지

추천 초기 결정:

```text
관리자 초대: owner 이메일 초대
댓글 이메일: 선택
댓글 비밀번호: 제공
댓글 답글: 1단계에서는 미제공
에디터: Markdown + 이미지 업로드
이미지 저장소: 공개 읽기, 관리자만 쓰기
AI SEO: 1단계는 규칙 기반, 추후 AI 제안 추가
이전 방식: 기존 디자인 유지 후 구조 전환
```

## 8. 참고 기준

- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Auth with Next.js: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Vercel Sensitive Environment Variables: https://vercel.com/docs/environment-variables/sensitive-environment-variables
- Next.js Authentication Guide: https://nextjs.org/docs/app/guides/authentication
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
