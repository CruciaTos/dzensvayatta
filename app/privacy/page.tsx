import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Svayatta collects, protects, and processes personal data under India's Digital Personal Data Protection Act.",
};

export default function PrivacyPage() {
  return (
    <>
      {/* DRAFT: must be reviewed against the DPDP Act before publishing */}
      <LegalPage title="Privacy Policy" updated="3 Nov 2026">
        <p>
          Svayatta Intelligence Private Limited (&ldquo;Svayatta&rdquo;, &ldquo;we&rdquo;,
          &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy
          and personal data. This Privacy Policy explains what personal data we collect,
          why we collect it, how it is processed and protected, and your statutory rights
          as a Data Principal under India&rsquo;s Digital Personal Data Protection Act, 2023
          (DPDP Act).
        </p>

        <p>
          For the purposes of applicable data protection legislation, the Data Fiduciary is
          Svayatta Intelligence Private Limited, based in Mumbai, Maharashtra, India.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We only collect personal data directly from you when you interact with our website
          or request our software and services. Specifically, our systems collect data across
          three distinct touchpoints:
        </p>
        <ul>
          <li>
            <strong>Discovery Booking Form:</strong> When you schedule a discovery consultation,
            we collect your company name, industry sector, project description or operational
            workflow context, email address, contact phone number, and selected meeting date and time.
          </li>
          <li>
            <strong>Software Access Requests:</strong> When authorized personnel request access
            to our desktop software builds (such as Growmont CRM), we collect your work email
            address to verify domain authorization and issue time-limited access tokens.
          </li>
          <li>
            <strong>Operational Telemetry &amp; Security Logs:</strong> When you navigate our
            website, we measure anonymous performance vitals (via Vercel Speed Insights) and
            temporarily inspect IP addresses in server memory for up to 10 minutes strictly to
            prevent automated denial-of-service abuse and rate-limit form submissions.
          </li>
        </ul>

        <h2>2. Purpose of Data Processing</h2>
        <p>
          We process personal data strictly in alignment with the purpose for which it was
          provided (purpose limitation):
        </p>
        <ul>
          <li>To schedule, confirm, and host your 30-minute discovery call and send calendar invites (.ics).</li>
          <li>To evaluate your business workflow requirements and formulate a tailored implementation blueprint.</li>
          <li>To deliver secure, temporary download tokens for approved software releases.</li>
          <li>To ensure platform uptime, mitigate abuse, and optimize website speed and accessibility.</li>
        </ul>

        <h2>3. Third-Party Processors &amp; Infrastructure</h2>
        <p>
          We do not sell, rent, or trade your personal data. We engage trusted third-party service
          providers acting solely as Data Processors under strict confidentiality agreements:
        </p>
        <ul>
          <li>
            <strong>Resend (Resend Inc.):</strong> Cloud transactional email infrastructure used to
            deliver meeting confirmations, calendar attachments, and software access verification links.
          </li>
          <li>
            <strong>Vercel (Vercel Inc.):</strong> Cloud application hosting, edge delivery network,
            and privacy-first Speed Insights telemetry.
          </li>
        </ul>

        <h2>4. Data Retention</h2>
        <p>
          We retain personal data only for as long as necessary to fulfill the purposes specified in
          this policy:
        </p>
        <ul>
          <li>
            Discovery consultation inquiries are retained for 180 days after receipt unless an active
            commercial engagement or mutual agreement is established.{/* [confirm retention periods] */}
          </li>
          <li>
            Software download authentication tokens expire automatically within 30 minutes of generation;
            access audit logs are retained for 90 days.{/* [confirm access log retention] */}
          </li>
          <li>
            Transient IP rate-limiting records are stored exclusively in volatile server memory and
            purged automatically within 10 minutes.
          </li>
        </ul>

        <h2>5. Cookies and Tracking</h2>
        <p>
          We do not employ cross-site tracking cookies, behavioral ad pixels, or third-party marketing
          trackers. Any session state used across the website is strictly operational and essential
          for page rendering.{/* [confirm cookie policy] */}
        </p>

        <h2>6. Your Rights Under the DPDP Act 2023</h2>
        <p>
          Under the Digital Personal Data Protection Act, 2023, you hold distinct rights regarding
          your personal data:
        </p>
        <ul>
          <li>
            <strong>Right to Access:</strong> You may request a summary of the personal data we hold
            about you and the processing activities undertaken.
          </li>
          <li>
            <strong>Right to Correction &amp; Erasure:</strong> You may request the correction of inaccurate
            or misleading data, completion of incomplete data, or deletion of data no longer required for its original purpose.
          </li>
          <li>
            <strong>Right of Grievance Redressal:</strong> You have the right to readily accessible grievance
            redressal provided by our Data Fiduciary.
          </li>
          <li>
            <strong>Right to Nominate:</strong> You have the right to nominate an individual to exercise
            your rights in the event of death or incapacity.
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> Where data processing is grounded in consent, you
            may withdraw consent at any time without impacting prior lawful processing.
          </li>
        </ul>

        <h2>7. Grievance Redressal Officer</h2>
        <p>
          To exercise your rights, file a grievance, or ask questions concerning our privacy practices,
          please contact our designated Grievance Redressal Officer:
        </p>
        <p>
          <strong>Soham Boridkar</strong>{/* [confirm grievance officer designation] */}<br />
          Grievance Officer<br />
          Svayatta Intelligence Private Limited<br />
          Mumbai, Maharashtra, India<br />
          Email: <a href="mailto:info@svayatta.in">info@svayatta.in</a>
        </p>

        <h2>8. Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy periodically to reflect technological updates, regulatory changes
          under the DPDP Act, or changes to our operations. The revised policy will always be posted on this page
          with an updated revision date.
        </p>
      </LegalPage>
    </>
  );
}

