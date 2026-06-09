import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <p className="eyebrow">OVERCLO ADMIN</p>
        <h1>관리자 시스템 준비 중</h1>
        <p>
          이 영역은 `admin.overclo.com` 전용 관리자 앱으로 분리될 예정입니다. 다음 단계에서
          Supabase Auth, 관리자 권한, 게시글 관리, 댓글 승인 기능을 연결합니다.
        </p>
        <div className="admin-checklist">
          <span>로그인 보호</span>
          <span>다중 관리자 권한</span>
          <span>게시글 관리</span>
          <span>댓글 승인</span>
          <span>SEO 자동화</span>
        </div>
      </section>
    </main>
  );
}
