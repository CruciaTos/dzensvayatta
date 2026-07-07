/**
 * One-time setup helper for Google OAuth refresh token.
 *
 * Usage:
 *   1. Fill GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
 *   2. node scripts/get-google-refresh-token.mjs
 *   3. Open the printed URL, approve access, paste the auth code
 *   4. Copy the refresh token into GOOGLE_REFRESH_TOKEN
 */

import { createServer } from "node:http";
import { URL } from "node:url";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar.events",
].join(" ");

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return {};
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [key, ...rest] = line.split("=");
    env[key.trim()] = rest.join("=").trim();
  }
  return env;
}

const env = { ...loadEnvLocal(), ...process.env };
const clientId = env.GOOGLE_CLIENT_ID;
const clientSecret = env.GOOGLE_CLIENT_SECRET;
const redirectUri = "http://localhost:3000/oauth2callback";
const port = 3000;

if (!clientId || !clientSecret) {
  console.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local");
  process.exit(1);
}

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("redirect_uri", redirectUri);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPES);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl.toString());
console.log("\nWaiting for Google to redirect back to localhost...\n");

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);
    if (url.pathname !== "/oauth2callback") {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const code = url.searchParams.get("code");
    if (!code) {
      res.writeHead(400);
      res.end("Missing auth code.");
      return;
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      res.writeHead(500);
      res.end(`Token exchange failed: ${JSON.stringify(tokenData)}`);
      console.error(tokenData);
      server.close();
      return;
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Success. You can close this tab and return to the terminal.");

    console.log("\nAdd this to .env.local:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokenData.refresh_token}`);
    console.log("\nAccess token (temporary):", tokenData.access_token);
    server.close();
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end("Setup failed.");
    server.close();
  }
});

server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/oauth2callback`);
});
