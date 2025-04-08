import { Container } from "@/components/container";
import { Hero } from "@/components/hero";
import { Background } from "@/components/background";
import { GridFeatures } from "@/components/grid-features";
import HowItWorks from "@/components/how-it-works";
import { CTA } from "@/components/cta";

export default function Home() {
  return (
    <div className="relative">
      <div className="absolute inset-0 h-full w-full overflow-hidden ">
        <Background />
      </div>
      <Container className="flex min-h-screen flex-col items-center justify-between ">
        <Hero />
        {/* <Companies /> */}
        {/* <Features /> */}
        {/* <GridFeatures /> */}
        <HowItWorks />
        {/* <Testimonials /> */}
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
