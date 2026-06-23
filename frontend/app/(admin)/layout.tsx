import { RoleShell } from "@/components/layout/role-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="ADMIN">{children}</RoleShell>;
}
