import { RoleShell } from "@/components/layout/role-shell";

export const dynamic = "force-dynamic";

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  return <RoleShell role="BUYER">{children}</RoleShell>;
}
