import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "Terms and conditions for using the Svayatta website and exploring our software and services.",
};

export default function TermsPage() {
  return (
    <>
      {/* DRAFT: must be reviewed against applicable laws before publishing */}
      <LegalPage title="Terms of Use" updated="3 Nov 2026">
        <p>
          Welcome to the Svayatta website (<a href="https://svayatta.in">svayatta.in</a>).
          These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of this website,
          operated by Svayatta Intelligence Private Limited (&ldquo;Svayatta&rdquo;, &ldquo;we&rdquo;,
          &ldquo;our&rdquo;, or &ldquo;us&rdquo;). By browsing or using this website, you agree to
          be bound by these Terms.
        </p>

        <h2>1. Permitted Use</h2>
        <p>
          This website is provided for informational purposes regarding our software engineering,
          AI integration, and workflow automation services, as well as for scheduling consultations
          and requesting authorized software evaluations. You agree not to:
        </p>
        <ul>
          <li>Use automated scrapers, bots, or extraction scripts to harvest data from our pages without express written permission.</li>
          <li>Transmit malicious code, viruses, or attempts to disrupt or overload our infrastructure.</li>
          <li>Submit falsified contact information or abuse booking and contact endpoints.</li>
          <li>Attempt unauthorized access to private server directories, API routes, or backend systems.</li>
        </ul>

        <h2>2. Intellectual Property Rights</h2>
        <p>
          All content, visual layouts, typography, source code, logos, brand assets, product names
          (including &ldquo;Svayatta&rdquo;, &ldquo;CruSam&rdquo;, and &ldquo;Growmont&rdquo;), and
          case study materials displayed on this site are the exclusive property of Svayatta
          Intelligence Private Limited or our respective licensors. Nothing on this website grants
          any license or right to copy, reproduce, distribute, or create derivative works without
          prior written authorization.
        </p>

        <h2>3. Informational Nature &amp; No Warranty</h2>
        <p>
          The materials, architectural overviews, case studies, and service descriptions on this
          website are provided for general illustrative purposes on an &ldquo;as is&rdquo; and
          &ldquo;as available&rdquo; basis. While we strive to maintain accurate and up-to-date
          information:
        </p>
        <ul>
          <li>Site content does not constitute a formal commercial proposal, contract, or technical warranty.</li>
          <li>Product features, delivery timelines, and performance outcomes for custom projects are defined exclusively in signed Master Services Agreements or Statements of Work.</li>
          <li>We make no warranties, express or implied, regarding continuous website availability or error-free operation.</li>
        </ul>

        <h2>4. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted under applicable law, Svayatta Intelligence Private Limited
          and its directors, officers, and employees shall not be liable for any indirect, incidental,
          consequential, or punitive damages arising from your access to, use of, or inability to access
          this website or any external links provided herein.
        </p>

        <h2>5. Third-Party Links &amp; Services</h2>
        <p>
          Our website may contain links to external platforms, including LinkedIn, Instagram, and
          WhatsApp. We do not endorse or assume responsibility for the content, privacy policies, or
          practices of any third-party websites. Your interactions with third-party platforms are
          governed exclusively by their terms.
        </p>

        <h2>6. Governing Law &amp; Jurisdiction</h2>
        <p>
          These Terms of Use shall be governed by and construed in accordance with the laws of the
          Republic of India. Any disputes arising out of or related to these Terms or your use of
          this website shall be subject to the exclusive jurisdiction of the competent courts in
          Mumbai, Maharashtra, India.{/* [confirm exclusive jurisdiction venue] */}
        </p>

        <h2>7. Modifications to Terms</h2>
        <p>
          We reserve the right to revise these Terms of Use at any time. Changes will be effective
          immediately upon publication on this page with an updated revision date. Your continued
          use of the website after such changes constitutes acceptance of the modified Terms.
        </p>

        <h2>8. Contact Information</h2>
        <p>
          If you have questions regarding these Terms of Use, please reach out to us at:
        </p>
        <p>
          Svayatta Intelligence Private Limited<br />
          Mumbai, Maharashtra, India<br />
          Email: <a href="mailto:info@svayatta.in">info@svayatta.in</a>
        </p>
      </LegalPage>
    </>
  );
}

