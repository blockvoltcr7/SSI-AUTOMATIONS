import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/context/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssiautomations.com"),
  title: "SSI Automations - AI Solutions for Small Businesses",
  description:
    "Discover how SSI Automations empowers small businesses with cutting-edge AI tools and automation workflows to boost productivity and maximize profits. Explore our innovative solutions today!",
  openGraph: {
    title: "SSI Automations - AI Solutions for Small Businesses",
    description:
      "Empower your business with SSI Automations. Leverage modern AI tools and automation workflows to enhance productivity and profitability.",
    images: ["https://www.ssiautomations.com/SSI-Automations-banner.png"],
    url: "https://www.ssiautomations.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(GeistSans.className, "antialiased h-full w-full")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ViewTransitions>{children}</ViewTransitions>
        </ThemeProvider>
      </body>
    </html>
  );
}
