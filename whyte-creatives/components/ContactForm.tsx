"use client";

import { useRef, useState, type FormEvent } from "react";

type Status = { tone: "ok" | "err" | "info"; message: string } | null;

const FALLBACK_EMAIL =
  process.env.NEXT_PUBLIC_FALLBACK_EMAIL ?? "hello@whytecreatives.com";

const SERVICES = [
  "Wedding",
  "Portrait session",
  "Graduation",
  "Event coverage",
  "Brand / product",
  "Videography",
  "Something else",
];

/**
 * Contact form. Posts to /api/contact, which forwards to whichever provider
 * is configured (Formspree → Resend → mailto fallback). See .env.example.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form || busy) return;

    setBusy(true);
    setStatus({ tone: "info", message: "Sending…" });

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        mode?: string;
        mailto?: string;
        error?: string;
      };

      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? `Request failed (${res.status})`);
      }

      // No provider configured → hand the visitor a pre-filled email instead.
      if (json.mode === "mailto" && json.mailto) {
        window.location.href = json.mailto;
        setStatus({
          tone: "ok",
          message:
            "Your email app should have opened with the message ready to send. If it didn't, write to us directly — we reply within 24 hours.",
        });
      } else {
        setStatus({
          tone: "ok",
          message:
            "Message sent. Thank you — we'll be in touch within 24 hours.",
        });
        form.reset();
      }
    } catch (err) {
      setStatus({
        tone: "err",
        message: `Sorry, that didn't go through. Please email ${FALLBACK_EMAIL} directly and we'll pick it up from there.`,
      });
      if (process.env.NODE_ENV !== "production") console.error(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate={false}>
      <div className="form__row">
        <div className="field">
          <label htmlFor="name">
            Name <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">
            Email address <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="phone">
            Phone <span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+233 …"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="service">What do you need?</label>
          <select id="service" name="service" defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="date">Preferred date</label>
          <input id="date" name="date" type="date" />
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="Akosombo, Accra, Kumasi…"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="message">
          Message <span className="req" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Tell me about the day, the brand or the moment you want kept."
          required
        />
      </div>

      {/* Honeypot — bots fill this, humans never see it */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status ? (
        <p className="form__status" data-tone={status.tone} role="status">
          {status.message}
        </p>
      ) : null}

      <div>
        <button type="submit" className="btn" disabled={busy}>
          {busy ? "Sending…" : "Send Message"}{" "}
          <span className="btn__arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>

      <p className="form__note">
        We reply within 24 hours, usually much sooner. Your details are only
        used to respond to this enquiry.
      </p>
    </form>
  );
}
