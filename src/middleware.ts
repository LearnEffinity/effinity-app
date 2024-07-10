import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  console.log("Middleware function called for path:", request.nextUrl.pathname);
  const cookieStore = cookies();
  const { pathname } = request.nextUrl;

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
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );
  if (pathname.startsWith("/auth/callback")) {
    console.log("Skipping middleware for /auth/callback/route.ts");
    return;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("User data:", user);
  console.log(
    "User authentication status:",
    user ? "Authenticated" : "Not authenticated",
  );

  console.log("Current pathname:", pathname);

  if (pathname === "/signout" || pathname.startsWith("/auth/reset")) {
    console.log("Allowing access to /signout or /auth/reset");
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

  if (user) {
    const { data: onboardingStage, error: onboardingError } = await supabase
      .from("users")
      .select("onboardingStage")
      .eq("id", user.id)
      .single();

    const onboardingData = parseInt(onboardingStage?.onboardingStage);
    console.log("Onboarding data:", onboardingData, typeof onboardingData);

    if (onboardingError) {
      console.error("Error fetching onboarding data:", onboardingError);
    } else if (
      onboardingData !== null &&
      onboardingData !== undefined &&
      onboardingData !== -1
    ) {
      if (!pathname.startsWith("/onboarding") && pathname !== "/signout") {
        console.log("Redirecting to onboarding");
        return Response.redirect(new URL("/onboarding", request.url));
      }
    } else if (pathname.startsWith("/onboarding")) {
      if (onboardingData === -1) {
        console.log("Onboarding already completed, redirecting to home");
        return Response.redirect(new URL("/", request.url));
      }
      return;
    }
  }

  console.log("Middleware completed, no redirection needed");
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
