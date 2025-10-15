"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signInWithSolanaAdapter } from "@/lib/supabase/web3";
import dynamic from "next/dynamic";

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false },
);

/**
 * Solana Wallet Sign-In Button
 *
 * This component provides a professional multi-wallet experience:
 * - Shows WalletMultiButton when not connected (wallet selection modal)
 * - Shows custom sign-in button when wallet is connected
 * - Handles authentication with Supabase
 * - Redirects to dashboard on success
 */
export function SolanaWalletButton() {
  const wallet = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      setError(
        "Please connect your wallet first by clicking the button above.",
      );
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: signInError } =
        await signInWithSolanaAdapter(wallet);

      if (signInError) {
        setError(signInError);
        return;
      }

      if (data?.session) {
        // Successfully authenticated, redirect to dashboard
        router.push("/dashboard");
      }
    } catch (e: any) {
      setError(e.message || "Failed to sign in with Solana wallet");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-2">
        <div className="h-12 w-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-white">Loading...</span>
        </div>
      </div>
    );
  }

  // Show wallet selection button if not connected
  if (!wallet.connected) {
    return (
      <div className="space-y-2">
        <div className="relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px]">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <div className="relative z-10 w-full h-full flex items-center justify-center rounded-full bg-slate-950">
            <WalletMultiButton
              style={{
                backgroundColor: "transparent",
                border: "none",
                height: "100%",
                width: "100%",
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 text-center">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Show sign-in button when wallet is connected
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        className="relative inline-flex h-12 w-full overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Sign in with Solana
              <svg
                fill="none"
                height="16"
                viewBox="0 0 24 24"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.75 8.75L14.25 12L10.75 15.25"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </span>
          )}
        </span>
      </button>

      {error && (
        <p
          className={`text-xs text-center ${
            error.includes("cancelled") || error.includes("rejected")
              ? "text-amber-600 dark:text-amber-400"
              : "text-red-500 dark:text-red-400"
          }`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
