import sgMail from "@sendgrid/mail";

// Shared by the interim SendGrid-backed API routes under src/app/api/integrations/
// (contact, artist-submit, campaign-submit) — see docs/DECISIONS.md DEC-017.
export function getSendGridConfig(toEnvVar: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const toEmail = process.env[toEnvVar];
  if (!apiKey || !fromEmail || !toEmail) return null;
  sgMail.setApiKey(apiKey);
  return { fromEmail, toEmail };
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export { sgMail };
