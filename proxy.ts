import { getSupabasePublishableKey } from "lib/supabase/env";
import { updateSession } from "lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getSupabasePublishableKey();

  if (!url || !key) {
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      !request.nextUrl.pathname.startsWith("/admin/login")
    ) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("error", "config");
      return NextResponse.redirect(login);
    }
    return NextResponse.next({ request });
  }

  const { response, user } = await updateSession(request);

  const isAdminLogin = request.nextUrl.pathname === "/admin/login";
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");

  if (isAdmin && !isAdminLogin && !user) {
    const redirect = new URL("/admin/login", request.url);
    redirect.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirect);
  }

  if (isAdminLogin && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on all app routes except static assets so the Supabase session cookie
     * can refresh; `/admin/*` still enforces auth below.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
