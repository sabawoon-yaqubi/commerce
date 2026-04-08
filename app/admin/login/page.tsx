import { AdminLoginForm } from "components/admin/admin-login-form";
import { Suspense } from "react";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="rounded-none border border-[#ece8e3] bg-white/80 p-10 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          aria-live="polite"
        >
          <div className="h-3 w-24 animate-pulse rounded-none bg-[#ece8e3]" />
          <div className="mt-6 h-8 w-48 animate-pulse rounded-none bg-[#ece8e3]" />
          <div className="mt-8 space-y-4">
            <div className="h-10 animate-pulse rounded-none bg-[#f4f2ef]" />
            <div className="h-10 animate-pulse rounded-none bg-[#f4f2ef]" />
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
