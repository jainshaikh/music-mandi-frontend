import { escapeHtml, getSendGridConfig, sgMail } from "@/lib/email";

// Interim, frontend-hosted implementation — see docs/DECISIONS.md DEC-017.
// Ported from music_mandi-website's own working /api/integrations/artist-submit.
const GENRES = [
  "Pop",
  "Hip-hop",
  "Rock",
  "Electronic",
  "Folk",
  "Classical",
  "Other",
];

// Kept comfortably under SendGrid's ~30MB total message size — attachments
// are base64'd before sending, which inflates raw bytes by roughly a third.
const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

export async function POST(request: Request) {
  const config = getSendGridConfig("ARTIST_TO_EMAIL");
  if (!config) {
    console.error(
      "Artist submission is missing SendGrid configuration (SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, ARTIST_TO_EMAIL)",
    );
    return Response.json(
      { error: "Artist submissions are not configured." },
      { status: 500 },
    );
  }
  const { fromEmail, toEmail } = config;

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const artistName = String(formData.get("artistName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const genres = formData
    .getAll("genre")
    .map(String)
    .filter((g) => GENRES.includes(g));
  const musicLink = String(formData.get("musicLink") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const youtube = String(formData.get("youtube") ?? "").trim();
  const spotify = String(formData.get("spotify") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const heard = String(formData.get("heard") ?? "").trim();

  if (
    !fullName ||
    !artistName ||
    !email ||
    !city ||
    genres.length === 0 ||
    !musicLink ||
    !bio
  ) {
    return Response.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  let totalBytes = 0;
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return Response.json(
        {
          error: `"${file.name}" is larger than 15MB. Please use a smaller file or share a streaming link instead.`,
        },
        { status: 400 },
      );
    }
    totalBytes += file.size;
  }
  if (totalBytes > MAX_TOTAL_BYTES) {
    return Response.json(
      {
        error:
          "Uploaded files are too large overall (20MB max combined). Please use a streaming link instead.",
      },
      { status: 400 },
    );
  }

  const attachments = await Promise.all(
    files.map(async (file) => ({
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      filename: file.name || "audio-submission",
      type: file.type || "audio/mpeg",
      disposition: "attachment" as const,
    })),
  );

  const summaryLines = [
    `Full name: ${fullName}`,
    `Artist / band name: ${artistName}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    `City: ${city}`,
    `Genre: ${genres.join(", ")}`,
    `Music link: ${musicLink}`,
    instagram && `Instagram: ${instagram}`,
    youtube && `YouTube: ${youtube}`,
    spotify && `Spotify: ${spotify}`,
    heard && `Heard about us via: ${heard}`,
    "",
    "Bio:",
    bio,
  ].filter((line): line is string => Boolean(line));

  try {
    await sgMail.send({
      to: toEmail,
      from: fromEmail,
      replyTo: email,
      subject: `[Artist submission] ${artistName} — ${fullName}`,
      text: summaryLines.join("\n"),
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  } catch (error) {
    console.error("SendGrid artist submission send failed", error);
    return Response.json(
      { error: "Could not submit right now. Please try again." },
      { status: 502 },
    );
  }

  // Best-effort confirmation back to the artist. Its failure shouldn't fail
  // the request — the team's notification above is the part that matters.
  try {
    await sgMail.send(
      buildConfirmationEmail({ fromEmail, fullName, artistName, email }),
    );
  } catch (error) {
    console.error("SendGrid artist confirmation email failed", error);
  }

  return Response.json({ ok: true });
}

function buildConfirmationEmail({
  fromEmail,
  fullName,
  artistName,
  email,
}: {
  fromEmail: string;
  fullName: string;
  artistName: string;
  email: string;
}) {
  const firstName = fullName.split(" ")[0];
  const safeFirstName = escapeHtml(firstName);
  const safeArtistName = escapeHtml(artistName);

  return {
    to: email,
    from: { email: fromEmail, name: "Music Mandi" },
    subject: "We've got your submission — Music Mandi",
    text: [
      `Hi ${firstName},`,
      "",
      `Thanks for sending "${artistName}" our way. Your submission is with our A&R team now.`,
      "",
      "If it's a fit, you'll hear from us within the confirmed review window. Either way, keep making records.",
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
            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#fff;">We've got your submission, ${safeFirstName}.</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#c7cbd4;">
              Thanks for sending <strong style="color:#fff;">${safeArtistName}</strong> our way. Your submission is now with our
              A&amp;R team.
            </p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#c7cbd4;">
              If it's a fit, you'll hear from us within the confirmed review window. Either way, keep making records.
            </p>
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
