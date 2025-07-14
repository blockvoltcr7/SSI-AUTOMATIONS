import { Metadata } from "next";
import { Background } from "@/components/background";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export const metadata: Metadata = {
  title: "Privacy Policy - SSI Automations",
  description: "Learn how SSI Automations collects, uses, and protects your personal information. Our commitment to your privacy and data security.",
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
                  We collect information you provide directly to us, such as when you create an account, use our services, make a purchase, request customer support, or communicate with us. The types of information we may collect include:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Name, email address, phone number, and company name</li>
                  <li>Billing and payment information</li>
                  <li>Service preferences and settings</li>
                  <li>Communications between you and SSI Automations</li>
                  <li>Any other information you choose to provide</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">2. How We Use Your Information</h2>
                <p className="mb-4">We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Communicate with you about products, services, offers, and events</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">3. Information Sharing and Disclosure</h2>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                  <li>In response to a request for information if we believe disclosure is required by law</li>
                  <li>If we believe your actions are inconsistent with our user agreements or policies</li>
                  <li>To protect the rights, property, and safety of SSI Automations or others</li>
                  <li>With your consent or at your direction</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">4. Data Security</h2>
                <p className="mb-6">
                  We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or electronic storage system is 100% secure.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">5. Your Choices</h2>
                <p className="mb-4">You may:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Update or correct your account information at any time</li>
                  <li>Opt out of receiving promotional communications by following the instructions in those messages</li>
                  <li>Request deletion of your personal information, subject to certain exceptions</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">6. Cookies and Similar Technologies</h2>
                <p className="mb-6">
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">7. Children's Privacy</h2>
                <p className="mb-6">
                  Our services are not directed to individuals under 18. We do not knowingly collect personal information from children under 18.
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
                  <li>Email: privacy@ssiautomations.com</li>
                  <li>Phone: Available on our contact page</li>
                  <li>Address: Contact us for our mailing address</li>
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