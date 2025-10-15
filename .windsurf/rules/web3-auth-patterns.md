---
trigger: model_decision
description: when making Web3 changes related Authentication Patterns
---

# Web3 Authentication Patterns

## Supabase Web3 Auth Integration

### Sign-In Pattern

```typescript
import { createClient } from "@/lib/supabase/client";

export async function signInWithSolanaAdapter(wallet: WalletContextState) {
  const supabase = createClient();

  if (!wallet.connected || !wallet.publicKey) {
    return {
      data: null,
      error: "Wallet not connected. Please connect your wallet first.",
    };
  }

  const result = await supabase.auth.signInWithWeb3({
    chain: "solana",
    statement:
      "I accept the SSI Automations Terms of Service at https://www.ssiautomations.com/terms",
    wallet: wallet as any,
  });

  return { data: result.data, error: result.error };
}
```

## Authentication Flow

### 1. Wallet Detection

```typescript
export function detectWeb3Wallet(): "solana" | "ethereum" | null {
  if (typeof window === "undefined") return null;

  if (window.solana) return "solana";
  if (window.ethereum) return "ethereum";

  return null;
}
```

### 2. Connection

```typescript
// Using wallet adapter
const wallet = useWallet();

if (!wallet.connected) {
  await wallet.connect();
}
```

### 3. Message Signing

```typescript
// Supabase handles this automatically
// Message includes:
// - Domain verification
// - Timestamp (valid for 10 minutes)
// - Terms of Service statement
// - Wallet address
```

### 4. Session Creation

```typescript
const { data, error } = await signInWithSolanaAdapter(wallet);

if (data?.session) {
  // User is authenticated
  router.push("/dashboard");
}
```

## Session Management

### Get Current Session

```typescript
const supabase = createClient();
const {
  data: { session },
} = await supabase.auth.getSession();

if (session?.user) {
  // User is logged in
}
```

### Get Current User

```typescript
const {
  data: { user },
} = await supabase.auth.getUser();

// Access wallet metadata
const walletAddress = user?.user_metadata?.wallet_metadata?.address;
const chain = user?.user_metadata?.wallet_metadata?.chain;
```

### Sign Out

```typescript
await supabase.auth.signOut();
router.push("/login");
```

## Middleware Protection

```typescript
// middleware.ts automatically handles:
// - Session validation
// - Token refresh
// - Redirect to /login if unauthenticated
// - Works with Web3 sessions automatically
```

## Error Handling

### User Rejection

```typescript
const errorMessage = result.error?.message || "";
const isUserRejection =
  errorMessage.includes("User rejected") ||
  errorMessage.includes("rejected the request") ||
  errorMessage.includes("User cancelled") ||
  error.code === 4001;

if (isUserRejection) {
  return {
    data: null,
    error: "Signature request was cancelled. Please try again when ready.",
  };
}
```

### Network Errors

```typescript
try {
  const result = await signInWithSolanaAdapter(wallet);
} catch (error) {
  console.error("Unexpected error during sign-in:", error);
  return {
    data: null,
    error: "An unexpected error occurred. Please try again.",
  };
}
```

## Security Best Practices

### 1. Message Content

Always include:

- Domain verification
- Terms of Service acceptance
- Timestamp for replay protection

```typescript
statement: "I accept the SSI Automations Terms of Service at https://www.ssiautomations.com/terms";
```

### 2. Session Validation

```typescript
// Middleware validates on every request
// No additional validation needed in components
```

### 3. Rate Limiting

Configure in Supabase dashboard:

- Default: 30 attempts per 5 minutes per IP
- Adjust based on your needs

### 4. No Private Keys

- Wallet adapter never accesses private keys
- All signing happens in wallet extension
- Your app only receives signatures

## User Metadata Structure

```typescript
{
  "wallet_metadata": {
    "address": "Fo73...",
    "chain": "solana",
    "wallet_type": "phantom",
    "connection_method": "browser_extension"
  },
  "session_metadata": {
    "device_type": "desktop",
    "browser": "chrome",
    "timestamp": "2025-10-15T01:47:41Z"
  }
}
```

## Best Practices

1. **Check connection before signing** - Verify `wallet.connected && wallet.publicKey`
2. **Handle user rejections gracefully** - Don't treat as errors
3. **Use middleware for protection** - Don't manually check auth in every component
4. **Store minimal data** - Only what you need
5. **Validate sessions server-side** - Never trust client-side checks
6. **Set appropriate rate limits** - Prevent abuse
7. **Include Terms of Service** - Legal protection

## Anti-Patterns

❌ Manually checking `typeof window !== "undefined"` for auth
❌ Storing wallet private keys or seed phrases
❌ Not handling user rejections gracefully
❌ Checking auth status only on client-side
❌ Not including Terms of Service in signed message
❌ Using same session logic for Web3 and email auth (Supabase handles both)
❌ Hardcoding wallet addresses in code

## Linking Additional Identities

### Add Email to Web3 Account

```typescript
await supabase.auth.updateUser({
  email: "user@example.com",
});
```

### Link Another Provider

```typescript
await supabase.auth.linkIdentity({
  provider: "google",
});
```

## Testing Checklist

- [ ] Wallet connection works
- [ ] Sign-in creates session
- [ ] Session persists on refresh
- [ ] Middleware protects routes
- [ ] Sign-out clears session
- [ ] User rejection handled gracefully
- [ ] Network errors handled
- [ ] Rate limiting works
