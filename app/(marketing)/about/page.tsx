import { Metadata } from "next";
import { Background } from "@/components/background";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export const metadata: Metadata = {
  title: "About Us - SSI Automations",
  description: "Learn about SSI Automations, our mission to empower small businesses with AI-driven automation solutions, and our commitment to innovation.",
};

export default function AboutPage() {
  const words = [
    { text: "About" },
    { text: "SSI" },
    { text: "Automations" },
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
              <TextGenerateEffect words="Empowering small businesses with AI-driven automation solutions" />
            </p>
          </div>
          
          {/* Content */}
          <div className="relative z-20 px-4 md:px-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 p-8 md:p-12">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
                <p className="mb-6 text-lg">
                  At SSI Automations, we believe that every small business deserves access to cutting-edge technology that can streamline operations, enhance customer experiences, and drive growth. Our mission is to democratize AI-powered automation, making it accessible and affordable for businesses of all sizes.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">What We Do</h2>
                <p className="mb-4">
                  We specialize in creating intelligent automation solutions that transform how businesses operate:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li><strong>Voice AI Agents:</strong> Sophisticated conversational AI that handles customer inquiries, support requests, and sales interactions 24/7</li>
                  <li><strong>Workflow Automation:</strong> Streamline repetitive tasks and business processes to save time and reduce errors</li>
                  <li><strong>Appointment Setting:</strong> Automated scheduling systems that integrate seamlessly with your existing calendar and CRM</li>
                  <li><strong>Custom AI Solutions:</strong> Tailored automation tools designed specifically for your business needs and industry</li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">Our Approach</h2>
                <p className="mb-6">
                  We understand that implementing new technology can be overwhelming. That's why we take a personalized approach to every project, working closely with you to understand your unique challenges and goals. Our team provides comprehensive support from initial consultation through implementation and ongoing optimization.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">Why Choose SSI Automations?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Small Business Focus</h3>
                    <p className="text-sm">We understand the unique challenges and constraints that small businesses face, and we design our solutions accordingly.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Affordable Solutions</h3>
                    <p className="text-sm">Our pricing models are designed to provide maximum value and ROI for businesses of all sizes.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Expert Support</h3>
                    <p className="text-sm">Our team of AI specialists and automation experts are here to guide you every step of the way.</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Proven Results</h3>
                    <p className="text-sm">We've helped numerous businesses increase efficiency, reduce costs, and improve customer satisfaction.</p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 mt-8">Our Vision</h2>
                <p className="mb-6">
                  We envision a future where small businesses have the same technological advantages as large corporations. By making AI automation accessible and easy to implement, we're helping level the playing field and enabling entrepreneurs to focus on what they do best—growing their businesses and serving their customers.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">Ready to Get Started?</h2>
                <p className="mb-4">
                  Whether you're looking to automate your customer service, streamline your operations, or explore new ways to grow your business, we're here to help. Let's discuss how AI automation can transform your business.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <p className="font-medium mb-2">Contact us today for a free consultation</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Schedule a strategy call or send us a message through our contact page to learn more about how we can help your business thrive.
                  </p>
                </div>
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