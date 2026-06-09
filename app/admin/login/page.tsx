import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { optionalServerEnv } from "../../lib/env";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLoginPage() {
  const isConfigured =
    Boolean(optionalServerEnv("NEXT_PUBLIC_SUPABASE_URL")) &&
    Boolean(optionalServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"));

  return (
    <main className="admin-shell">
      <section className="admin-panel">
        <p className="eyebrow">OVERCLO ADMIN</p>
        <h1>관리자 로그인</h1>
        {isConfigured ? (
          <LoginForm />
        ) : (
          <p>
            Supabase 환경변수가 아직 설정되지 않았습니다. 프로젝트 URL과 anon key를 연결하면
            로그인 폼이 활성화됩니다.
          </p>
        )}
      </section>
    </main>
  );
}
