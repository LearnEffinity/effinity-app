import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("Middleware function called for path:", request.nextUrl.pathname);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: {} },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(
    "User authentication status:",
    user ? "Authenticated" : "Not authenticated",
  );

  const pathname = request.nextUrl.pathname;
  console.log("Current pathname:", pathname);

  if (pathname.startsWith("/auth/reset")) {
    console.log("Allowing access to /auth/reset");
    return;
  }

  if (!user && (pathname === "/" || !pathname.startsWith("/auth"))) {
    console.log("No user, redirecting to login");
    return Response.redirect(new URL("/auth/login", request.url));
  }

  if (!user && !pathname.startsWith("/auth")) {
    console.log("No user, redirecting to login");
    return Response.redirect(new URL("/auth/login", request.url));
  }

  if (user) {
    console.log("User authenticated, fetching role");
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const userRole = userData?.role;
    console.log("User role:", userRole);

    // if (
    //   userRole !== "admin" &&
    //   !pathname.startsWith("/auth") &&
    //   pathname !== "/no"
    // ) {
    //   console.log("Non-admin accessing protected route, redirecting to /no");
    //   return Response.redirect(new URL("/no", request.url));
    // }

    if (pathname.startsWith("/auth") && pathname !== "/auth/reset") {
      console.log(
        "Authenticated user accessing auth page, redirecting to home",
      );
      return Response.redirect(new URL("/", request.url));
    }
  }

  console.log("Middleware completed, no redirection needed");
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
