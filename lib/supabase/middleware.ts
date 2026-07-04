import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_HOME: Record<string, string> = {
  influencer: "/influencer/dashboard",
  brand: "/brand/dashboard",
  admin: "/admin/dashboard",
};

function roleForPath(pathname: string): "influencer" | "brand" | "admin" | null {
  if (pathname.startsWith("/influencer")) return "influencer";
  if (pathname.startsWith("/brand")) return "brand";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiredRole = roleForPath(request.nextUrl.pathname);

  if (requiredRole) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("user_id", user.id)
      .single();

    if (!profile || profile.account_type !== requiredRole) {
      const url = request.nextUrl.clone();
      url.pathname = profile?.account_type ? ROLE_HOME[profile.account_type] ?? "/" : "/login";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
