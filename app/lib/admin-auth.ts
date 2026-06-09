import { createSupabaseServerClient } from "./supabase/server";

const ADMIN_ROLES = ["owner", "admin", "editor", "writer", "moderator"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export async function getCurrentAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, display_name, role, status")
    .eq("auth_user_id", user.id)
    .eq("status", "active")
    .single();

  if (error || !data) return null;

  return data as {
    id: string;
    email: string;
    display_name: string | null;
    role: AdminRole;
    status: "active";
  };
}

export function hasAdminRole(role: AdminRole, allowed: AdminRole[]) {
  return allowed.includes(role);
}
