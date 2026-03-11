import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_PASSWORD } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, ADMIN_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}
