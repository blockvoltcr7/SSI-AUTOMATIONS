import { Metadata } from "next";
import { Background } from "@/components/background";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export const metadata: Metadata = {
  title: "Terms & Conditions - SSI Automations",
  description:
    "Read the terms and conditions for using the SSI Automations AI learning hub website.",
};

export default function TermsPage() {
  const words = [{ text: "Terms" }, { text: "&" }, { text: "Conditions" }];

  return (
    <div className="relative overflow-hidden py-16 md:py-0 px-4 md:px-0 bg-gray-50 dark:bg-black">
      <div className="w-full min-h-screen relative overflow-hidden">
        <Background />

        <div className="max-w-4xl mx-auto pb-20">
          {/* Header Section */}
          <div className="text-center py-12 md:py-20 relative z-10">
            <TypewriterEffect words={words} className="mb-6" />
            <p className="text-center mt-4 text-base md:text-xl text-muted dark:text-muted-dark max-w-2xl mx-auto">
              <TextGenerateEffect words="Last updated: January 2025" />
            </p>
          </div>

          {/* Content */}
          <div className="relative z-20 px-4 md:px-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 p-8 md:p-12">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-6">
                  1. Acceptance of Terms
                </h2>
                <p className="mb-6">
                  By accessing and using the SSI Automations website, you accept
                  and agree to be bound by these Terms and Conditions. These
                  terms govern your use of our informational website and
                  constitute a legally binding agreement between you and SSI
                  Automations.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  2. Description of Service
                </h2>
                <p className="mb-6">
                  SSI Automations operates as an informational website that
                  curates and provides links to third-party AI learning
                  resources, educational platforms, academies, and communities.
                  We do not provide educational services directly, nor do we
                  sell products or services through this website.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  3. No User Accounts
                </h2>
                <p className="mb-6">
                  This website does not require user registration or accounts.
                  You may browse our curated links freely without providing
                  personal information.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  4. Third-Party Links and Resources
                </h2>
                <p className="mb-4">
                  Our website contains links to third-party websites and
                  resources. You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    We are not responsible for the availability, content, or
                    accuracy of third-party websites
                  </li>
                  <li>
                    We do not endorse or guarantee the quality of third-party
                    services
                  </li>
                  <li>
                    Your use of third-party websites is at your own risk and
                    subject to their terms and conditions
                  </li>
                  <li>
                    Any transactions or interactions with third-party sites are
                    solely between you and the third party
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  5. Acceptable Use
                </h2>
                <p className="mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    Use the website in any way that violates applicable laws or
                    regulations
                  </li>
                  <li>
                    Attempt to interfere with or disrupt the website's
                    functionality
                  </li>
                  <li>
                    Use automated systems to access or scrape the website
                    without permission
                  </li>
                  <li>Misrepresent your affiliation with SSI Automations</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  6. Intellectual Property
                </h2>
                <p className="mb-6">
                  The website design, content, and compilation of curated links
                  are the property of SSI Automations and are protected by
                  copyright and other intellectual property laws. You may not
                  reproduce, distribute, or create derivative works without our
                  express permission.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  7. Disclaimer of Warranties
                </h2>
                <p className="mb-6">
                  This website and its content are provided "as is" without
                  warranties of any kind. We do not guarantee the accuracy,
                  completeness, or timeliness of the information or links
                  provided. We make no warranties regarding third-party websites
                  or services.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  8. Limitation of Liability
                </h2>
                <p className="mb-6">
                  To the fullest extent permitted by law, SSI Automations shall
                  not be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising from your use of
                  the website or third-party resources. This includes any
                  damages resulting from your reliance on information or links
                  provided.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  9. Changes to Website
                </h2>
                <p className="mb-6">
                  We reserve the right to modify, update, or discontinue any
                  aspect of the website at any time without notice. We may add,
                  remove, or modify curated links and resources at our
                  discretion.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  10. Governing Law
                </h2>
                <p className="mb-6">
                  These Terms shall be governed by and construed in accordance
                  with applicable laws, without regard to conflict of law
                  provisions.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  11. Changes to Terms
                </h2>
                <p className="mb-6">
                  We reserve the right to modify these Terms at any time.
                  Changes will be effective immediately upon posting to the
                  website. Your continued use of the website constitutes
                  acceptance of any changes.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  12. Contact Information
                </h2>
                <p className="mb-4">
                  If you have any questions about these Terms & Conditions,
                  please contact us:
                </p>
                <ul className="list-none mb-6">
                  <li>Email: sami@ssiautomations.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <HorizontalGradient className="top-20" />
        <HorizontalGradient className="bottom-20" />
      </div>
    </div>
  );
}
