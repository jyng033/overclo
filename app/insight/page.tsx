import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Insight",
  description: "오버클로 스튜디오가 발행하는 비즈니스, 디자인, 브랜드, 웹 운영 인사이트입니다.",
  alternates: {
    canonical: "/insight"
  },
  openGraph: {
    title: "Overclo Insight",
    description: "비즈니스와 브랜드 성장을 위한 오버클로 스튜디오의 인사이트입니다.",
    url: "/insight",
    images: ["/renewal/re_img/%EB%8C%80%ED%91%9C1.png"]
  }
};

const seedArticles = [
  {
    slug: "overclo-insight-start",
    title: "오버클로 인사이트를 시작합니다",
    excerpt:
      "브랜드, 디자인, 콘텐츠, 비즈니스 운영에 관한 기록을 쌓기 위해 인사이트를 시작합니다.",
    date: "2026.06.10",
    keyword: "Overclo Insight"
  }
];

export default function InsightPage() {
  return (
    <main className="insight-shell">
      <header className="insight-nav">
        <Link href="/" className="insight-brand">
          Overclo Studio
        </Link>
        <nav aria-label="Insight navigation">
          <Link href="/portfolio">PORTFOLIO</Link>
          <Link href="/insight" aria-current="page">
            INSIGHT
          </Link>
          <Link href="/#contact">CONTACT</Link>
        </nav>
      </header>

      <section className="insight-hero">
        <p className="eyebrow">INSIGHT</p>
        <h1>비즈니스가 더 잘 전달되도록, 생각을 정리해 발행합니다.</h1>
        <p>
          오버클로 인사이트는 디자인 작업에만 한정하지 않고 브랜드, 웹사이트, 콘텐츠,
          온라인 운영 전반의 실무 인사이트를 다룹니다.
        </p>
      </section>

      <section className="insight-grid" aria-label="Insight articles">
        {seedArticles.map((article) => (
          <Link className="article-card" href={`/insight/${article.slug}`} key={article.slug}>
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
