import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client ONLY for middleware
  const supabase = createMiddlewareClient({ req, res });

  // PUBLIC PATHS
  const publicPaths = ["/auth", "/login", "/signup"];
  const path = req.nextUrl.pathname;

  if (publicPaths.some((p) => path.startsWith(p))) {
    return res;
  }

  // Check user auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
