import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const articles = {
  "overclo-insight-start": {
    title: "오버클로 인사이트를 시작합니다",
    description:
      "오버클로가 브랜드, 디자인, 콘텐츠, 비즈니스 운영에 관한 기록을 쌓기 위해 인사이트를 시작합니다.",
    keyword: "Overclo Insight",
    date: "2026-06-10",
    paragraphs: [
      "오버클로 인사이트는 홈페이지 제작, 상세페이지, 브랜딩, 콘텐츠 운영, 광고 준비 과정에서 얻은 관점과 기록을 정리하는 공간입니다.",
      "처음부터 많은 카테고리를 만들기보다, 실제로 발행되는 글의 흐름을 보면서 필요한 구조를 천천히 추가할 예정입니다.",
      "가장 중요한 목적은 오버클로의 SEO 자산을 꾸준히 쌓고, 검색엔진과 AI 응답 환경이 오버클로의 정보를 더 잘 이해하도록 만드는 것입니다."
    ]
  }
};

type ArticleSlug = keyof typeof articles;

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug as ArticleSlug];

  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `/insight/${slug}`
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/insight/${slug}`,
      publishedTime: article.date,
      images: ["/renewal/re_img/%EB%8C%80%ED%91%9C1.png"]
    }
  };
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug as ArticleSlug];

  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "Overclo Studio"
    },
    publisher: {
      "@type": "Organization",
      name: "Overclo Studio"
    },
    mainEntityOfPage: `https://www.overclo.com/insight/${slug}`
  };

  return (
    <main className="insight-shell article-shell">
      <header className="insight-nav">
        <Link href="/" className="insight-brand">
          Overclo Studio
        </Link>
        <nav aria-label="Insight navigation">
          <Link href="/portfolio">PORTFOLIO</Link>
          <Link href="/insight">INSIGHT</Link>
          <Link href="/#contact">CONTACT</Link>
        </nav>
      </header>

      <article className="article-body">
        <Link className="article-back" href="/insight">
          INSIGHT
        </Link>
        <p className="eyebrow">{article.keyword}</p>
        <h1>{article.title}</h1>
        <p className="article-description">{article.description}</p>
        <time dateTime={article.date}>{article.date}</time>
        {article.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="comment-placeholder" aria-label="Comments">
        <h2>댓글</h2>
        <p>댓글 작성과 관리자 승인 기능은 Supabase 연결 단계에서 활성화됩니다.</p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
