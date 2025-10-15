/**
 * Web3 Metadata Collection
 *
 * Collects additional metadata during Web3 sign-in for security,
 * analytics, and user experience purposes.
 */

import type { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

export interface Web3Metadata {
  wallet_metadata: {
    address: string;
    chain: string;
    wallet_type: string;
    connection_method: string;
  };
  session_metadata: {
    ip_address?: string;
    user_agent?: string;
    device_type: string;
    timestamp: string;
  };
  on_chain_data?: {
    sol_balance?: number;
    wallet_age_days?: number;
    has_activity: boolean;
  };
  risk_assessment: {
    is_new_wallet: boolean;
    risk_score: "low" | "medium" | "high";
  };
}

/**
 * Detect wallet type from the wallet adapter
 */
export function detectWalletType(wallet: WalletContextState): string {
  const walletName = wallet.wallet?.adapter?.name || "unknown";
  return walletName.toLowerCase();
}

/**
 * Get device information from user agent
 */
export function getDeviceInfo(userAgent?: string): {
  device_type: string;
  browser: string;
} {
  if (!userAgent) {
    return { device_type: "unknown", browser: "unknown" };
  }

  const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent);
  const device_type = isMobile ? "mobile" : "desktop";

  let browser = "unknown";
  if (userAgent.includes("Chrome")) browser = "chrome";
  else if (userAgent.includes("Firefox")) browser = "firefox";
  else if (userAgent.includes("Safari")) browser = "safari";
  else if (userAgent.includes("Edge")) browser = "edge";

  return { device_type, browser };
}

/**
 * Fetch basic on-chain data (optional - requires RPC call)
 * Only call this if you want to enrich user data with blockchain info
 */
export async function fetchOnChainData(
  publicKey: PublicKey,
  rpcUrl?: string,
): Promise<{
  sol_balance?: number;
  wallet_age_days?: number;
  has_activity: boolean;
}> {
  try {
    const connection = new Connection(
      rpcUrl || "https://api.mainnet-beta.solana.com",
    );

    // Get SOL balance
    const balance = await connection.getBalance(publicKey);
    const sol_balance = balance / 1e9; // Convert lamports to SOL

    // Get wallet age (first transaction)
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit: 1,
    });

    let wallet_age_days: number | undefined;
    if (signatures.length > 0) {
      const firstTx = signatures[signatures.length - 1];
      if (firstTx.blockTime) {
        const ageMs = Date.now() - firstTx.blockTime * 1000;
        wallet_age_days = Math.floor(ageMs / (1000 * 60 * 60 * 24));
      }
    }

    return {
      sol_balance,
      wallet_age_days,
      has_activity: signatures.length > 0,
    };
  } catch (error) {
    console.error("Error fetching on-chain data:", error);
    return {
      has_activity: false,
    };
  }
}

/**
 * Assess risk level based on wallet characteristics
 */
export function assessRisk(metadata: {
  wallet_age_days?: number;
  has_activity: boolean;
  sol_balance?: number;
}): {
  is_new_wallet: boolean;
  risk_score: "low" | "medium" | "high";
} {
  const { wallet_age_days, has_activity, sol_balance } = metadata;

  // New wallet (less than 7 days old)
  const is_new_wallet = wallet_age_days !== undefined && wallet_age_days < 7;

  // Calculate risk score
  let risk_score: "low" | "medium" | "high" = "low";

  if (is_new_wallet && !has_activity) {
    risk_score = "high"; // Brand new wallet with no activity
  } else if (is_new_wallet || !has_activity) {
    risk_score = "medium"; // Either new or no activity
  } else if (sol_balance !== undefined && sol_balance < 0.01) {
    risk_score = "medium"; // Very low balance
  }

  return { is_new_wallet, risk_score };
}

/**
 * Collect all Web3 metadata for sign-in
 *
 * @param wallet - Wallet adapter context
 * @param request - Optional Next.js request object for headers
 * @param fetchOnChain - Whether to fetch on-chain data (slower but more info)
 */
export async function collectWeb3Metadata(
  wallet: WalletContextState,
  request?: Request,
  fetchOnChain: boolean = false,
): Promise<Web3Metadata> {
  const address = wallet.publicKey?.toBase58() || "";
  const wallet_type = detectWalletType(wallet);

  // Get session metadata
  const userAgent = request?.headers.get("user-agent") || undefined;
  const { device_type } = getDeviceInfo(userAgent);

  // Basic metadata (always collected)
  const metadata: Web3Metadata = {
    wallet_metadata: {
      address,
      chain: "solana",
      wallet_type,
      connection_method: "browser_extension",
    },
    session_metadata: {
      user_agent: userAgent,
      device_type,
      timestamp: new Date().toISOString(),
    },
    risk_assessment: {
      is_new_wallet: false,
      risk_score: "low",
    },
  };

  // Optional: Fetch on-chain data (adds ~1-2 seconds to sign-in)
  if (fetchOnChain && wallet.publicKey) {
    try {
      const onChainData = await fetchOnChainData(wallet.publicKey);
      metadata.on_chain_data = onChainData;
      metadata.risk_assessment = assessRisk(onChainData);
    } catch (error) {
      console.error("Failed to fetch on-chain data:", error);
    }
  }

  return metadata;
}
