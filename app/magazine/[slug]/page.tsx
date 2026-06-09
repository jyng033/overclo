import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const articles = {
  "website-project-brief": {
    title: "홈페이지 제작 전, 먼저 정리해야 할 것들",
    description:
      "홈페이지 제작을 시작하기 전에 정리하면 좋은 목표, 고객 행동, 콘텐츠 구조, 문의 동선을 설명합니다.",
    keyword: "홈페이지 제작",
    date: "2026-06-10",
    paragraphs: [
      "홈페이지 제작은 화면을 예쁘게 만드는 일에서 시작하지 않습니다. 먼저 어떤 고객에게 어떤 신뢰를 주고, 어떤 행동으로 이어지게 할지 정리해야 합니다.",
      "좋은 제작 브리프에는 서비스 설명, 핵심 고객, 문의 전환 목표, 필요한 페이지, 참고 사이트, 기존 브랜드 자산이 포함됩니다.",
      "이 정보가 명확할수록 디자인은 취향 싸움이 아니라 비즈니스 목표를 설계하는 과정이 됩니다."
    ]
  },
  "small-business-online-presence": {
    title: "작은 브랜드가 온라인에서 신뢰를 만드는 방법",
    description:
      "작은 브랜드가 홈페이지, 포트폴리오, 고객 후기, 문의 동선을 통해 온라인 신뢰를 만드는 방법을 정리합니다.",
    keyword: "브랜드 신뢰",
    date: "2026-06-10",
    paragraphs: [
      "온라인에서 신뢰는 큰 규모보다 명확한 정보에서 만들어집니다. 고객은 회사가 무엇을 잘하고, 어떤 결과를 만들었고, 어떻게 문의하면 되는지 빠르게 확인하고 싶어합니다.",
      "작은 브랜드일수록 포트폴리오, 실제 후기, 작업 과정, 명확한 연락 동선이 중요합니다.",
      "사이트는 브랜드를 크게 보이게 하는 장식이 아니라 고객의 불안을 줄이는 설계여야 합니다."
    ]
  },
  "detail-page-conversion": {
    title: "상세페이지에서 구매 전환을 막는 흔한 문제",
    description:
      "상세페이지에서 구매 전환을 낮추는 정보 순서, 신뢰 요소, 이미지 구성 문제를 점검합니다.",
    keyword: "상세페이지",
    date: "2026-06-10",
    paragraphs: [
      "상세페이지는 정보를 많이 넣는다고 전환이 좋아지지 않습니다. 고객이 궁금해하는 순서대로 정보를 배치해야 합니다.",
      "초반에는 제품의 핵심 차이와 사용 장면을 보여주고, 중반에는 근거와 비교 정보를 제공하며, 후반에는 구매 불안을 줄이는 요소가 필요합니다.",
      "전환을 막는 문제는 디자인 퀄리티보다 설득 순서에서 발견되는 경우가 많습니다."
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
      canonical: `/magazine/${slug}`
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: `/magazine/${slug}`,
      publishedTime: article.date,
      images: ["/renewal/re_img/%EB%8C%80%ED%91%9C1.png"]
    }
  };
}

export default async function MagazineArticlePage({ params }: { params: Promise<{ slug: string }> }) {
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
    mainEntityOfPage: `https://www.overclo.com/magazine/${slug}`
  };

  return (
    <main className="magazine-shell article-shell">
      <header className="magazine-nav">
        <Link href="/" className="magazine-brand">
          Overclo Studio
        </Link>
        <nav aria-label="Magazine navigation">
          <Link href="/portfolio">PORTFOLIO</Link>
          <Link href="/magazine">MAGAZINE</Link>
          <Link href="/#contact">CONTACT</Link>
        </nav>
      </header>

      <article className="article-body">
        <Link className="article-back" href="/magazine">
          MAGAZINE
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
