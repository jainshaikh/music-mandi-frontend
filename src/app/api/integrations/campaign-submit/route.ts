import { escapeHtml, getSendGridConfig, sgMail } from "@/lib/email";
import { formatPKR } from "@/lib/sellerAds";

// Interim, frontend-hosted implementation — see docs/DECISIONS.md DEC-017.
// Ported from music_mandi-website's own working /api/integrations/campaign-submit.

// Kept comfortably under SendGrid's ~30MB total message size — attachments
// are base64'd before sending, which inflates raw bytes by roughly a third.
const MAX_AUDIO_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  const config = getSendGridConfig("ADS_TO_EMAIL");
  if (!config) {
    console.error(
      "Campaign submission is missing SendGrid configuration (SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, ADS_TO_EMAIL)",
    );
    return Response.json(
      { error: "Campaign submission is not configured." },
      { status: 500 },
    );
  }
  const { fromEmail, toEmail } = config;

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const advertiserName = String(formData.get("advertiserName") ?? "").trim();
  const advertiserEmail = String(formData.get("advertiserEmail") ?? "").trim();
  const advertiserCompany = String(
    formData.get("advertiserCompany") ?? "",
  ).trim();
  const advertiserPhone = String(formData.get("advertiserPhone") ?? "").trim();
  const campaignName = String(formData.get("campaignName") ?? "").trim();
  const objective = String(formData.get("objective") ?? "").trim();
  const start = String(formData.get("start") ?? "").trim();
  const end = String(formData.get("end") ?? "").trim();
  const budget = Number(formData.get("budget") ?? 0);
  const location = String(formData.get("location") ?? "").trim();
  const cities = formData.getAll("cities").map(String);
  const ageMin = Number(formData.get("ageMin") ?? 0);
  const ageMax = Number(formData.get("ageMax") ?? 0);
  const gender = String(formData.get("gender") ?? "").trim();
  const advancedTargeting = formData.getAll("advancedTargeting").map(String);
  const languages = formData.getAll("languages").map(String);
  const sms = String(formData.get("sms") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();

  if (!advertiserName || !advertiserEmail || !campaignName || !budget) {
    return Response.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  const audioFile = formData.get("audio");
  const audio =
    audioFile instanceof File && audioFile.size > 0 ? audioFile : null;
  if (audio && audio.size > MAX_AUDIO_BYTES) {
    return Response.json(
      {
        error: `"${audio.name}" is larger than 15MB. Please use a smaller file.`,
      },
      { status: 400 },
    );
  }

  const attachments = audio
    ? [
        {
          content: Buffer.from(await audio.arrayBuffer()).toString("base64"),
          filename: audio.name || "campaign-audio",
          type: audio.type || "audio/mpeg",
          disposition: "attachment" as const,
        },
      ]
    : undefined;

  const audienceLine =
    location === "Cities" && cities.length > 0
      ? `Selected cities: ${cities.join(", ")}`
      : "All Pakistan";

  const summaryLines = [
    `Campaign: ${campaignName}`,
    `Objective: ${objective}`,
    `Runs: ${start} to ${end}`,
    `Budget: ${formatPKR(budget)}`,
    "",
    "Audience:",
    audienceLine,
    `Age: ${ageMin} to ${ageMax >= 65 ? "65+" : ageMax}`,
    `Gender: ${gender}`,
    advancedTargeting.length > 0 &&
      `Advanced targeting: ${advancedTargeting.join(", ")}`,
    "",
    "Creative:",
    `Languages: ${languages.join(", ") || "None selected"}`,
    audio ? `Audio: attached (${audio.name})` : "Audio: not uploaded",
    sms && `SMS & WhatsApp text: ${sms}`,
    url && `Destination link: ${url}`,
    "",
    "Advertiser:",
    `Name: ${advertiserName}`,
    `Email: ${advertiserEmail}`,
    advertiserCompany && `Company: ${advertiserCompany}`,
    advertiserPhone && `Phone: ${advertiserPhone}`,
  ].filter((line): line is string => Boolean(line));

  try {
    await sgMail.send({
      to: toEmail,
      from: fromEmail,
      replyTo: advertiserEmail,
      subject: `[Campaign submission] ${campaignName} — ${advertiserName}`,
      text: summaryLines.join("\n"),
      attachments,
    });
  } catch (error) {
    console.error("SendGrid campaign submission send failed", error);
    return Response.json(
      { error: "Could not submit right now. Please try again." },
      { status: 502 },
    );
  }

  // Best-effort confirmation back to the advertiser. Its failure shouldn't
  // fail the request — the team's notification above is what matters.
  try {
    await sgMail.send(
      buildConfirmationEmail({
        fromEmail,
        advertiserName,
        advertiserEmail,
        campaignName,
        budget,
      }),
    );
  } catch (error) {
    console.error("SendGrid campaign confirmation email failed", error);
  }

  return Response.json({ ok: true });
}

function buildConfirmationEmail({
  fromEmail,
  advertiserName,
  advertiserEmail,
  campaignName,
  budget,
}: {
  fromEmail: string;
  advertiserName: string;
  advertiserEmail: string;
  campaignName: string;
  budget: number;
}) {
  const firstName = advertiserName.split(" ")[0];
  const safeFirstName = escapeHtml(firstName);
  const safeCampaignName = escapeHtml(campaignName);

  return {
    to: advertiserEmail,
    from: { email: fromEmail, name: "Music Mandi" },
    subject: "We've got your campaign — Music Mandi",
    text: [
      `Hi ${firstName},`,
      "",
      `Thanks for submitting "${campaignName}" (${formatPKR(budget)} budget). Our team can now review the creative, audience, and delivery settings before launch.`,
      "",
      "We'll be in touch once it's reviewed. If anything changes in the meantime, just reply to this email.",
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
            <h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;color:#fff;">We've got your campaign, ${safeFirstName}.</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#c7cbd4;">
              Thanks for submitting <strong style="color:#fff;">${safeCampaignName}</strong> (${formatPKR(budget)} budget). Our
              team can now review the creative, audience, and delivery settings before launch.
            </p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#c7cbd4;">
              We'll be in touch once it's reviewed.
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
