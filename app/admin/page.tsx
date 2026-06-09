import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "../lib/admin-auth";
import { optionalServerEnv } from "../lib/env";
import { signOutAdmin } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  const isConfigured =
    Boolean(optionalServerEnv("NEXT_PUBLIC_SUPABASE_URL")) &&
    Boolean(optionalServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));

  if (!isConfigured) {
    return (
      <main className="admin-shell">
        <section className="admin-panel">
          <p className="eyebrow">OVERCLO ADMIN</p>
          <h1>연결 대기 중</h1>
          <p>
            Supabase 프로젝트 연결 후 관리자 로그인이 활성화됩니다. 필요한 값은
            `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
            `SUPABASE_SERVICE_ROLE_KEY`입니다.
          </p>
          <div className="admin-checklist">
            <span>Supabase URL</span>
            <span>Anon key</span>
            <span>Service role key</span>
            <span>DB migration</span>
          </div>
        </section>
      </main>
    );
  }

  return <AdminDashboard />;
}

async function AdminDashboard() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <p className="eyebrow">OVERCLO ADMIN</p>
        <h1>관리자 대시보드</h1>
        <p>
          {admin.display_name || admin.email}님으로 로그인했습니다. 다음 단계에서 게시글 작성,
          댓글 승인, 이미지 관리 화면을 순서대로 연결합니다.
        </p>
        <div className="admin-checklist">
          <span>{admin.role}</span>
          <span>게시글 관리</span>
          <span>댓글 승인</span>
          <span>SEO 자동화</span>
        </div>
        <form action={signOutAdmin}>
          <button className="admin-secondary-button" type="submit">
            로그아웃
          </button>
        </form>
      </section>
    </main>
  );
}
