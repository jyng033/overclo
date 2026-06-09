import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Magazine",
  description: "오버클로 스튜디오가 발행하는 비즈니스, 디자인, 브랜드, 웹 운영 인사이트입니다.",
  alternates: {
    canonical: "/magazine"
  },
  openGraph: {
    title: "Overclo Magazine",
    description: "비즈니스와 브랜드 성장을 위한 오버클로 스튜디오의 매거진입니다.",
    url: "/magazine",
    images: ["/renewal/re_img/%EB%8C%80%ED%91%9C1.png"]
  }
};

const seedArticles = [
  {
    slug: "website-project-brief",
    title: "홈페이지 제작 전, 먼저 정리해야 할 것들",
    excerpt:
      "좋은 홈페이지 제작은 디자인 시안보다 먼저 비즈니스 목표, 고객 행동, 콘텐츠 구조를 정리하는 일에서 시작됩니다.",
    date: "2026.06.10",
    keyword: "홈페이지 제작"
  },
  {
    slug: "small-business-online-presence",
    title: "작은 브랜드가 온라인에서 신뢰를 만드는 방법",
    excerpt:
      "업종과 예산이 달라도 고객이 안심하고 문의하게 만드는 기본 요소는 분명히 존재합니다.",
    date: "2026.06.10",
    keyword: "브랜드 신뢰"
  },
  {
    slug: "detail-page-conversion",
    title: "상세페이지에서 구매 전환을 막는 흔한 문제",
    excerpt:
      "제품 설명이 많아도 구매로 이어지지 않는다면 정보의 양보다 설득 순서를 먼저 점검해야 합니다.",
    date: "2026.06.10",
    keyword: "상세페이지"
  }
];

export default function MagazinePage() {
  return (
    <main className="magazine-shell">
      <header className="magazine-nav">
        <Link href="/" className="magazine-brand">
          Overclo Studio
        </Link>
        <nav aria-label="Magazine navigation">
          <Link href="/portfolio">PORTFOLIO</Link>
          <Link href="/magazine" aria-current="page">
            MAGAZINE
          </Link>
          <Link href="/#contact">CONTACT</Link>
        </nav>
      </header>

      <section className="magazine-hero">
        <p className="eyebrow">MAGAZINE</p>
        <h1>비즈니스가 더 잘 전달되도록, 생각을 정리해 발행합니다.</h1>
        <p>
          오버클로 매거진은 디자인 작업에만 한정하지 않고 브랜드, 웹사이트, 콘텐츠,
          온라인 운영 전반의 실무 인사이트를 다룹니다.
        </p>
      </section>

      <section className="magazine-grid" aria-label="Magazine articles">
        {seedArticles.map((article) => (
          <Link className="article-card" href={`/magazine/${article.slug}`} key={article.slug}>
            <span>{article.keyword}</span>
            <h2>{article.title}</h2>
            <p>{article.excerpt}</p>
            <time>{article.date}</time>
          </Link>
        ))}
      </section>
    </main>
  );
}
