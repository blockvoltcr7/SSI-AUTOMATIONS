import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import { ThemeProvider } from "@/context/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://z.com"),
  title: "SSI Automations - AI Solutions for Small Businesses",
  description:
    "Discover how SSI Automations empowers small businesses with cutting-edge AI tools and automation workflows to boost productivity and maximize profits. Explore our innovative solutions today!",
  openGraph: {
    title: "SSI Automations - AI Solutions for Small Businesses",
    description:
      "Empower your business with SSI Automations. Leverage modern AI tools and automation workflows to enhance productivity and profitability.",
    images: ["/SSI-Automations-banner.png"],
    url: "https://www.ssiautomations.com", // Replace with your actual website URL
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body
          className={cn(
            GeistSans.className,
            "bg-white dark:bg-black antialiased h-full w-full"
          )}
        >
          <ThemeProvider
            attribute="class"
            enableSystem
            disableTransitionOnChange
            defaultTheme="light"
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
