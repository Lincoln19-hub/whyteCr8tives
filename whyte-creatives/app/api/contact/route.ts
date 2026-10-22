import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Contact form submissions should never be cached.
export const dynamic = "force-dynamic";

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  date?: string;
  location?: string;
  message?: string;
  company?: string; // honeypot
};

const MAX_LENGTH = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value: unknown, limit = MAX_LENGTH): string {
  if (typeof value !== "string") return "";
  return value.replace(/\0/g, "").slice(0, limit).trim();
}

/** Human-readable summary used for both Resend and the mailto fallback. */
function buildText(p: Required<Pick<Payload, "name" | "email" | "phone" | "message">> & Payload) {
  return [
    `New enquiry from ${p.name}`,
    "",
    `Email:    ${p.email}`,
    `Phone:    ${p.phone}`,
    p.service ? `Service:  ${p.service}` : "",
    p.date ? `Date:     ${p.date}` : "",
    p.location ? `Location: ${p.location}` : "",
    "",
    "Message:",
    p.message,
    "",
    "—",
    "Sent from the whyteCreatives website contact form.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const payload = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 60),
    service: clean(body.service, 80),
    date: clean(body.date, 40),
    location: clean(body.location, 160),
    message: clean(body.message),
    company: clean(body.company, 120),
  };

  // Honeypot triggered → pretend success, drop the submission.
  if (payload.company) {
    return NextResponse.json({ ok: true, mode: "honeypot" });
  }

  const missing = (["name", "email", "phone", "message"] as const).filter(
    (key) => !payload[key]
  );
  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Missing required field(s): ${missing.join(", ")}.` },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(payload.email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 }
    );
  }

  const subject = `Website enquiry — ${payload.name}${payload.service ? ` (${payload.service})` : ""}`;
  const text = buildText(payload);

  const formspree = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const inbox = process.env.CONTACT_INBOX_EMAIL?.trim();
  const fallback =
    process.env.NEXT_PUBLIC_FALLBACK_EMAIL?.trim() || "whytecobby@gmail.com";

  /* ---- Provider A: Formspree ---- */
  if (formspree) {
    try {
      const res = await fetch(formspree, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _replyto: payload.email,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          service: payload.service,
          date: payload.date,
          location: payload.location,
          message: payload.message,
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true, mode: "formspree" });
      console.error("Formspree rejected the submission:", res.status, await res.text());
    } catch (err) {
      console.error("Formspree request failed:", err);
    }
  }

  /* ---- Provider B: Resend ---- */
  if (resendKey && inbox) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL?.trim() || `Website <onboarding@resend.dev>`,
          to: [inbox],
          reply_to: payload.email,
          subject,
          text,
        }),
      });
      if (res.ok) return NextResponse.json({ ok: true, mode: "resend" });
      console.error("Resend rejected the email:", res.status, await res.text());
    } catch (err) {
      console.error("Resend request failed:", err);
    }
  }

  /* ---- Fallback: hand the visitor a pre-filled mailto link ---- */
  const mailto = `mailto:${fallback}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(text)}`;

  return NextResponse.json({ ok: true, mode: "mailto", mailto });
}
