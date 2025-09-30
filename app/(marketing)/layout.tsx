import type { Metadata } from "next";
import "../globals.css";
import { NavBar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "SSI Automations - Your AI Learning Hub",
  description:
    "Discover the best places to learn AI. Curated links to world-class academies and communities including OpenAI Academy, Claude for Education, DeepLearning.ai, and AI Engineer community.",
  openGraph: {
    images: ["/SSI-Automations-banner.png"],
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
