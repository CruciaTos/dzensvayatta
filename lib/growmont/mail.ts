import QRCode from "qrcode";
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

/* Brand palette, mirrored from the site's dark UI. */
const INK = "#0B1A24";
const CREAM = "#FBF8F1";
const PAGE_BG = "#EEF2F4";
const CARD_BG = "#FFFFFF";
const HAIRLINE = "#DFE6EA";
const MUTED = "#5B6B75";
const ACCENT = "#7EC3E2";
const NOTE_BG = "#F4F9FC";

export interface DownloadTarget {
  url: string;
  /** Bytes. 0 or absent when unknown, e.g. behind a pinned release URL. */
  size?: number;
}

export interface DownloadLinks {
  windows: DownloadTarget;
  android: DownloadTarget;
  /** Release tag, e.g. "v1.0.0". Absent when unknown. */
  version?: string;
}

/** Ampersands in an href must be entities; sanitisers are not reliable about bare ones. */
function attr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * Tags are named however the release happened to be cut — the live repo uses
 * "Version_1.0.0" — so the number is pulled out and formatted rather than
 * printed raw. Anything without one (a pinned release reports "pinned")
 * renders nothing instead of leaking a label into the copy.
 */
function formatVersion(tag?: string): string {
  const match = tag?.match(/\d+(?:\.\d+)+/);
  return match ? ` v${match[0]}` : "";
}

function formatSize(bytes?: number): string {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  // One decimal only when it says something: "9.4 MB", but "9 MB" not "9.0 MB".
  const value = mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10;
  return `${value} MB`;
}

/**
 * Bulletproof button. Outlook's Word renderer ignores padding and
 * border-radius on an anchor, so it gets a VML pill and every other client
 * gets the real one.
 */
function button(href: string, label: string): string {
  const safe = attr(href);

  return `
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
             href="${safe}" style="height:48px;v-text-anchor:middle;width:232px;"
             arcsize="50%" stroke="f" fillcolor="${INK}">
  <w:anchorlock/>
  <center style="color:${CREAM};font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${label}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a class="btn-a" href="${safe}"
   style="display:block;width:232px;max-width:100%;margin:0 auto;padding:15px 0;border-radius:999px;
          background:${INK};color:${CREAM};text-decoration:none;
          font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;
          text-align:center;">${label}</a>
<!--<![endif]-->`;
}

/**
 * The Android download is a QR code rather than a button: the email is
 * usually read on a PC, and the APK belongs on the phone. It points at the
 * hand-off page, not at the APK.
 *
 * Sent as an inline CID attachment, not a data: URI (Gmail strips those) and
 * not a hosted image (Outlook blocks remote images until the reader opts in).
 */
const ANDROID_QR_CID = "growmont-android-qr";
const QR_SIZE = 168;

function qrImage(cid: string, alt: string): string {
  return `
<img src="cid:${cid}" width="${QR_SIZE}" height="${QR_SIZE}" alt="${alt}"
     style="display:block;margin:0 auto;width:${QR_SIZE}px;height:${QR_SIZE}px;
            border:0;outline:none;text-decoration:none;" />`;
}

function caption(label: string): string {
  return `
<div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};
            text-align:center;padding-top:8px;">${label}</div>`;
}

function body(links: DownloadLinks): string {
  const version = formatVersion(links.version);
  const winSize = formatSize(links.windows.size);
  const droidSize = formatSize(links.android.size);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light only" />
  <title>Growmont CRM download</title>
  <!--[if mso]>
  <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  <![endif]-->
  <style>
    /* Buttons sit side by side on a desktop client and stack on a phone. */
    @media only screen and (max-width: 520px) {
      .btn-cell { display:block !important; width:100% !important; padding:0 0 14px 0 !important; }
      .btn-a { width:100% !important; }
      .pad { padding-left:24px !important; padding-right:24px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};">
  <!-- Inbox preview line; hidden in the body itself. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your Growmont CRM downloads for Windows and Android. Links expire in ${MINUTES} minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <!--[if mso]>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td>
        <![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="width:100%;max-width:600px;background:${CARD_BG};
                      border:1px solid ${HAIRLINE};border-radius:14px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td class="pad" style="background:${INK};padding:24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="font-family:Arial,Helvetica,sans-serif;
                             font-size:15px;font-weight:bold;letter-spacing:3px;color:${CREAM};">
                    ${FROM_NAME.toUpperCase()}
                  </td>
                  <td align="right" valign="middle" style="font-family:Arial,Helvetica,sans-serif;
                             font-size:11px;letter-spacing:1.5px;color:${ACCENT};">
                    GROWMONT CRM
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td class="pad" style="padding:38px 40px 0 40px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:24px;
                          font-weight:bold;color:${INK};line-height:1.3;">
                Your download is ready
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;
                          color:${MUTED};line-height:1.65;padding-top:12px;">
                Growmont CRM${version} is available for Windows and Android.
                Take whichever you need — the same account works on both.
              </div>
            </td>
          </tr>

          <!-- Downloads -->
          <tr>
            <td class="pad" style="padding:30px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="btn-cell" width="50%" align="center" valign="middle" style="padding-right:8px;">
                    ${button(links.windows.url, "Download for Windows")}
                    ${caption(winSize ? `Windows &middot; ${winSize}` : "Windows installer")}
                  </td>
                  <td class="btn-cell" width="50%" align="center" valign="middle" style="padding-left:8px;">
                    ${qrImage(ANDROID_QR_CID, "QR code: download Growmont CRM for Android")}
                    ${caption(droidSize ? `Scan with your Android phone &middot; ${droidSize}` : "Scan with your Android phone")}                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Android install note -->
          <tr>
            <td class="pad" style="padding:30px 40px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:${NOTE_BG};border-left:3px solid ${ACCENT};border-radius:6px;">
                <tr>
                  <td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;
                             font-size:14px;color:${INK};line-height:1.65;">
                    <strong>Installing on Android?</strong><br />
                    Android will warn you twice during install — this is expected for apps
                    distributed outside the Play Store. Tap through both.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Expiry -->
          <tr>
            <td class="pad" style="padding:26px 40px 34px 40px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;
                          color:${MUTED};line-height:1.7;">
                These links expire in <strong style="color:${INK};">${MINUTES} minutes</strong>
                and were issued for your address only. If you did not request them,
                you can safely ignore this email.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid ${HAIRLINE};padding:20px 40px;
                       font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};">
              Sent by ${FROM_NAME}
            </td>
          </tr>

        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text alternative: better deliverability, and some clients prefer it. */
function text(links: DownloadLinks): string {
  const version = formatVersion(links.version);

  return [
    `Growmont CRM${version} — your download links`,
    "",
    `Windows: ${links.windows.url}`,
    `Android: ${links.android.url}`,
    "",
    "Installing on Android? Android will warn you twice during install — this is",
    "expected for apps distributed outside the Play Store. Tap through both.",
    "",
    `These links expire in ${MINUTES} minutes and were issued for your address only.`,
    "If you did not request them, you can safely ignore this email.",
    "",
    `— ${FROM_NAME}`,
  ].join("\n");
}

export async function sendDownloadLink(to: string, links: DownloadLinks) {
  // Rendered at 2x the displayed size so it stays sharp on high-DPI screens.
  // The link carries a signed token, so M-level correction keeps the code
  // from getting too dense to scan off a monitor.
  const androidQr = await QRCode.toBuffer(links.android.url, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: QR_SIZE * 2,
    color: { dark: INK, light: "#FFFFFF" },
  });

  const { error } = await resend().emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [to],
    subject: "Your Growmont CRM download — Windows & Android",
    html: body(links),
    text: text(links),
    attachments: [
      {
        filename: "growmont-android-qr.png",
        // Base64, not the Buffer: the SDK passes content through untouched, and
        // a Buffer would be JSON-encoded as a byte array.
        content: androidQr.toString("base64"),
        contentType: "image/png",
        contentId: ANDROID_QR_CID,
      },
    ],
  });

  if (error) throw error;
}
