import type { Metadata } from "next";
import "../globals.css";
import { GeistSans } from "geist/font/sans";
import { NavBar } from "@/components/navbar";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "SSI Automations",
  description:
    "SSI Automations is a cutting-edge AI team dedicated to crafting bespoke artificial intelligence solutions for businesses. Our expert developers leverage state-of-the-art machine learning technologies to create intelligent systems that streamline operations, enhance decision-making processes, and drive innovation across various industries. From predictive analytics and natural language processing to computer vision and robotic process automation, we deliver tailored AI solutions that empower businesses to stay ahead in an increasingly digital world.",
  openGraph: {
    images: ["/SSI-Automations-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <NavBar />
      {children}
      <Footer />
    </main>
  );
}
