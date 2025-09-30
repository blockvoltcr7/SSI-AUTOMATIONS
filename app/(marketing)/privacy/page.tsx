import { Metadata } from "next";
import { Background } from "@/components/background";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export const metadata: Metadata = {
  title: "Privacy Policy - SSI Automations",
  description: "Learn how SSI Automations handles visitor data for our AI learning hub. Our commitment to your privacy.",
};

export default function PrivacyPage() {
  const words = [
    { text: "Privacy" },
    { text: "Policy" },
  ];

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
                <h2 className="text-2xl font-bold mb-6">1. Information We Collect</h2>
                <p className="mb-4">
                  SSI Automations operates as an informational website that curates links to AI learning resources. We collect minimal information:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Basic analytics data (page views, referral sources, general location)</li>
                  <li>Technical information (browser type, device type, IP address)</li>
                  <li>Cookie data for website functionality</li>
                </ul>
                <p className="mb-6">
                  We do not collect personal information such as names, email addresses, or phone numbers as we do not offer accounts, services, or purchases on this site.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">2. How We Use Your Information</h2>
                <p className="mb-4">We use the limited information we collect to:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Understand how visitors use our website</li>
                  <li>Improve the website experience and content</li>
                  <li>Monitor and analyze website traffic and trends</li>
                  <li>Maintain website security and prevent abuse</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">3. Third-Party Links</h2>
                <p className="mb-6">
                  Our website contains links to third-party educational platforms and resources. We are not responsible for the privacy practices of these external sites. When you click on a link to a third-party site, you will be subject to that site's privacy policy. We encourage you to review the privacy policies of any site you visit.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">4. Information Sharing</h2>
                <p className="mb-6">
                  We do not sell, trade, or rent visitor information to third parties. We do not share any personal information because we do not collect it. Anonymous analytics data may be shared with service providers who help us operate our website.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">5. Cookies and Similar Technologies</h2>
                <p className="mb-6">
                  We use cookies and similar tracking technologies to track activity on our website. These are used for analytics and to improve user experience. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">6. Data Security</h2>
                <p className="mb-6">
                  We implement reasonable security measures to protect the limited data we collect. However, no method of transmission over the internet is 100% secure.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">7. Children's Privacy</h2>
                <p className="mb-6">
                  Our website is not directed to individuals under 13, and we do not knowingly collect information from children.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">8. Changes to This Privacy Policy</h2>
                <p className="mb-6">
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">9. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please contact us at:
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