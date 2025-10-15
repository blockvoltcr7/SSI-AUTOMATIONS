# Web3 Authentication Integration

## Overview

This application supports Web3 wallet authentication using Supabase's Web3 Auth feature. Users can sign in with their Solana or Ethereum wallets instead of traditional email/password authentication.

## Supported Wallets

### Solana Wallets

- **Phantom** (recommended)
- **Brave Wallet**
- Any wallet that implements the Solana wallet standard

### Ethereum Wallets

- **MetaMask** (recommended)
- Any wallet that implements the EIP-6963 standard

## How It Works

1. **Wallet Detection**: The app automatically detects available Web3 wallets in the browser
2. **User Clicks "Sign in with Web3"**: The button triggers the authentication flow
3. **Wallet Connection**: For Solana wallets, the app connects to the wallet
4. **Message Signing**: The wallet prompts the user to sign a message (EIP-4361 standard)
5. **Verification**: Supabase verifies the signature and creates a session
6. **Redirect**: User is redirected to the dashboard upon successful authentication

## Implementation Details

### Files Modified/Created

#### New Files

- `lib/supabase/web3.ts` - Web3 authentication utilities
- `docs/web3-authentication.md` - This documentation

#### Modified Files

- `lib/supabase/index.ts` - Added Web3 exports
- `lib/supabase/README.md` - Updated with Web3 usage examples
- `components/login.tsx` - Added Web3 sign-in button and handler

### Key Functions

#### `signInWithWeb3()`

Auto-detects the available wallet and signs in the user.

```typescript
import { signInWithWeb3 } from "@/lib/supabase/web3";

const { data, error } = await signInWithWeb3();
if (data?.session) {
  // User is authenticated
  router.push("/dashboard");
}
```

#### `signInWithSolana()`

Specifically signs in with a Solana wallet.

```typescript
import { signInWithSolana } from "@/lib/supabase/web3";

const { data, error } = await signInWithSolana();
```

#### `signInWithEthereum()`

Specifically signs in with an Ethereum wallet.

```typescript
import { signInWithEthereum } from "@/lib/supabase/web3";

const { data, error } = await signInWithEthereum();
```

#### `detectWeb3Wallet()`

Returns the type of wallet available ('solana', 'ethereum', or null).

```typescript
import { detectWeb3Wallet } from "@/lib/supabase/web3";

const walletType = detectWeb3Wallet();
if (walletType === "solana") {
  // Solana wallet available
}
```

## Supabase Configuration Required

### Dashboard Configuration

1. Navigate to your Supabase project dashboard
2. Go to **Authentication** → **Providers**
3. Enable **Web3 Wallet** provider
4. Configure settings:
   - Enable Solana
   - Enable Ethereum
   - Set rate limits (recommended: 30 per 5 minutes)

### Redirect URLs

Add your application URLs to the allowed redirect URLs:

- `http://localhost:3000/login`
- `https://yourdomain.com/login`
- Or use a wildcard: `https://yourdomain.com/**`

### CLI Configuration (Optional)

If using Supabase CLI, add to `supabase/config.toml`:

```toml
[auth.web3.solana]
enabled = true

[auth.web3.ethereum]
enabled = true

[auth.rate_limit]
# Number of Web3 logins per 5 minutes per IP
web3 = 30
```

## Security Considerations

### Message Signing

The app uses the EIP-4361 standard for secure message signing. The message includes:

- Wallet address
- Timestamp (valid for 10 minutes)
- Domain verification
- Custom statement (Terms of Service acceptance)

### Rate Limiting

Web3 authentication is rate-limited to prevent abuse:

- Default: 30 attempts per 5 minutes per IP address
- Configure in Supabase dashboard or config.toml

### No Email/Phone

Users authenticated via Web3 don't have email or phone numbers. To add these:

```typescript
// Link an email after Web3 sign-in
await supabase.auth.updateUser({ email: "user@example.com" });

// Or link another identity
await supabase.auth.linkIdentity({ provider: "google" });
```

## User Experience

### With Wallet Installed

1. User sees "Sign in with Web3" button
2. Clicks button
3. Wallet popup appears asking to sign message
4. User approves
5. Redirected to dashboard

### Without Wallet

1. Button shows "No Web3 Wallet Detected"
2. Help text appears with links to install Phantom or MetaMask
3. Button is disabled until wallet is installed

## Middleware Handling

The existing middleware (`middleware.ts` and `lib/supabase/middleware.ts`) automatically handles Web3 sessions:

- Refreshes tokens on each request
- Validates sessions
- Redirects unauthenticated users to `/login`
- No changes needed for Web3 support

## Testing

### Local Testing with Phantom (Solana)

1. Install [Phantom browser extension](https://phantom.app/)
2. Create or import a wallet
3. Navigate to `http://localhost:3000/login`
4. Click "Sign in with Web3"
5. Approve the signature request in Phantom
6. Verify redirect to dashboard

### Local Testing with MetaMask (Ethereum)

1. Install [MetaMask browser extension](https://metamask.io/)
2. Create or import a wallet
3. Navigate to `http://localhost:3000/login`
4. Click "Sign in with Web3"
5. Approve the signature request in MetaMask
6. Verify redirect to dashboard

## Troubleshooting

### "No Web3 wallet detected"

- Ensure Phantom or MetaMask is installed
- Refresh the page after installing
- Check browser console for errors

### "Failed to sign in with Web3"

- Check Supabase dashboard: Web3 provider must be enabled
- Verify redirect URLs are configured
- Check rate limits haven't been exceeded
- Ensure wallet is unlocked

### Session not persisting

- Check middleware is running on all routes
- Verify cookies are being set correctly
- Check browser console for cookie errors

## Future Enhancements

Potential improvements:

- Multi-wallet selector UI
- Wallet connection status indicator
- Link Web3 identity to existing email accounts
- Display wallet address in user profile
- Support for additional wallet types (e.g., Coinbase Wallet)

## Resources

- [Supabase Web3 Auth Docs](https://supabase.com/docs/guides/auth/auth-web3)
- [EIP-4361 Standard](https://eips.ethereum.org/EIPS/eip-4361)
- [Phantom Wallet Docs](https://docs.phantom.com/)
- [MetaMask Docs](https://docs.metamask.io/)
