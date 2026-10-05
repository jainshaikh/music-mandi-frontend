// Shared by the interim SendGrid forms (artist submit, campaign submit) and
// their API routes — see docs/DECISIONS.md DEC-017.

// Vercel rejects serverless request bodies over ~4.5MB with a 413 before the
// route even runs, so that — not SendGrid's ~30MB message limit — is the real
// ceiling for attachments. 4MB leaves room for the other form fields.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOAD_LABEL = "4MB";

export const SUBMIT_FALLBACK_ERROR =
  "Something went wrong and your submission wasn't sent. Please try again in a moment.";

export function totalFileBytes(files: ArrayLike<File> | Iterable<File>) {
  return Array.from(files).reduce((sum, file) => sum + file.size, 0);
}

// Turns a failed submission response into a message for the person filling
// in the form. A 413 comes from the hosting platform with a non-JSON body.
export async function submissionErrorMessage(res: Response) {
  if (res.status === 413) {
    return `Your file is too large to upload. Keep uploads under ${MAX_UPLOAD_LABEL} — an MP3 is usually much smaller than a WAV.`;
  }
  const data = await res.json().catch(() => null);
  return typeof data?.error === "string" && data.error
    ? data.error
    : SUBMIT_FALLBACK_ERROR;
}
