import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { str, int } from "@/lib/api";

/** Public review submission. Lands unapproved and awaits moderation. */
const submissions = new Map<string, number[]>();
const WINDOW = 60 * 60 * 1000;
const MAX_PER_HOUR = 3;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  // Honeypot: only bots fill a field that is visually hidden.
  if (str(body.website)) return NextResponse.json({ ok: true, message: "Thanks!" });

  const slug = str(body.slug);
  const authorName = str(body.authorName).slice(0, 80);
  const reviewBody = str(body.body).slice(0, 2000);
  const rating = Math.min(5, Math.max(1, int(body.rating, 5)));

  if (!slug || !authorName || !reviewBody) {
    return NextResponse.json({ error: "Name and review text are required." }, { status: 400 });
  }
  if (reviewBody.length < 20) {
    return NextResponse.json(
      { error: "Please write at least a couple of sentences." },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "local";
  const now = Date.now();
  const recent = (submissions.get(ip) || []).filter((time) => now - time < WINDOW);
  if (recent.length >= MAX_PER_HOUR) {
    return NextResponse.json(
      { error: "You have submitted several reviews already. Please try again later." },
      { status: 429 },
    );
  }
  submissions.set(ip, [...recent, now]);

  const itinerary = await prisma.itinerary.findFirst({
    where: { slug, status: "published" },
    select: { id: true },
  });
  if (!itinerary) return NextResponse.json({ error: "Trek not found." }, { status: 404 });

  await prisma.review.create({
    data: {
      itineraryId: itinerary.id,
      authorName,
      country: str(body.country).slice(0, 60),
      title: str(body.title).slice(0, 120),
      body: reviewBody,
      rating,
      approved: false, // moderated before it affects the aggregate rating
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Thanks! Your review has been submitted and will appear once approved.",
  });
}
