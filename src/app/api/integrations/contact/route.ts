import { escapeHtml, getSendGridConfig, sgMail } from "@/lib/email";
import { detectBot, ELAPSED_FIELD, HONEYPOT_FIELD } from "@/lib/formGuard";

// Interim, frontend-hosted implementation — see docs/DECISIONS.md DEC-017.
// Ported from music_mandi-website's own working /api/integrations/contact.
const TOPICS = [
  "General enquiry",
  "Artist or release",
  "TELE Ads",
  "Partnership",
  "Press",
];

// Mirrored as maxLength on ContactForm's inputs, so people never hit these.
const MAX_LENGTHS = {
  name: 100,
  email: 254,
  company: 150,
  phone: 30,
  message: 5000,
};

export async function POST(request: Request) {
  const config = getSendGridConfig("CONTACT_TO_EMAIL");
  if (!config) {
    console.error(
      "Contact form is missing SendGrid configuration (SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, CONTACT_TO_EMAIL)",
    );
    return Response.json(
      { error: "Contact form is not configured." },
      { status: 500 },
    );
  }
  const { fromEmail, toEmail } = config;

  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const botSignal = detectBot(body[HONEYPOT_FIELD], body[ELAPSED_FIELD]);
  if (botSignal) {
    // Fake success so the bot gets no signal to adapt to — nothing is sent.
    console.warn(`Contact form: dropped likely-bot submission (${botSignal})`);
    return Response.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const company = String(body.company ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const topic = TOPICS.includes(body.topic) ? String(body.topic) : TOPICS[0];

  if (!name || !email || !message) {
    return Response.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (
    name.length > MAX_LENGTHS.name ||
    email.length > MAX_LENGTHS.email ||
    company.length > MAX_LENGTHS.company ||
    phone.length > MAX_LENGTHS.phone ||
    message.length > MAX_LENGTHS.message
  ) {
    return Response.json(
      { error: "One or more fields are too long." },
      { status: 400 },
    );
  }

  try {
    await sgMail.send({
      to: toEmail,
      from: fromEmail,
      replyTo: email,
      subject: `[Contact] ${topic} — ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        company && `Company: ${company}`,
        phone && `Phone: ${phone}`,
        `Topic: ${topic}`,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (error) {
    console.error("SendGrid send failed", error);
    return Response.json(
      { error: "Could not send your message. Please try again." },
      { status: 502 },
    );
  }

  // Best-effort confirmation back to the person who submitted the form. Its
  // failure shouldn't fail the request — the team's notification above is
  // the part that actually matters operationally.
  try {
    await sgMail.send(buildConfirmationEmail({ fromEmail, email, topic }));
  } catch (error) {
    console.error("SendGrid confirmation email failed", error);
  }

  return Response.json({ ok: true });
}

// Deliberately repeats nothing the submitter typed — only the whitelisted
// topic. This goes to whatever address was entered, so echoing the name or
// message would let a bot use our verified domain to deliver its own text to
// strangers (see DEC-037).
function buildConfirmationEmail({
  fromEmail,
  email,
  topic,
}: {
  fromEmail: string;
  email: string;
  topic: string;
}) {
  const safeTopic = escapeHtml(topic);

  return {
    to: email,
    from: { email: fromEmail, name: "Music Mandi" },
    subject: "We've got your message — Music Mandi",
    text: [
      "Hi there,",
      "",
      "Thanks for reaching out to Music Mandi. Your message has landed in the right inbox and our team will get back to you within 1 to 2 working days.",
      "",
      `Topic: ${topic}`,
      "",
      "If anything changes in the meantime, just reply to this email.",
      "",
      "Talk soon,",
      "The Music Mandi Team",
    ].join("\n"),
    html: `
      <div style="background:#0b0d14;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
        <div style="max-width:520px;margin:0 auto;background:#12141c;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
          <div style="background:linear-gradient(135deg,#ff1972,#ff7a3d);padding:28px 32px;">
            <span style="color:#fff;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Music Mandi</span>
          </div>
          <div style="padding:32px;color:#e7e9ee;">
            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#fff;">We've got your message.</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#c7cbd4;">
              Thanks for reaching out to Music Mandi. Your enquiry has landed with the right team and we'll get back to you within
              <strong style="color:#fff;">1 to 2 working days</strong>.
            </p>
            <div style="margin:24px 0;padding:16px 18px;background:#0b0d14;border:1px solid rgba(255,255,255,0.08);border-radius:12px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#ff568b;">Topic</p>
              <p style="margin:0;font-size:14px;color:#e7e9ee;">${safeTopic}</p>
            </div>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#c7cbd4;">
              If anything changes in the meantime, just reply to this email and it'll reach us directly.
            </p>
            <p style="margin:24px 0 0;font-size:14px;color:#c7cbd4;">
              Talk soon,<br />The Music Mandi Team
            </p>
          </div>
        </div>
      </div>
    `,
  };
}
