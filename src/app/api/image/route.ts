import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // (or "edge" if you prefer)

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  try {
    // Allow only http/https
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) {
      return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
    }

    // Fetch the remote image
    const imgRes = await fetch(parsed.toString(), {
      // helpful for some CDNs
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (!imgRes.ok) {
      return NextResponse.json({ error: "Upstream failed" }, { status: 502 });
    }

    // Forward content-type and body
    const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
    return new NextResponse(imgRes.body, {
      status: 200,
      headers: {
        "content-type": contentType,
        // cache on the browser/CDN a little if you want
        "cache-control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Bad url" }, { status: 400 });
  }
}
