import { Metadata } from "next";
import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { NewsletterSignupHome } from "@/components/newsletter-signup-home";
import { HorizontalGradient } from "@/components/horizontal-gradient";

export const metadata: Metadata = {
  title: "Newsletter - SSI Automations",
  description:
    "Subscribe to the AI Learning Newsletter for curated content, course updates, and learning tips delivered straight to your inbox.",
  openGraph: {
    images: ["/SSI-Automations-banner.png"],
  },
};

export default function NewsletterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 h-full w-full">
        <Background />
      </div>

      <Container className="py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI Learning Newsletter
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
              Stay ahead of the curve with curated AI learning resources, course
              updates, and expert insights delivered to your inbox.
            </p>
          </div>

          {/* Newsletter Input */}
          <div className="mb-20">
            <NewsletterSignupHome />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-neutral-800 rounded-xl p-8 hover:border-neutral-600 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Curated Course Picks
              </h3>
              <p className="text-neutral-400">
                Handpicked courses from top platforms like OpenAI Academy,
                DeepLearning.ai, and Claude for Education—no noise, just
                quality.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-neutral-800 rounded-xl p-8 hover:border-neutral-600 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Platform Updates
              </h3>
              <p className="text-neutral-400">
                Be the first to know about new features, course launches, and
                exclusive opportunities from featured AI learning platforms.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-neutral-800 rounded-xl p-8 hover:border-neutral-600 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Learning Tips & Insights
              </h3>
              <p className="text-neutral-400">
                Practical advice, study strategies, and expert insights to help
                you maximize your AI learning journey.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-neutral-800 rounded-xl p-8 hover:border-neutral-600 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Community Highlights
              </h3>
              <p className="text-neutral-400">
                Success stories, community achievements, and trending
                discussions from the AI learning community.
              </p>
            </div>
          </div>

          {/* What to Expect Section */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              What to Expect
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Weekly or Bi-weekly Delivery
                  </h4>
                  <p className="text-neutral-400 text-sm">
                    Receive our newsletter directly to your inbox at a
                    consistent cadence—never overwhelming, always valuable.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Course of the Week
                  </h4>
                  <p className="text-neutral-400 text-sm">
                    One carefully selected course or learning resource that
                    stands out, with clear explanations of why it's worth your
                    time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Actionable Insights
                  </h4>
                  <p className="text-neutral-400 text-sm">
                    No fluff, just practical tips and strategies you can apply
                    immediately to accelerate your learning.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">
                    Unsubscribe Anytime
                  </h4>
                  <p className="text-neutral-400 text-sm">
                    No commitment required. Unsubscribe with one click if our
                    newsletter isn't the right fit for you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <HorizontalGradient className="top-20" />
      <HorizontalGradient className="bottom-20" />
    </div>
  );
}
