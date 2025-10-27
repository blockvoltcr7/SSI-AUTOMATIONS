import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/context/theme-provider";

// Check if we're in production environment for Meta Business Suite domain verification
// This ensures the Meta verification tag only appears on the live production domain
// Required for Facebook/Meta integrations and business features
const isProduction =
  process.env.NODE_ENV === "production" &&
  (!process.env.NEXT_PUBLIC_VERCEL_ENV ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production");

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ssiautomations.com"),
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
  other: {
    // Meta Business Suite domain verification - production only for security and accuracy
    // Verification token obtained from Meta Business Suite dashboard (Business Settings → Domains)
    // Enables Facebook/Meta integrations, Pixel implementation, and advanced business features
    ...(isProduction && {
      "facebook-domain-verification": "yb8e406dpnvzbn2gxsmdivpf1sjpny5",
    }),
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
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ViewTransitions>{children}</ViewTransitions>
        </ThemeProvider>
      </body>
    </html>
  );
}
