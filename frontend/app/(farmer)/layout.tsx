import { RoleShell } from "@/components/layout/role-shell";

export const dynamic = "force-dynamic";

export default async function FarmerLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="FARMER">{children}</RoleShell>;
}
