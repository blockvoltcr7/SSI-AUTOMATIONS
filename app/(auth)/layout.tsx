import { AuthLayout } from "@/layouts/auth-layout";
import { SolanaWalletProvider } from "@/context/solana-wallet-provider";

export default function AuthXLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolanaWalletProvider>
      <AuthLayout>
        <main className="flex h-full min-h-screen w-full">{children}</main>
      </AuthLayout>
    </SolanaWalletProvider>
  );
}
