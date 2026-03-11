import { NextResponse } from "next/server";
import { getSearchIndex } from "@/lib/mdx";
export async function GET() {
  return NextResponse.json(getSearchIndex(), { headers: { "Cache-Control": "s-maxage=3600" } });
}
