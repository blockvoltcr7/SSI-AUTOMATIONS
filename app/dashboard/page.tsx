import { createClient as createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard - SSI Automations",
  description: "Your SSI Automations dashboard",
};

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Extract Web3 wallet information
  const isWeb3User = user.app_metadata?.provider === "web3";
  const walletAddress = user.user_metadata?.custom_claims?.address;
  const chain = user.user_metadata?.custom_claims?.chain;
  const domain = user.user_metadata?.custom_claims?.domain;
  const statement = user.user_metadata?.custom_claims?.statement;
  const sub = user.user_metadata?.sub;

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return "N/A";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-lg p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Welcome to your Dashboard
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                {isWeb3User ? (
                  <>
                    Connected with{" "}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {chain?.toUpperCase()}
                    </span>{" "}
                    wallet
                  </>
                ) : (
                  "You're successfully authenticated!"
                )}
              </p>
            </div>
            <form action="/api/auth/signout" method="post">
              <Button variant="outline" type="submit">
                Sign out
              </Button>
            </form>
          </div>

          {/* Web3 Wallet Information */}
          {isWeb3User && walletAddress && (
            <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-8">
              <h2 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🔐</span>
                Web3 Wallet Information
              </h2>
              <dl className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg">
                  <dt className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Wallet Address
                  </dt>
                  <dd className="mt-1 text-sm font-mono text-black dark:text-white break-all">
                    {walletAddress}
                  </dd>
                  <dd className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Short: {formatAddress(walletAddress)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Blockchain
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-white">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      {chain?.toUpperCase() || "N/A"}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Authentication Domain
                  </dt>
                  <dd className="mt-1 text-sm text-black dark:text-white">
                    {domain || "N/A"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Signed Statement
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 italic">
                    "{statement || "N/A"}"
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Subject Identifier (sub)
                  </dt>
                  <dd className="mt-1 text-xs font-mono text-neutral-600 dark:text-neutral-400 break-all">
                    {sub || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Account Information */}
          <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
              Account Information
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-white">
                  {user.email || (
                    <span className="text-neutral-400">
                      Not provided (Web3 login)
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  User ID
                </dt>
                <dd className="mt-1 text-sm font-mono text-black dark:text-white">
                  {user.id}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Authentication Provider
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-white">
                  {user.app_metadata?.provider || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Account Created
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-white">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : "N/A"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Last Sign In
                </dt>
                <dd className="mt-1 text-sm text-black dark:text-white">
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "N/A"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Debug: Raw User Data */}
          <details className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <summary className="text-lg font-semibold text-black dark:text-white mb-4 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400">
              🔍 Developer: View Raw User Data
            </summary>
            <pre className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-auto text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
          </details>

          {/* Quick Links */}
          <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-8">
            <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
              Quick Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <h3 className="font-medium text-black dark:text-white">Home</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Return to the homepage
                </p>
              </Link>
              <Link
                href="/blog"
                className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <h3 className="font-medium text-black dark:text-white">Blog</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Read our latest posts
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
