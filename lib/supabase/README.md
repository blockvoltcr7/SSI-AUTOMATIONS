// Supabase Client/Server Utilities
//
// This directory contains modular Supabase utilities for both client-side and server-side operations.
//
// Usage:
//
// Client-side (in React components):
// import { createBrowserClient } from 'lib/supabase/client'
// const supabase = createBrowserClient()
//
// Server-side (in API routes, server components, middleware):
// import { createServerClient } from 'lib/supabase/server'
// const supabase = createServerClient()
//
// Web3 Authentication (Solana & Ethereum):
// import { signInWithWeb3, signInWithSolana, signInWithEthereum } from 'lib/supabase/web3'
// const { data, error } = await signInWithWeb3() // Auto-detects wallet
// const { data, error } = await signInWithSolana() // Solana-specific
// const { data, error } = await signInWithEthereum() // Ethereum-specific
//
// Web3 Wallet Detection:
// import { detectWeb3Wallet, isSolanaWalletAvailable, isEthereumWalletAvailable } from 'lib/supabase/web3'
// const walletType = detectWeb3Wallet() // Returns 'solana', 'ethereum', or null
//
// Advanced cookie utilities:
// import { getAllCookies, setAllCookies } from 'lib/supabase/cookies'
//
// Types:
// import type { Database } from 'lib/supabase/types'
//
// Or import everything:
// import { createBrowserClient, createServerClient, signInWithWeb3, getAllCookies, setAllCookies, Database } from 'lib/supabase'
