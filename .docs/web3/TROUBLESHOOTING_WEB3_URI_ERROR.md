# Troubleshooting: Web3 URI Mismatch Error

## 🚨 Error Message

```
Signed Solana message is using URI which is not allowed on this server,
message was signed for another app
```

## 🎯 Root Cause

This error occurs when **Supabase's Web3 authentication detects a domain mismatch** between:

1. The domain where the user is signing in (e.g., `www.ssiautomations.com`)
2. The domain(s) configured in your Supabase project settings

Supabase validates that the signed message URI matches an allowed domain to prevent signature replay attacks across different applications.

---

## ✅ Solution Steps

### **Step 1: Configure Supabase Site URL**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Update the following settings:

#### **Site URL**

```
https://www.ssiautomations.com
```

#### **Redirect URLs** (Add all variations)

```
https://www.ssiautomations.com/**
https://ssiautomations.com/**
http://localhost:3000/**
```

**Important**: Include both `www` and non-`www` versions if your site is accessible via both.

---

### **Step 2: Verify Environment Variables**

Check your production environment variables in Vercel/Netlify/your hosting platform:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Optional but recommended
NEXT_PUBLIC_SITE_URL=https://www.ssiautomations.com
```

---

### **Step 3: Check Domain Consistency**

Ensure your production deployment is using the correct domain:

1. **Vercel**: Check "Domains" tab in project settings
2. **Netlify**: Check "Domain management" settings
3. Verify SSL certificate is active
4. Confirm redirects (e.g., non-www → www) are working

---

### **Step 4: Clear Browser Cache & Test**

After making Supabase configuration changes:

1. Clear browser cache and cookies
2. Open an incognito/private window
3. Navigate to your login page
4. Attempt Web3 sign-in again

---

## 🔍 Debugging Steps

### **Check Current Domain**

Add temporary logging to verify what domain is being used:

```typescript
// In lib/supabase/web3.ts, before signInWithWeb3 call
console.log("Current domain:", window.location.host);
console.log("Current origin:", window.location.origin);
```

### **Inspect Signature Message**

The signed message includes the domain. Check browser console for the message being signed:

```typescript
// Expected format:
// www.ssiautomations.com wants you to sign in with your Solana account:
// [wallet address]
//
// I accept the SSI Automations Terms of Service at https://www.ssiautomations.com/terms
//
// URI: https://www.ssiautomations.com
// Version: 1
// Chain ID: solana
// Nonce: [random nonce]
// Issued At: [timestamp]
```

### **Check Supabase Logs**

1. Go to Supabase Dashboard
2. Navigate to **Logs** → **Auth Logs**
3. Look for failed authentication attempts
4. Check the error details for domain mismatch info

---

## 🛠️ Common Scenarios

### **Scenario 1: www vs non-www**

**Problem**: Site accessible via both `www.ssiautomations.com` and `ssiautomations.com`

**Solution**:

- Add both to Supabase Redirect URLs
- Set up a redirect rule to canonicalize to one version (recommended: www)

```javascript
// In next.config.mjs
async redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'ssiautomations.com',
        },
      ],
      destination: 'https://www.ssiautomations.com/:path*',
      permanent: true,
    },
  ];
}
```

---

### **Scenario 2: Preview/Staging Deployments**

**Problem**: Vercel/Netlify preview URLs fail authentication

**Solution**: Add preview URL patterns to Supabase:

```
https://*.vercel.app/**
https://*--your-site.netlify.app/**
```

---

### **Scenario 3: Local Development**

**Problem**: Works locally but fails in production

**Solution**: Ensure `localhost:3000` is in Redirect URLs for local testing:

```
http://localhost:3000/**
http://127.0.0.1:3000/**
```

---

## 📋 Verification Checklist

After making changes, verify:

- [ ] Site URL matches your production domain exactly
- [ ] All domain variations added to Redirect URLs
- [ ] Environment variables are correct in production
- [ ] SSL certificate is active
- [ ] Browser cache cleared
- [ ] Test in incognito window
- [ ] Check Supabase Auth logs for errors
- [ ] Verify wallet signature message shows correct domain

---

## 🔐 Security Notes

### **Why This Validation Exists**

Supabase validates the domain to prevent:

1. **Signature Replay Attacks**: A signature from one app can't be used on another
2. **Phishing Protection**: Users can see which domain they're signing in to
3. **Cross-Site Request Forgery**: Ensures requests originate from allowed domains

### **Best Practices**

1. **Use HTTPS in production** (required for Web3 auth)
2. **Limit Redirect URLs** to only necessary domains
3. **Use environment-specific configs** (separate Supabase projects for dev/staging/prod)
4. **Monitor Auth logs** regularly for suspicious activity

---

## 🆘 Still Not Working?

### **Double-Check Configuration**

1. **Supabase Dashboard**:
   - Authentication → URL Configuration
   - Verify Site URL: `https://www.ssiautomations.com`
   - Verify Redirect URLs include: `https://www.ssiautomations.com/**`

2. **Production Environment**:
   - Check actual deployed URL (not preview URL)
   - Verify environment variables are set
   - Confirm build completed successfully

3. **Browser**:
   - Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
   - Clear all cookies for your domain
   - Try different browser

### **Contact Support**

If the issue persists:

1. **Supabase Support**:
   - Include: Project ID, error message, timestamp
   - Provide: Auth logs screenshot
   - Mention: "Web3 Solana authentication URI mismatch"

2. **Check Supabase Status**:
   - Visit: https://status.supabase.com
   - Verify no ongoing incidents

---

## 📝 Example Configuration

### **Supabase Dashboard Settings**

```yaml
Authentication → URL Configuration:

Site URL: https://www.ssiautomations.com

Redirect URLs: https://www.ssiautomations.com/**
  https://ssiautomations.com/**
  http://localhost:3000/**
  http://127.0.0.1:3000/**
```

### **Vercel Environment Variables**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://www.ssiautomations.com
```

---

## 🎯 Expected Behavior After Fix

1. User clicks "Sign in with Solana"
2. Wallet prompts signature with message showing: `www.ssiautomations.com wants you to sign in...`
3. User approves signature
4. Authentication succeeds
5. User redirected to `/dashboard`
6. No URI mismatch errors

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Related Error Codes**: `web3_uri_mismatch`, `domain_not_allowed`
