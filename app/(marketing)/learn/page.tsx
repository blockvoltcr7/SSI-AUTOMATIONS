import { Container } from "@/components/container";
import { Background } from "@/components/background";
import { HubCards } from "@/components/hub-cards";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn AI - SSI Automations",
  description:
    "Discover curated links to world-class AI academies and communities. Learn from OpenAI Academy, Claude for Education, DeepLearning.ai, and AI Engineer community.",
  openGraph: {
    images: ["/SSI-Automations-banner.png"],
  },
};

export default function LearnPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Background />
      </div>
      <Container className="flex flex-col items-center justify-center py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Featured AI Hubs
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto">
            Curated links to world-class academies and communities—kept simple.
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4">
          <HubCards />
        </div>
      </Container>
    </div>
  );
}
