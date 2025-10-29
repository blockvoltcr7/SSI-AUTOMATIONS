import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard - SSI Automations",
  description: "Your SSI Automations dashboard",
};

export default async function DashboardPage() {
  // Get user from Supabase (auth already checked in layout)
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract user information
  const isWeb3User = user?.app_metadata?.provider === "web3";
  const walletAddress = user?.user_metadata?.custom_claims?.address;
  const chain = user?.user_metadata?.custom_claims?.chain;

  return (
    <>
      {/* Welcome Section */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            {isWeb3User && chain
              ? `Connected with ${chain.toUpperCase()} wallet`
              : "Here's an overview of your account"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isWeb3User ? "Web3" : "Email"}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.app_metadata?.provider || "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Member Since
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">Account created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Email
                </dt>
                <dd className="mt-1 text-sm">
                  {user?.email || (
                    <span className="text-muted-foreground">
                      Not provided (Web3 login)
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  User ID
                </dt>
                <dd className="mt-1 text-xs font-mono">{user?.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Provider
                </dt>
                <dd className="mt-1 text-sm">
                  {user?.app_metadata?.provider || "N/A"}
                </dd>
              </div>
            </CardContent>
          </Card>

          {/* Web3 Wallet Information */}
          {isWeb3User && walletAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Web3 Wallet</CardTitle>
                <CardDescription>
                  Your blockchain connection details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Wallet Address
                  </dt>
                  <dd className="mt-1 text-xs font-mono break-all">
                    {walletAddress}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Blockchain
                  </dt>
                  <dd className="mt-1">
                    <Badge variant="secondary">
                      {chain?.toUpperCase() || "N/A"}
                    </Badge>
                  </dd>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
