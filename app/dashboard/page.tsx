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
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-lg p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white">
                Welcome to your Dashboard
              </h1>
              <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                You&apos;re successfully authenticated!
              </p>
            </div>
            <form action="/api/auth/signout" method="post">
              <Button variant="outline" type="submit">
                Sign out
              </Button>
            </form>
          </div>

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
                  {user.email}
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
