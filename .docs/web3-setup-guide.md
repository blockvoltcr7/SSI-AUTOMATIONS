# Web3 Authentication Setup Guide

## Quick Start

This guide will help you enable Web3 authentication for your SSI Automations application.

## Prerequisites

- Supabase project with Auth enabled
- `@supabase/supabase-js` version 2.75.0 or higher ✅ (Already installed)
- `@supabase/ssr` version 0.7.0 or higher ✅ (Already installed)

## Step 1: Enable Web3 in Supabase Dashboard

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Scroll down to find **Web3 Wallet**
5. Toggle **Enable Web3 Wallet** to ON
6. Configure the following:
   - ✅ Enable Solana
   - ✅ Enable Ethereum
7. Click **Save**

## Step 2: Configure Redirect URLs

1. In the Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add the following to **Redirect URLs**:
   ```
   http://localhost:3000/login
   http://localhost:3000/**
   https://yourdomain.com/login
   https://yourdomain.com/**
   ```
3. Click **Save**

## Step 3: Configure Rate Limits (Recommended)

1. Go to **Authentication** → **Rate Limits**
2. Set **Web3 Login Rate Limit**: `30` (per 5 minutes per IP)
3. Click **Save**

## Step 4: Test Locally

### Install a Web3 Wallet

Choose one:

- **Phantom** (Solana): https://phantom.app/
- **MetaMask** (Ethereum): https://metamask.io/

### Start Development Server

```bash
pnpm run dev
```

### Test the Flow

1. Open http://localhost:3000/login
2. You should see:
   - Email input field with "Send verification code" button
   - "OR" divider
   - "Sign in with Web3" button (animated purple border)
3. Click **"Sign in with Web3"**
4. Your wallet will prompt you to:
   - Connect (if not already connected)
   - Sign a message
5. After signing, you'll be redirected to `/dashboard`

## Step 5: Verify Authentication

Check that the session is created:

```typescript
// In any component
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const {
  data: { session },
} = await supabase.auth.getSession();
console.log("User:", session?.user);
```

## Troubleshooting

### Button shows "No Web3 Wallet Detected"

**Solution**: Install Phantom or MetaMask browser extension and refresh the page.

### "Failed to sign in with Web3"

**Possible causes**:

1. Web3 provider not enabled in Supabase dashboard
2. Redirect URLs not configured
3. Rate limit exceeded
4. Wallet not unlocked

**Check**:

```bash
# Check browser console for errors
# Check Supabase logs in dashboard
```

### Wallet connects but no session created

**Solution**:

1. Verify your Supabase project has Web3 enabled
2. Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set in `.env`
3. Ensure middleware is running (check `middleware.ts`)

### TypeScript errors

**Solution**:

```bash
pnpm run type-check
```

If errors persist, ensure you have the latest types:

```bash
pnpm install @supabase/supabase-js@latest @supabase/ssr@latest
```

## Production Deployment

### Environment Variables

Ensure these are set in your production environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### Update Redirect URLs

Add your production domain to Supabase redirect URLs:

```
https://yourdomain.com/login
https://yourdomain.com/**
```

### Security Checklist

- ✅ Rate limiting enabled (30 per 5 minutes recommended)
- ✅ Redirect URLs configured for production domain
- ✅ HTTPS enabled on production
- ✅ Environment variables secured
- ✅ Middleware protecting authenticated routes

## Advanced Configuration

### Custom Statement

Edit `lib/supabase/web3.ts` to customize the sign-in message:

```typescript
statement: "I accept the SSI Automations Terms of Service at https://www.ssiautomations.com/terms";
```

### Wallet Priority

By default, Solana wallets are prioritized. To change this, edit `detectWeb3Wallet()` in `lib/supabase/web3.ts`:

```typescript
export function detectWeb3Wallet(): "solana" | "ethereum" | null {
  // Prioritize Ethereum instead
  if (isEthereumWalletAvailable()) {
    return "ethereum";
  }

  if (isSolanaWalletAvailable()) {
    return "solana";
  }

  return null;
}
```

### Link Email to Web3 Account

After Web3 sign-in, allow users to add an email:

```typescript
const { error } = await supabase.auth.updateUser({
  email: "user@example.com",
});
```

## Files Modified

✅ Created:

- `lib/supabase/web3.ts` - Web3 authentication utilities
- `docs/web3-authentication.md` - Detailed documentation
- `docs/web3-setup-guide.md` - This setup guide

✅ Modified:

- `lib/supabase/index.ts` - Added Web3 exports
- `lib/supabase/README.md` - Updated with Web3 usage
- `components/login.tsx` - Added Web3 sign-in button and logic

✅ No changes needed:

- `middleware.ts` - Already handles Web3 sessions
- `lib/supabase/middleware.ts` - Already validates all auth types

## Next Steps

1. ✅ Enable Web3 in Supabase Dashboard
2. ✅ Configure redirect URLs
3. ✅ Install a wallet (Phantom or MetaMask)
4. ✅ Test locally
5. ✅ Deploy to production
6. ✅ Update production redirect URLs

## Support

- [Supabase Web3 Docs](https://supabase.com/docs/guides/auth/auth-web3)
- [Phantom Documentation](https://docs.phantom.com/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [EIP-4361 Standard](https://eips.ethereum.org/EIPS/eip-4361)

## Testing Checklist

- [ ] Web3 provider enabled in Supabase
- [ ] Redirect URLs configured
- [ ] Wallet installed (Phantom or MetaMask)
- [ ] Dev server running (`pnpm run dev`)
- [ ] Can see "Sign in with Web3" button
- [ ] Button triggers wallet connection
- [ ] Wallet prompts for signature
- [ ] After signing, redirected to dashboard
- [ ] Session persists on page refresh
- [ ] Can access protected routes
- [ ] Logout works correctly
