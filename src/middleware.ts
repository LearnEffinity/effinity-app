import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  console.log("Middleware function called for path:", request.nextUrl.pathname);
  const cookieStore = cookies();

  const supabase = createServerClient(
    "https://lgsfvkelrdcyiezhayoz.supabase.co/",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxnc2Z2a2VscmRjeWllemhheW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzMDg3ODYsImV4cCI6MjAyODg4NDc4Nn0.ueUfLllxnBQ4fpEaynvj3mprryoxDFIu5w3Bxyr7W5g",
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User data:", user);
  console.log(
    "User authentication status:",
    user ? "Authenticated" : "Not authenticated",
  );

  const { pathname } = request.nextUrl;
  console.log("Current pathname:", pathname);

  if (pathname.startsWith("/auth/reset")) {
    console.log("Allowing access to /auth/reset");
    return;
  }
  if (!user && !pathname.startsWith("/auth")) {
    console.log("No user, redirecting to login");
    return Response.redirect(new URL("/auth/login", request.url));
  }

  if (user && pathname.startsWith("/auth") && pathname !== "/auth/reset") {
    console.log("Authenticated user accessing auth page, redirecting to home");
    return Response.redirect(new URL("/", request.url));
  }
}

console.log("Middleware completed, no redirection needed");

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
