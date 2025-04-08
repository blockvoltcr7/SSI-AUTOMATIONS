import { Background } from "@/components/background";
import { Metadata } from "next";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { ContactForm } from "@/components/contact";
import { CalendarEmbed } from "@/components/calendar-embed";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export const metadata: Metadata = {
  title:
    "Contact SSI Automations - Empowering Small Businesses with AI Solutions",
  description:
    "Get in touch with SSI Automations to discover how our AI-driven automation tools can help your small business thrive, streamline operations, and enhance decision-making.",
  openGraph: {
    images: ["https://www.ssiautomations.com/SSI-Automations-banner.png"],
  },
};

export default function ContactPage() {
  const words = [
    { text: "Let's" },
    { text: "Discuss" },
    { text: "Your" },
    { text: "Business" },
    { text: "Needs" },
  ];

  return (
    <div className="relative overflow-hidden py-16 md:py-0 px-4 md:px-0 bg-gray-50 dark:bg-black">
      <div className="w-full min-h-screen relative overflow-hidden">
        <Background />
        
        <div className="max-w-7xl mx-auto pb-20">
          {/* Header Section */}
          <div className="text-center py-12 md:py-20 relative z-10">
            <div className="mx-auto">
              <TypewriterEffect words={words} className="mb-6" />
              <p className="text-center mt-4 text-base md:text-xl text-muted dark:text-muted-dark max-w-2xl mx-auto">
                <TextGenerateEffect words="Schedule a free strategy call or send us a message. Our team will help you find the perfect AI solution for your business." />
              </p>
            </div>
          </div>
          
          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 relative z-20 px-4 md:px-8">
            {/* Contact Form Column */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-black dark:text-white">Send Us a Message</h2>
                <p className="text-muted dark:text-muted-dark text-sm mb-6">We'll get back to you as soon as possible.</p>
                <ContactForm />
              </div>
            </div>
            
            {/* Calendar Column */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <div className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-black dark:text-white">Book a Strategy Call</h2>
                <p className="text-muted dark:text-muted-dark text-sm mb-6">Schedule a free 30-minute consultation with our team.</p>
                <CalendarEmbed />
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
