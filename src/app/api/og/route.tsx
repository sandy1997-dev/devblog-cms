import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { siteConfig } from "@/lib/config";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title  = searchParams.get("title") ?? siteConfig.title;
  const tags   = searchParams.get("tags")?.split(",") ?? [];
  const author = searchParams.get("author") ?? siteConfig.author.name;
  const date   = searchParams.get("date") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0e0d0b",
          padding: "60px 72px",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Decorative corner */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle at top right, rgba(245,158,11,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#f59e0b",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              color: "#0e0d0b",
            }}
          >
            D
          </div>
          <span style={{ color: "#e5e0d7", fontSize: 20, fontWeight: 700 }}>
            {siteConfig.name}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {tags.slice(0, 3).map((tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(245,158,11,0.15)",
                  border: "1px solid rgba(245,158,11,0.3)",
                  color: "#fbbf24",
                  borderRadius: 999,
                  padding: "4px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 50 ? 42 : 56,
            fontWeight: 800,
            color: "#f2f0eb",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 32,
            maxWidth: "90%",
          }}
        >
          {title}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 24,
          }}
        >
          <span style={{ color: "#7a6445", fontSize: 16 }}>{author}</span>
          {date && (
            <span style={{ color: "#493b28", fontSize: 14, fontFamily: "monospace" }}>
              {date}
            </span>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
