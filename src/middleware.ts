import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

interface User {
  id: string;
  email: string;
  role: string;
  onboardingStage: number;
  first_name: string;
  last_name: string;
  username: string;
}

export async function middleware(request: NextRequest) {
  console.log("Middleware function called for path:", request.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          response.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
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
    return response;
  }

  if (!user && (pathname === "/" || !pathname.startsWith("/auth"))) {
    console.log("No user, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (!user && !pathname.startsWith("/auth")) {
    console.log("No user, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (user) {
    console.log("User authenticated, fetching role");
    const { data: pubUser } = await supabase
      .from("users")
      .select("role, onboardingStage, username")
      .eq("id", user.id)
      .single();

    const userRole = pubUser?.role;
    console.log("User role:", userRole);

    if (pubUser?.onboardingStage !== "-1" && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // !Uncomment this block if you want to restrict non-admin access
    // if (
    //   userRole !== "admin" &&
    //   !pathname.startsWith("/auth") &&
    //   pathname !== "/no"
    // ) {
    //   console.log("Non-admin accessing protected route, redirecting to /no");
    //   return NextResponse.redirect(new URL("/no", request.url));
    // }

    if (pathname.startsWith("/auth") && pathname !== "/auth/reset") {
      console.log(
        "Authenticated user accessing auth page, redirecting to home",
      );
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  console.log("Middleware completed, no redirection needed");
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
