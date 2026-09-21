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
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://svayatta.in";
const SITE = BASE_URL.replace(/^https?:\/\//, "");

const MINUTES = Math.round(TOKEN_TTL_MS / 60000);

/**
 * Blueprint palette, taken from the site's own gradient artwork. The whole
 * card sits on the texture, so everything here is either white, a pale blue
 * for secondary copy, or the deep navy that white sits on.
 */
const NAVY = "#0A2A5E"; // button label, QR modules
const PANEL = "#0B3F92"; // solid stand-in for the texture
const PANEL_EDGE = "#072A60";
const RULE = "#3B6CB0";
const ON_PANEL = "#FFFFFF";
const ON_PANEL_MUTED = "#B9CEF0";
const PAGE_BG = "#E9EEF7";

/**
 * The blueprint texture behind the whole card. Hosted rather than attached:
 * it is decoration, and a client that blocks remote images gets the solid
 * ${PANEL} underneath, which keeps every word white-on-blue and perfectly
 * legible. All copy stays live HTML — never baked into the artwork — so the
 * version number is real and the text survives image blocking and screen
 * readers.
 *
 * Outlook's Word renderer ignores CSS background images, so it gets the solid
 * colour too. That is the intended fallback, not a defect.
 */
const PANEL_IMAGE = `${BASE_URL}/growmont/email-bg.jpg`;

/* The card's inner width: 600px shell less the 40px gutters either side. */
const CONTENT_WIDTH = 520;

export interface DownloadLinks {
  windows: string;
  android: string;
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

/**
 * Bulletproof button, full content width. White on the blue panel: on a
 * coloured ground the inverted pill is the only thing that reads as the one
 * action. Outlook's Word renderer ignores padding and border-radius on an
 * anchor, so it gets a VML pill at a fixed width and every other client gets
 * a fluid one.
 */
function button(href: string, label: string): string {
  const safe = attr(href);

  return `
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
             href="${safe}" style="height:50px;v-text-anchor:middle;width:${CONTENT_WIDTH}px;"
             arcsize="50%" stroke="f" fillcolor="#FFFFFF">
  <w:anchorlock/>
  <center style="color:${NAVY};font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${label}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href="${safe}"
   style="display:block;width:100%;padding:16px 0;border-radius:999px;
          background:#FFFFFF;color:${NAVY};text-decoration:none;
          font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;
          text-align:center;">${label}</a>
<!--<![endif]-->`;
}

/**
 * The Android download is a QR code rather than a button: the email is
 * usually read on a PC, and the APK belongs on the phone. It points at the
 * hand-off page, not at the APK.
 *
 * Sent as an inline CID attachment, not a data: URI (Gmail strips those) and
 * not a hosted image (Outlook blocks remote images until the reader opts in) —
 * unlike the panel artwork, this one is load-bearing and has to render. The
 * white border is a quiet plate: a scanner wants a light margin around the
 * code, and it would not get one from the blue behind it.
 *
 * Android and Desktop are each labelled and separated by a rule, so the two
 * paths read as a short list rather than as two things competing for the same
 * glance — which is what the old side-by-side columns did.
 */
const ANDROID_QR_CID = "growmont-android-qr";
const QR_SIZE = 260;

function body(links: DownloadLinks): string {
  const version = formatVersion(links.version);

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
    @media only screen and (max-width: 520px) {
      .pad { padding-left:26px !important; padding-right:26px !important; }
      .h1 { font-size:23px !important; }
      /* At this size the code no longer fits beside its label on a phone,
         so the pair stacks and the code steps down to the narrowest gutter. */
      .qr-cell, .qr-text { display:block !important; width:100% !important; }
      .qr-text { padding-right:0 !important; padding-bottom:18px !important; }
      .qr-cell { text-align:center !important; }
      .qr { width:220px !important; height:220px !important; margin:0 auto !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};">
  <!-- Inbox preview line; hidden in the body itself. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Growmont CRM${version} for Windows and Android. Links expire in ${MINUTES} minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:40px 12px;">

        <!--[if mso]>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td>
        <![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="width:100%;max-width:600px;border-radius:16px;overflow:hidden;
                      border:1px solid ${PANEL_EDGE};">
          <tr>
            <td bgcolor="${PANEL}"
                style="background-color:${PANEL};
                       background-image:url('${PANEL_IMAGE}');
                       background-size:cover;background-position:center center;
                       background-repeat:no-repeat;">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Masthead. One mark; Growmont is the subject, not a second brand. -->
                <tr>
                  <td class="pad" style="padding:36px 40px 0 40px;
                             font-family:Arial,Helvetica,sans-serif;font-size:12px;
                             font-weight:bold;letter-spacing:3px;color:${ON_PANEL_MUTED};">
                    ${FROM_NAME.toUpperCase()}
                  </td>
                </tr>

                <!-- Headline -->
                <tr>
                  <td class="pad" style="padding:22px 40px 0 40px;">
                    <div class="h1"
                         style="font-family:Arial,Helvetica,sans-serif;font-size:28px;
                                font-weight:bold;color:${ON_PANEL};line-height:1.25;">
                      Your download is ready
                    </div>
                    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;
                                color:${ON_PANEL_MUTED};line-height:1.6;padding-top:10px;">
                      Growmont CRM${version}
                    </div>
                  </td>
                </tr>

                <!-- Android -->
                <tr>
                  <td class="pad" style="padding:34px 40px 0 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                           border="0" style="width:100%;">
                      <tr>
                        <td class="qr-text" valign="top" style="padding:4px 28px 0 0;">
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;
                                      font-weight:bold;color:${ON_PANEL};line-height:1.4;">
                            On Android
                          </div>
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;
                                      color:${ON_PANEL_MUTED};line-height:1.65;padding-top:12px;">
                            Scan with your phone&rsquo;s camera.
                          </div>
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;
                                      color:${ON_PANEL_MUTED};line-height:1.65;padding-top:16px;">
                            Android will ask you to allow installs from this
                            source &mdash; normal for an app outside the Play Store.
                          </div>
                          <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;
                                      color:${ON_PANEL_MUTED};line-height:1.65;padding-top:16px;">
                            It&rsquo;s a large download, so Wi&#8209;Fi helps.
                          </div>
                        </td>
                        <td class="qr-cell" width="${QR_SIZE + 24}" align="right" valign="middle"
                            style="width:${QR_SIZE + 24}px;">
                          <img class="qr" src="cid:${ANDROID_QR_CID}"
                               width="${QR_SIZE}" height="${QR_SIZE}"
                               alt="QR code: download Growmont CRM for Android"
                               style="display:block;width:${QR_SIZE}px;height:${QR_SIZE}px;
                                      border:12px solid #FFFFFF;border-radius:16px;
                                      background:#FFFFFF;outline:none;text-decoration:none;" />
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Desktop -->
                <tr>
                  <td class="pad" style="padding:32px 40px 0 40px;">
                    <div style="border-top:1px solid ${RULE};font-size:0;line-height:0;">&nbsp;</div>
                  </td>
                </tr>
                <tr>
                  <td class="pad" style="padding:28px 40px 0 40px;
                             font-family:Arial,Helvetica,sans-serif;font-size:15px;
                             font-weight:bold;color:${ON_PANEL};line-height:1.4;">
                    On Desktop
                  </td>
                </tr>
                <tr>
                  <td class="pad" style="padding:18px 40px 0 40px;">
                    ${button(links.windows, "Download for Windows")}
                  </td>
                </tr>

                <!-- Expiry -->
                <tr>
                  <td class="pad" style="padding:32px 40px 0 40px;
                             font-family:Arial,Helvetica,sans-serif;font-size:13px;
                             color:${ON_PANEL_MUTED};line-height:1.6;">
                    Both links expire in <span style="color:${ON_PANEL};font-weight:bold;">${MINUTES} minutes</span>.
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td class="pad" style="padding:30px 40px 0 40px;">
                    <div style="border-top:1px solid ${RULE};font-size:0;line-height:0;">&nbsp;</div>
                  </td>
                </tr>
                <tr>
                  <td class="pad" style="padding:20px 40px 34px 40px;
                             font-family:Arial,Helvetica,sans-serif;font-size:12px;
                             color:${ON_PANEL_MUTED};line-height:1.7;">
                    Sent by ${FROM_NAME} &middot; ${SITE}<br />
                    Didn&rsquo;t request this? You can safely ignore this email.
                  </td>
                </tr>

              </table>
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
    `Windows: ${links.windows}`,
    `Android: ${links.android}`,
    "",
    `Both links expire in ${MINUTES} minutes. Didn't request this? You can safely ignore this email.`,
    "",
    `— ${FROM_NAME} · ${SITE}`,
  ].join("\n");
}

export async function sendDownloadLink(to: string, links: DownloadLinks) {
  // Rendered at 3x the displayed size so it stays sharp on high-DPI screens
  // now that it is drawn smaller. The link carries a signed token, which makes
  // for a dense code; L-level correction keeps the modules as large as
  // possible, and a code on a screen doesn't get the smudges or tears the
  // higher levels exist for.
  const androidQr = await QRCode.toBuffer(links.android, {
    errorCorrectionLevel: "L",
    margin: 0,
    width: QR_SIZE * 3,
    color: { dark: NAVY, light: "#FFFFFF" },
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
