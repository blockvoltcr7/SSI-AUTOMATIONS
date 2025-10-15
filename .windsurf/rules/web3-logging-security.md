---
trigger: model_decision
description: when making logging and security changes related to web3
---

# Web3 Logging & Security Best Practices

## What to Log (Recommended)

### Priority 1: Security Essentials

```typescript
{
  "wallet_metadata": {
    "address": "Fo73...",
    "chain": "solana",
    "wallet_type": "phantom",
    "connection_method": "browser_extension"
  },
  "session_metadata": {
    "ip_address_hash": "abc123...",  // HASHED, not plain
    "user_agent": "Mozilla/5.0...",
    "device_type": "desktop",
    "browser": "chrome",
    "timestamp": "2025-10-15T01:47:41Z"
  },
  "authentication": {
    "sign_in_count": 5,
    "first_sign_in": "2025-10-15T01:14:23Z",
    "last_sign_in": "2025-10-15T01:47:41Z"
  }
}
```

### Priority 2: Risk Assessment (Optional)

```typescript
{
  "risk_assessment": {
    "is_new_wallet": false,
    "wallet_age_days": 280,
    "risk_score": "low",  // low, medium, high
    "has_activity": true
  }
}
```

## What NOT to Log (Critical)

### Never Store

❌ Private keys
❌ Seed phrases
❌ Wallet passwords
❌ Unencrypted PII
❌ Full credit card numbers
❌ Social security numbers

### Be Careful With

⚠️ Full IP addresses (always hash or anonymize)
⚠️ Precise location data (requires consent)
⚠️ Full transaction history (privacy concern)
⚠️ Wallet balances (sensitive information)
⚠️ Browsing history

## Security Requirements

### 1. Data Encryption

```typescript
// Encrypt sensitive fields
const encryptedIP = await encrypt(ipAddress, process.env.ENCRYPTION_KEY);
```

### 2. Data Retention

```typescript
{
  "retention_policy": {
    "ip_addresses": "90 days",      // GDPR requirement
    "session_logs": "1 year",
    "user_metadata": "indefinite"
  }
}
```

### 3. Access Control

```sql
-- Row-level security in Supabase
CREATE POLICY "Users can only see their own data"
ON users FOR SELECT
USING (auth.uid() = id);
```

## Privacy Compliance

### GDPR (Europe)

- ✅ Get consent for data collection
- ✅ Allow users to export data
- ✅ Allow users to delete data
- ✅ Anonymize after retention period

### CCPA (California)

- ✅ Disclose data collection
- ✅ Allow opt-out
- ✅ Don't sell user data
- ✅ Provide data access

## Implementation Pattern

```typescript
// Use the metadata collector
import { collectWeb3Metadata } from "@/lib/supabase/web3-metadata";

// During sign-in
const metadata = await collectWeb3Metadata(
  wallet,
  request,
  false, // Set to true to fetch on-chain data (slower)
);

// Store in Supabase
await supabase.auth.updateUser({
  data: metadata,
});
```

## Best Practices

1. **Hash IP addresses** - Never store plain IPs
2. **Minimize data collection** - Only collect what you need
3. **Set retention policies** - Auto-delete old data
4. **Encrypt sensitive fields** - Use proper encryption
5. **Implement access controls** - Row-level security
6. **Document data usage** - Privacy policy
7. **Allow data export** - GDPR requirement
8. **Allow data deletion** - User right to be forgotten

## Anti-Patterns

❌ Storing unencrypted sensitive data
❌ Keeping data indefinitely without retention policy
❌ Logging private keys or seed phrases
❌ Collecting data without user consent
❌ Sharing user data with third parties without consent
