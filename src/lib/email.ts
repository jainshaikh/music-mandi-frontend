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

// SendGrid's ResponseError keeps the reason (e.g. "The from address does not
// match a verified Sender Identity") in `response.body.errors`, which
// console.error prints as `[Array]` — so the logs never said why a send failed.
export function describeSendGridError(error: unknown) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const { code, response } = error as {
      code?: number;
      response?: { body?: unknown };
    };
    return `status ${code ?? "unknown"}: ${JSON.stringify(response?.body)}`;
  }
  return error;
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
