// Re-export all Supabase utilities for convenience
export { createClient as createBrowserClient } from "./client";
export { createClient as createServerClient } from "./server";
export { createAdminClient } from "./admin";
export { getAllCookies, setAllCookies } from "./cookies";
export { updateSession } from "./middleware";
export type { Database } from "./types";
export type { AdminClient } from "./admin";

// Web3 authentication utilities
export {
  signInWithWeb3,
  signInWithSolana,
  signInWithSolanaAdapter,
  signInWithEthereum,
  detectWeb3Wallet,
  isSolanaWalletAvailable,
  isEthereumWalletAvailable,
  getSolanaWallet,
} from "./web3";
