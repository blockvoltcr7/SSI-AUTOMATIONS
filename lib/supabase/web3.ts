import { createClient } from "./client";

/**
 * Detects if a Solana wallet is available in the browser
 */
export function isSolanaWalletAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).solana;
}

/**
 * Detects if an Ethereum wallet is available in the browser
 */
export function isEthereumWalletAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).ethereum;
}

/**
 * Gets the Solana wallet object (supports Phantom, Brave, etc.)
 */
export function getSolanaWallet() {
  if (typeof window === "undefined") return null;

  // Try Phantom first (most popular)
  if ((window as any).phantom?.solana) {
    return (window as any).phantom.solana;
  }

  // Try Brave Wallet
  if ((window as any).braveSolana) {
    return (window as any).braveSolana;
  }

  // Fallback to generic solana object
  return (window as any).solana || null;
}

/**
 * Signs in a user with their Solana wallet
 */
export async function signInWithSolana() {
  const supabase = createClient();
  const wallet = getSolanaWallet();

  if (!wallet) {
    throw new Error(
      "No Solana wallet detected. Please install Phantom or another Solana wallet.",
    );
  }

  try {
    // Connect to the wallet if not already connected
    if (!wallet.isConnected) {
      await wallet.connect();
    }

    // Sign in with Web3
    const { data, error } = await supabase.auth.signInWithWeb3({
      chain: "solana",
      statement:
        "I accept the SSI Automations Terms of Service at https://www.ssiautomations.com/terms",
      wallet,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Solana sign-in error:", error);
    return {
      data: null,
      error: error.message || "Failed to sign in with Solana wallet",
    };
  }
}

/**
 * Signs in a user with their Ethereum wallet
 */
export async function signInWithEthereum() {
  const supabase = createClient();

  if (!isEthereumWalletAvailable()) {
    throw new Error(
      "No Ethereum wallet detected. Please install MetaMask or another Ethereum wallet.",
    );
  }

  try {
    // Sign in with Web3
    const { data, error } = await supabase.auth.signInWithWeb3({
      chain: "ethereum",
      statement:
        "I accept the SSI Automations Terms of Service at https://www.ssiautomations.com/terms",
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error: any) {
    console.error("Ethereum sign-in error:", error);
    return {
      data: null,
      error: error.message || "Failed to sign in with Ethereum wallet",
    };
  }
}

/**
 * Detects which Web3 wallets are available and returns the preferred one
 */
export function detectWeb3Wallet(): "solana" | "ethereum" | null {
  // Prioritize Solana since you're on the web3-solana branch
  if (isSolanaWalletAvailable()) {
    return "solana";
  }

  if (isEthereumWalletAvailable()) {
    return "ethereum";
  }

  return null;
}

/**
 * Signs in with the detected Web3 wallet
 */
export async function signInWithWeb3() {
  const walletType = detectWeb3Wallet();

  if (!walletType) {
    throw new Error(
      "No Web3 wallet detected. Please install Phantom (Solana) or MetaMask (Ethereum).",
    );
  }

  if (walletType === "solana") {
    return await signInWithSolana();
  } else {
    return await signInWithEthereum();
  }
}
