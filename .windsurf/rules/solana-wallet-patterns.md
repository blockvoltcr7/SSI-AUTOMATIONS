# Solana Wallet Adapter Patterns

## Provider Setup

### Required Provider Hierarchy

```tsx
<ConnectionProvider endpoint={rpcEndpoint}>
  <WalletProvider wallets={wallets} autoConnect={false}>
    <WalletModalProvider>{children}</WalletModalProvider>
  </WalletProvider>
</ConnectionProvider>
```

### Configuration Pattern

```tsx
"use client";

import { useMemo } from "react";
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
import "@solana/wallet-adapter-react-ui/styles.css";

export const SolanaWalletProvider = ({ children }) => {
  const endpoint = useMemo(() => {
    return (
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
      clusterApiUrl(process.env.NEXT_PUBLIC_SOLANA_NETWORK || "mainnet-beta")
    );
  }, []);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
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
```

## Using Wallet in Components

### Hook Pattern

```tsx
import { useWallet } from "@solana/wallet-adapter-react";

function MyComponent() {
  const { connected, publicKey, disconnect, signMessage } = useWallet();

  if (!connected) {
    return <p>Please connect your wallet</p>;
  }

  return (
    <div>
      <p>Connected: {publicKey?.toBase58()}</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

## Authentication Pattern

```typescript
import { signInWithSolanaAdapter } from "@/lib/supabase/web3";

const handleSignIn = async () => {
  const wallet = useWallet();

  if (!wallet.connected || !wallet.publicKey) {
    setError("Please connect your wallet first");
    return;
  }

  const { data, error } = await signInWithSolanaAdapter(wallet);

  if (error) {
    setError(error);
    return;
  }

  router.push("/dashboard");
};
```

## Environment Variables

```bash
# .env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta  # or devnet, testnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-endpoint.com  # optional
```

## Best Practices

1. **Use custom RPC endpoint** - Public RPCs are slow and rate-limited
2. **Set autoConnect to false** - Let users control connection
3. **Memoize wallet list** - Prevents unnecessary re-initialization
4. **Import CSS** - Required for wallet modal styling
5. **Use "use client" directive** - Provider must be client-side
6. **Wrap at layout level** - Makes wallet available to all child routes

## Security Considerations

### Message Signing

```typescript
// Always include domain and terms in signed message
const result = await supabase.auth.signInWithWeb3({
  chain: "solana",
  statement:
    "I accept the SSI Automations Terms of Service at https://www.ssiautomations.com/terms",
  wallet: wallet,
});
```

### Session Management

- Sessions managed by Supabase
- Middleware validates sessions on every request
- Sessions expire based on Supabase settings

## Supported Wallets

- ✅ Phantom (most popular)
- ✅ Solflare
- ✅ Torus
- ✅ Ledger
- ✅ Brave Wallet
- ✅ Any wallet implementing Solana Wallet Standard

## Anti-Patterns

❌ Not using wallet adapter (manual wallet detection)
❌ Hardcoding wallet types (use adapter auto-detection)
❌ Not memoizing wallet list (causes re-renders)
❌ Using public RPC in production (slow and unreliable)
❌ Not importing wallet adapter CSS (broken modal styling)
❌ Setting autoConnect to true (poor UX, unexpected behavior)

## Performance Optimization

### Use Custom RPC Provider

```typescript
// Recommended providers:
// - Helius (https://helius.dev/)
// - QuickNode (https://www.quicknode.com/)
// - Alchemy (https://www.alchemy.com/)

const endpoint =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");
```

### Lazy Load Wallet Adapters

```typescript
// Only load wallets users actually need
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // Don't load every possible wallet
  ],
  [],
);
```
