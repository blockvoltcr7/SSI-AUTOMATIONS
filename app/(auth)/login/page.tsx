import { LoginForm } from "@/components/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - SSI Automations",
  description:
    "Sign in to learn AI and agentic engineering. Master the skills to become a high-demand AI engineer, whether you're technical or non-technical. Start your AI journey today.",
  openGraph: {
    images: ["https://www.ssiautomations.com/SSI-Automations-banner.png"],
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
