"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import Solana wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaWalletProviderProps {
  children: ReactNode;
}

/**
 * Solana Wallet Adapter Provider
 *
 * Wraps the application with Solana wallet connection providers.
 * Supports multiple wallets: Phantom, Solflare, Torus, Ledger, and more.
 *
 * Usage:
 * Wrap your app or specific routes with this provider to enable wallet functionality.
 */
export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({
  children,
}) => {
  // You can use 'devnet', 'testnet', or 'mainnet-beta'
  // For production, use your own RPC endpoint for better performance
  const endpoint = useMemo(() => {
    // Use custom RPC endpoint if available, otherwise use public endpoint
    return (
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
      clusterApiUrl(
        (process.env.NEXT_PUBLIC_SOLANA_NETWORK as any) || "mainnet-beta",
      )
    );
  }, []);

  // Initialize wallet adapters
  // You can add or remove wallets based on your needs
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      // Add more wallet adapters here as needed
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
