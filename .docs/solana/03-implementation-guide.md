# Implementation Guide: Solana Wallet Features

> **Step-by-step guide to implement wallet features in SSI Automations**

This guide provides practical code examples and implementation steps for integrating Solana wallet capabilities into your application.

---

## 📋 Prerequisites

### **Required Dependencies**

```bash
# Install Solana dependencies
pnpm add @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-base

# Install Metaplex (for NFTs)
pnpm add @metaplex-foundation/js

# Install Bonfida (for SNS)
pnpm add @bonfida/spl-name-service
```

### **Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# Or use a paid RPC for better performance:
# NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.helius.xyz/?api-key=YOUR_KEY
```

---

## 🚀 Phase 1: User Identity System

### **Step 1: Create Wallet Info Utilities**

Create `lib/solana/wallet-info.ts`:

```typescript
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

export interface WalletIdentity {
  address: string;
  walletAge: number; // days
  transactionCount: number;
  firstTransaction?: Date;
  lastTransaction?: Date;
}

export async function getWalletIdentity(
  address: string,
): Promise<WalletIdentity> {
  const connection = new Connection(RPC_URL);
  const publicKey = new PublicKey(address);

  try {
    // Get all transaction signatures
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 1000,
    });

    if (signatures.length === 0) {
      return {
        address,
        walletAge: 0,
        transactionCount: 0,
      };
    }

    // Calculate wallet age
    const firstTx = signatures[signatures.length - 1];
    const lastTx = signatures[0];

    const firstTransaction = firstTx.blockTime
      ? new Date(firstTx.blockTime * 1000)
      : undefined;
    const lastTransaction = lastTx.blockTime
      ? new Date(lastTx.blockTime * 1000)
      : undefined;

    const walletAge = firstTx.blockTime
      ? Math.floor(
          (Date.now() - firstTx.blockTime * 1000) / (1000 * 60 * 60 * 24),
        )
      : 0;

    return {
      address,
      walletAge,
      transactionCount: signatures.length,
      firstTransaction,
      lastTransaction,
    };
  } catch (error) {
    console.error("Error fetching wallet identity:", error);
    return {
      address,
      walletAge: 0,
      transactionCount: 0,
    };
  }
}
```

---

### **Step 2: Create Reputation System**

Create `lib/solana/reputation.ts`:

```typescript
import type { WalletIdentity } from "./wallet-info";

export type UserTier = "newbie" | "active" | "power_user" | "whale";

export interface ReputationScore {
  score: number; // 0-100
  tier: UserTier;
  badges: string[];
}

export function calculateReputation(
  identity: WalletIdentity,
  balance: number,
  tokenCount: number = 0,
  nftCount: number = 0,
): ReputationScore {
  // Score components (max 100 points)
  const ageScore = Math.min(20, identity.walletAge / 5); // Max 20 for 100+ days
  const activityScore = Math.min(30, identity.transactionCount / 10); // Max 30 for 300+ txs
  const balanceScore = Math.min(20, balance * 2); // Max 20 for 10+ SOL
  const diversityScore = Math.min(15, tokenCount * 3); // Max 15 for 5+ tokens
  const nftScore = Math.min(15, nftCount * 1.5); // Max 15 for 10+ NFTs

  const score = Math.round(
    ageScore + activityScore + balanceScore + diversityScore + nftScore,
  );

  // Determine tier
  let tier: UserTier;
  if (score >= 80) tier = "whale";
  else if (score >= 60) tier = "power_user";
  else if (score >= 30) tier = "active";
  else tier = "newbie";

  // Assign badges
  const badges: string[] = [];
  if (identity.walletAge > 365) badges.push("OG");
  if (identity.transactionCount > 1000) badges.push("Active Trader");
  if (balance > 10) badges.push("Whale");
  if (nftCount > 10) badges.push("NFT Collector");
  if (tokenCount > 5) badges.push("DeFi User");

  return { score, tier, badges };
}

// Helper to get tier display info
export function getTierInfo(tier: UserTier) {
  const tierInfo = {
    newbie: {
      label: "Newbie",
      color: "gray",
      emoji: "🌱",
      benefits: ["10 automations/month", "Community support"],
    },
    active: {
      label: "Active",
      color: "blue",
      emoji: "⚡",
      benefits: ["50 automations/month", "Email support"],
    },
    power_user: {
      label: "Power User",
      color: "purple",
      emoji: "🚀",
      benefits: ["200 automations/month", "Priority support", "API access"],
    },
    whale: {
      label: "Whale",
      color: "gold",
      emoji: "👑",
      benefits: [
        "Unlimited automations",
        "Dedicated support",
        "Custom features",
      ],
    },
  };

  return tierInfo[tier];
}
```

---

### **Step 3: Create Risk Assessment**

Create `lib/solana/risk-assessment.ts`:

```typescript
import type { WalletIdentity } from "./wallet-info";

export type RiskLevel = "low" | "medium" | "high";

export interface RiskAssessment {
  level: RiskLevel;
  flags: string[];
  isNewWallet: boolean;
  hasActivity: boolean;
  recommendations: string[];
}

export function assessRisk(
  identity: WalletIdentity,
  balance: number,
): RiskAssessment {
  const flags: string[] = [];
  let level: RiskLevel = "low";

  // Check wallet age
  const isNewWallet = identity.walletAge < 7;
  if (isNewWallet) {
    flags.push("New wallet (< 7 days old)");
    level = "high";
  }

  // Check activity
  const hasActivity = identity.transactionCount > 0;
  if (!hasActivity) {
    flags.push("No transaction history");
    level = "high";
  }

  // Check balance
  if (balance < 0.01) {
    flags.push("Very low balance (< 0.01 SOL)");
    level = level === "high" ? "high" : "medium";
  }

  // Check transaction count
  if (identity.transactionCount < 5 && identity.walletAge > 30) {
    flags.push("Low activity for wallet age");
    level = level === "high" ? "high" : "medium";
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (isNewWallet) {
    recommendations.push("Require email verification");
    recommendations.push("Limit initial automation quota to 5/day");
  }
  if (!hasActivity) {
    recommendations.push("Request additional verification");
    recommendations.push("Manual review before premium access");
  }
  if (balance < 0.01) {
    recommendations.push("Require minimum balance for paid features");
  }

  return {
    level,
    flags,
    isNewWallet,
    hasActivity,
    recommendations,
  };
}
```

---

### **Step 4: Get SOL Balance**

Create `lib/solana/balance.ts`:

```typescript
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";

export interface Balance {
  sol: number;
  usd?: number;
}

export async function getBalance(address: string): Promise<Balance> {
  const connection = new Connection(RPC_URL);
  const publicKey = new PublicKey(address);

  try {
    // Get SOL balance
    const lamports = await connection.getBalance(publicKey);
    const sol = lamports / LAMPORTS_PER_SOL;

    // Get SOL price (optional)
    let usd: number | undefined;
    try {
      const priceRes = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      );
      const priceData = await priceRes.json();
      usd = sol * priceData.solana.usd;
    } catch (e) {
      console.error("Failed to fetch SOL price:", e);
    }

    return { sol, usd };
  } catch (error) {
    console.error("Error fetching balance:", error);
    return { sol: 0 };
  }
}

// Format helpers
export function formatSOL(amount: number): string {
  if (amount < 0.01) return amount.toFixed(4);
  if (amount < 1) return amount.toFixed(3);
  return amount.toFixed(2);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
```

---

### **Step 5: Create Server Action to Fetch Wallet Data**

Create `app/actions/wallet.ts`:

```typescript
"use server";

import { getWalletIdentity } from "@/lib/solana/wallet-info";
import { calculateReputation } from "@/lib/solana/reputation";
import { assessRisk } from "@/lib/solana/risk-assessment";
import { getBalance } from "@/lib/solana/balance";

export async function getWalletData(address: string) {
  try {
    // Fetch all data in parallel
    const [identity, balance] = await Promise.all([
      getWalletIdentity(address),
      getBalance(address),
    ]);

    // Calculate reputation and risk
    const reputation = calculateReputation(identity, balance.sol);
    const risk = assessRisk(identity, balance.sol);

    return {
      identity,
      balance,
      reputation,
      risk,
    };
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    throw new Error("Failed to fetch wallet data");
  }
}
```

---

### **Step 6: Update Dashboard to Display Wallet Data**

Update `app/dashboard/page.tsx`:

```typescript
import { createClient as createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getWalletData } from "@/app/actions/wallet";
import { getTierInfo } from "@/lib/solana/reputation";
import { formatSOL, formatUSD } from "@/lib/solana/balance";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get wallet address
  const walletAddress = user.user_metadata?.custom_claims?.address;

  // Fetch wallet data if user signed in with Web3
  let walletData = null;
  if (walletAddress) {
    try {
      walletData = await getWalletData(walletAddress);
    } catch (error) {
      console.error("Failed to fetch wallet data:", error);
    }
  }

  const tierInfo = walletData ? getTierInfo(walletData.reputation.tier) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Welcome to your Dashboard
          </h1>
          {walletData && tierInfo && (
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              {tierInfo.emoji} {tierInfo.label} Member
            </p>
          )}
        </div>

        {/* Wallet Data Display */}
        {walletData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Reputation Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Reputation Score
              </h3>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {walletData.reputation.score}/100
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                {tierInfo?.label} Tier
              </div>
              {walletData.reputation.badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {walletData.reputation.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Balance Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Portfolio
              </h3>
              <div className="text-3xl font-bold text-black dark:text-white mb-1">
                {formatSOL(walletData.balance.sol)} SOL
              </div>
              {walletData.balance.usd && (
                <div className="text-lg text-neutral-600 dark:text-neutral-400">
                  {formatUSD(walletData.balance.usd)}
                </div>
              )}
            </div>

            {/* Activity Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                Activity
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-neutral-500 dark:text-neutral-400">
                    Wallet Age
                  </dt>
                  <dd className="text-lg font-semibold text-black dark:text-white">
                    {walletData.identity.walletAge} days
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-neutral-500 dark:text-neutral-400">
                    Transactions
                  </dt>
                  <dd className="text-lg font-semibold text-black dark:text-white">
                    {walletData.identity.transactionCount}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Risk Assessment (Admin/Debug View) */}
        {walletData && walletData.risk.level !== "low" && (
          <div className="mb-8 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
              ⚠️ Risk Assessment: {walletData.risk.level.toUpperCase()}
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-amber-800 dark:text-amber-300">
              {walletData.risk.flags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tier Benefits */}
        {tierInfo && (
          <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
              Your Benefits
            </h3>
            <ul className="space-y-2">
              {tierInfo.benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <span className="text-green-500">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎨 UI Components

### **Reputation Badge Component**

Create `components/reputation-badge.tsx`:

```typescript
import { getTierInfo, type UserTier } from "@/lib/solana/reputation";

interface ReputationBadgeProps {
  tier: UserTier;
  score: number;
  className?: string;
}

export function ReputationBadge({ tier, score, className = "" }: ReputationBadgeProps) {
  const tierInfo = getTierInfo(tier);

  const colorClasses = {
    gray: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700",
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
    gold: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colorClasses[tierInfo.color]} ${className}`}>
      <span className="text-lg">{tierInfo.emoji}</span>
      <span className="font-semibold">{tierInfo.label}</span>
      <span className="text-xs opacity-75">({score}/100)</span>
    </div>
  );
}
```

---

## 🔒 Middleware Protection

### **Add Risk-Based Access Control**

Update `middleware.ts`:

```typescript
import { createClient } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { getWalletData } from "@/app/actions/wallet";

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ["/dashboard", "/automations", "/api"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Risk-based access control for Web3 users
  if (user && isProtectedPath) {
    const walletAddress = user.user_metadata?.custom_claims?.address;

    if (walletAddress) {
      try {
        const walletData = await getWalletData(walletAddress);

        // Block high-risk wallets
        if (walletData.risk.level === "high") {
          // Redirect to verification page
          if (!request.nextUrl.pathname.startsWith("/verify")) {
            return NextResponse.redirect(new URL("/verify", request.url));
          }
        }

        // Add risk level to headers for use in pages
        response.headers.set("x-risk-level", walletData.risk.level);
        response.headers.set("x-user-tier", walletData.reputation.tier);
      } catch (error) {
        console.error("Error in middleware risk assessment:", error);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## 📊 Caching Strategy

### **Cache Wallet Data to Improve Performance**

Create `lib/cache/wallet-cache.ts`:

```typescript
// Simple in-memory cache (use Redis in production)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCachedWalletData(address: string) {
  const cached = cache.get(address);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  return null;
}

export function setCachedWalletData(address: string, data: any) {
  cache.set(address, {
    data,
    timestamp: Date.now(),
  });
}

export function clearWalletCache(address: string) {
  cache.delete(address);
}
```

Update `app/actions/wallet.ts` to use cache:

```typescript
import {
  getCachedWalletData,
  setCachedWalletData,
} from "@/lib/cache/wallet-cache";

export async function getWalletData(address: string) {
  // Check cache first
  const cached = getCachedWalletData(address);
  if (cached) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchWalletData(address);

  // Cache it
  setCachedWalletData(address, data);

  return data;
}
```

---

## ✅ Testing

### **Test Wallet Data Fetching**

Create `tests/wallet-info.test.ts`:

```typescript
import { getWalletIdentity } from "@/lib/solana/wallet-info";
import { calculateReputation } from "@/lib/solana/reputation";
import { assessRisk } from "@/lib/solana/risk-assessment";

describe("Wallet Info", () => {
  it("should fetch wallet identity", async () => {
    const address = "Fo73RdA8dDoaw388KXbDdvGdA6hzTBkP2pHQBS8cR3X2";
    const identity = await getWalletIdentity(address);

    expect(identity.address).toBe(address);
    expect(identity.walletAge).toBeGreaterThanOrEqual(0);
    expect(identity.transactionCount).toBeGreaterThanOrEqual(0);
  });

  it("should calculate reputation correctly", () => {
    const identity = {
      address: "test",
      walletAge: 100,
      transactionCount: 500,
    };

    const reputation = calculateReputation(identity, 5, 10, 5);

    expect(reputation.score).toBeGreaterThan(0);
    expect(reputation.score).toBeLessThanOrEqual(100);
    expect(["newbie", "active", "power_user", "whale"]).toContain(
      reputation.tier,
    );
  });

  it("should assess risk correctly", () => {
    const newWallet = {
      address: "test",
      walletAge: 3,
      transactionCount: 0,
    };

    const risk = assessRisk(newWallet, 0.001);

    expect(risk.level).toBe("high");
    expect(risk.isNewWallet).toBe(true);
    expect(risk.hasActivity).toBe(false);
  });
});
```

---

## 🚀 Deployment Checklist

### **Before Going to Production:**

- [ ] Use a paid RPC endpoint (Helius, QuickNode)
- [ ] Implement proper caching (Redis)
- [ ] Add rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Test with multiple wallets
- [ ] Optimize RPC calls
- [ ] Add loading states
- [ ] Handle edge cases (no transactions, etc.)
- [ ] Document API usage
- [ ] Set up analytics

---

## 📚 Next Steps

### **Phase 2: Token Holdings**

- Fetch SPL tokens
- Display token portfolio
- Calculate portfolio value
- Add token gating

### **Phase 3: NFT Display**

- Fetch NFT collection
- Display NFT gallery
- Show collection stats
- Add NFT gating

### **Phase 4: Advanced Features**

- Real-time balance updates
- Transaction feed
- SNS lookup
- Social verification

---

**This implementation guide provides everything you need to get started with Solana wallet features in SSI Automations.**
