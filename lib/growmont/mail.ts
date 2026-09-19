import { Resend } from "resend";
import { TOKEN_TTL_MS } from "./access";

/**
 * Deliberately lazy. `new Resend()` throws when RESEND_API_KEY is absent, and
 * `next build` imports every API route module while collecting page data — so
 * constructing the client at module scope would fail the whole build on a
 * machine without secrets. Building it on first send keeps this module's
 * import side-effect free.
 */
let client: Resend | null = null;

function resend(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "info@svayatta.in";
const FROM_NAME = process.env.RESEND_FROM_NAME || "Svayatta";

const MINUTES = Math.round(TOKEN_TTL_MS / 60000);

function body(downloadUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <p>Hi,</p>
      <p>Here is your download link for the <strong>Growmont</strong> setup file:</p>
      <p>
        <a href="${downloadUrl}"
           style="display:inline-block;padding:12px 22px;border-radius:999px;
                  background:#0B1A24;color:#FBF8F1;text-decoration:none;
                  font-weight:600;">
          Download Growmont setup
        </a>
      </p>
      <p style="color:#555;font-size:14px;">
        This link expires in ${MINUTES} minutes and was issued for your address only.
        If you did not request it, you can ignore this email.
      </p>
      <p>— ${FROM_NAME}</p>
    </div>
  `.trim();
}

export async function sendDownloadLink(to: string, downloadUrl: string) {
  const { error } = await resend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [to],
    subject: "Your Growmont setup download link",
    html: body(downloadUrl),
  });

  if (error) throw error;
}
