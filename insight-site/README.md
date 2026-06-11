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
