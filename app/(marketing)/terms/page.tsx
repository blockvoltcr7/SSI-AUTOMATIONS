import { Metadata } from "next";
import { Background } from "@/components/background";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export const metadata: Metadata = {
  title: "Terms & Conditions - SSI Automations",
  description: "Read the terms and conditions for using SSI Automations services. Understanding your rights and responsibilities.",
};

export default function TermsPage() {
  const words = [
    { text: "Terms" },
    { text: "&" },
    { text: "Conditions" },
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
                <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
                <p className="mb-6">
                  By accessing and using SSI Automations services, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of our services and constitute a legally binding agreement between you and SSI Automations.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">2. Description of Service</h2>
                <p className="mb-4">
                  SSI Automations provides AI-powered automation solutions for businesses, including but not limited to:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Voice AI agents for customer service and support</li>
                  <li>Workflow automation tools and systems</li>
                  <li>Appointment setting and scheduling services</li>
                  <li>Custom AI solutions for business processes</li>
                  <li>Consulting and implementation services</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">3. User Accounts and Registration</h2>
                <p className="mb-4">
                  To access certain features of our services, you may be required to create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">4. Acceptable Use Policy</h2>
                <p className="mb-4">You agree not to use our services to:</p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Violate any local, state, national, or international law or regulation</li>
                  <li>Transmit any harassing, libelous, abusive, threatening, or harmful material</li>
                  <li>Transmit any material that infringes upon the rights of another</li>
                  <li>Transmit any material that contains viruses, trojan horses, or other harmful components</li>
                  <li>Engage in any activity that could damage or impair our services</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">5. Payment Terms</h2>
                <p className="mb-4">
                  For paid services:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Fees are billed in advance on a monthly or annual basis depending on your plan</li>
                  <li>All fees are non-refundable except as required by law</li>
                  <li>We reserve the right to change our pricing with 30 days notice</li>
                  <li>Late payments may result in service suspension</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">6. Intellectual Property</h2>
                <p className="mb-6">
                  The service and its original content, features, and functionality are and will remain the exclusive property of SSI Automations and its licensors. The service is protected by copyright, trademark, and other laws.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">7. Service Availability</h2>
                <p className="mb-6">
                  We strive to maintain high availability but do not guarantee uninterrupted access to our services. We may temporarily suspend service for maintenance, updates, or other operational reasons.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">8. Limitation of Liability</h2>
                <p className="mb-6">
                  In no event shall SSI Automations, nor its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">9. Termination</h2>
                <p className="mb-4">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including but not limited to:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>Breach of the Terms</li>
                  <li>Non-payment of fees</li>
                  <li>Violation of our Acceptable Use Policy</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">10. Governing Law</h2>
                <p className="mb-6">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which SSI Automations operates, without regard to conflict of law provisions.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">11. Changes to Terms</h2>
                <p className="mb-6">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">12. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions about these Terms & Conditions, please contact us:
                </p>
                <ul className="list-none mb-6">
                  <li>Email: legal@ssiautomations.com</li>
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