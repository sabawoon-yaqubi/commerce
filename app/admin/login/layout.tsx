import { AdminAuthShell } from "components/admin/admin-auth-shell";
import type { ReactNode } from "react";

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return <AdminAuthShell>{children}</AdminAuthShell>;
}
