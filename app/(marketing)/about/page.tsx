import { Metadata } from "next";
import { Background } from "@/components/background";
import { HorizontalGradient } from "@/components/horizontal-gradient";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export const metadata: Metadata = {
  title: "About - SSI Automations",
  description:
    "Learn about SSI Automations, your curated AI learning hub connecting you to the best resources for mastering artificial intelligence.",
};

export default function AboutPage() {
  const words = [{ text: "About" }, { text: "SSI" }, { text: "Automations" }];

  return (
    <div className="relative overflow-hidden py-16 md:py-0 px-4 md:px-0 bg-gray-50 dark:bg-black">
      <div className="w-full min-h-screen relative overflow-hidden">
        <Background />

        <div className="max-w-4xl mx-auto pb-20">
          {/* Header Section */}
          <div className="text-center py-12 md:py-20 relative z-10">
            <TypewriterEffect words={words} className="mb-6" />
            <p className="text-center mt-4 text-base md:text-xl text-muted dark:text-muted-dark max-w-2xl mx-auto">
              <TextGenerateEffect words="Your curated hub for discovering the best AI learning resources" />
            </p>
          </div>

          {/* Content */}
          <div className="relative z-20 px-4 md:px-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 p-8 md:p-12">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
                <p className="mb-6 text-lg">
                  At SSI Automations, we believe that learning AI shouldn't be
                  overwhelming. Our mission is to cut through the noise and
                  connect you with the best educational resources, communities,
                  and academies in the AI space—all in one place.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">What We Do</h2>
                <p className="mb-4">
                  We curate and feature the highest-quality AI learning
                  destinations:
                </p>
                <ul className="list-disc pl-6 mb-6">
                  <li>
                    <strong>Official Academy Programs:</strong> Direct links to
                    courses from leading AI companies like OpenAI and Anthropic
                  </li>
                  <li>
                    <strong>Industry-Recognized Courses:</strong> World-class
                    educational platforms like DeepLearning.ai with proven track
                    records
                  </li>
                  <li>
                    <strong>Builder Communities:</strong> Active communities
                    where you can connect with other AI engineers and
                    practitioners
                  </li>
                  <li>
                    <strong>Vetted Resources:</strong> Every hub we feature has
                    been carefully evaluated for quality, relevance, and value
                  </li>
                </ul>

                <h2 className="text-2xl font-bold mb-6 mt-8">Our Approach</h2>
                <p className="mb-6">
                  We keep things simple. No lengthy reviews, no overwhelming
                  lists—just straightforward links to the resources that matter
                  most. We focus on quality over quantity, featuring only the
                  educational hubs that consistently deliver exceptional
                  learning experiences.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  Why SSI Automations?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Carefully Curated</h3>
                    <p className="text-sm">
                      We don't list everything—only the best resources that
                      deliver real value to learners at all levels.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">No Clutter</h3>
                    <p className="text-sm">
                      A clean, minimalist design that gets you to the resources
                      you need without distractions.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Trusted Sources</h3>
                    <p className="text-sm">
                      Every hub we feature is from a reputable organization with
                      proven expertise in AI education.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800 p-6 rounded-lg">
                    <h3 className="font-semibold mb-2">Always Updated</h3>
                    <p className="text-sm">
                      We continuously monitor and update our featured hubs to
                      ensure you have access to the latest resources.
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 mt-8">Our Vision</h2>
                <p className="mb-6">
                  We envision a world where anyone interested in AI can quickly
                  find the right learning path without getting lost in endless
                  lists of resources. By maintaining a focused, curated
                  collection of the best AI educational hubs, we help learners
                  spend less time searching and more time learning.
                </p>

                <h2 className="text-2xl font-bold mb-6 mt-8">
                  Start Learning Today
                </h2>
                <p className="mb-4">
                  Whether you're taking your first steps into AI or looking to
                  deepen your expertise, our featured hubs offer world-class
                  resources to help you achieve your goals.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <p className="font-medium mb-2">Ready to explore?</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Visit our Learn page to discover the top AI academies,
                    courses, and communities curated just for you.
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
