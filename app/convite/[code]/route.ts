import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Link de convite do programa indique e ganhe: /convite/abc123 → cadastro
// já com o código do indicador preenchido.
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();

  const { data: referrer } = await supabase
    .from("influencers")
    .select("invite_code")
    .eq("invite_code", code)
    .single();

  const target = referrer ? `/register?invite=${encodeURIComponent(code)}` : "/register";
  return NextResponse.redirect(new URL(target, request.url));
}
