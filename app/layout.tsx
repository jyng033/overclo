import type { Metadata } from "next";
import "./magazine.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.overclo.com"),
  title: {
    default: "Overclo Studio | 디자인 스튜디오",
    template: "%s | Overclo Studio"
  },
  description:
    "홈페이지 제작 전문 디자인 스튜디오 오버클로. 반응형 웹사이트, 랜딩페이지, 쇼핑몰 제작부터 상세페이지와 브랜드 디자인까지 제공합니다.",
  openGraph: {
    siteName: "Overclo Studio",
    type: "website",
    locale: "ko_KR"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
