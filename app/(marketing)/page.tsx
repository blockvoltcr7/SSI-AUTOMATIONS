import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Background } from "@/components/background";
import { HubCards } from "@/components/hub-cards";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Background />
      </div>

      <Container className="flex flex-col items-center">
        <Hero />

        <div id="hubs" className="w-full max-w-6xl mx-auto px-4 pb-20">
          <HubCards />
        </div>
      </Container>

      <div className="relative">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <Background />
        </div>
        <CTA />
      </div>
    </div>
  );
}
