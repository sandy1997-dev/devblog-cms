import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "devblog_admin_auth";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "devblog2024";

export function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE);
  return cookie?.value === ADMIN_PASSWORD;
}

export function requireAuth(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
