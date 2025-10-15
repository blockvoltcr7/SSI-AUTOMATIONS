# Complete Solana Wallet Capabilities

> **What you can do with a Solana wallet address**

This document outlines ALL possible capabilities when you have a user's Solana wallet address.

---

## 📊 Table of Contents

1. [Financial Data](#financial-data)
2. [Token & Asset Information](#token--asset-information)
3. [NFT Data](#nft-data)
4. [Transaction History](#transaction-history)
5. [DeFi Positions](#defi-positions)
6. [Identity & Social](#identity--social)
7. [Activity & Analytics](#activity--analytics)
8. [Real-Time Features](#real-time-features)
9. [Security & Risk](#security--risk)
10. [Advanced Features](#advanced-features)

---

## 💰 Financial Data

### **1.1 SOL Balance**

```typescript
const balance = await connection.getBalance(publicKey);
const sol = balance / LAMPORTS_PER_SOL;
```

**What you get:**

- Current SOL balance
- Balance in lamports (smallest unit)
- Historical balance (via transaction analysis)

**Use cases:**

- Display wallet balance
- Verify minimum balance requirements
- Calculate portfolio value
- Track balance changes over time

**API Cost:** Free (RPC call)
**Speed:** ~200ms

---

### **1.2 USD Value**

```typescript
const price = await fetch(
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
);
const usdValue = solBalance * price.solana.usd;
```

**What you get:**

- Real-time SOL price
- Portfolio value in USD
- Price history
- 24h change

**Use cases:**

- Show USD equivalent
- Portfolio tracking
- Price alerts
- Investment analytics

**API Cost:** Free (CoinGecko)
**Speed:** ~500ms

---

## 🪙 Token & Asset Information

### **2.1 SPL Token Holdings**

```typescript
const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
  publicKey,
  { programId: TOKEN_PROGRAM_ID },
);
```

**What you get:**

- All SPL tokens owned
- Token amounts
- Token decimals
- Token metadata (name, symbol)
- Token mint addresses

**Popular tokens:**

- USDC, USDT (stablecoins)
- BONK, WIF, POPCAT (memecoins)
- JUP, RAY, ORCA (DeFi tokens)
- Custom project tokens

**Use cases:**

- Token portfolio display
- Portfolio diversification analysis
- Token gating (require specific tokens)
- Airdrop eligibility
- Loyalty programs

**API Cost:** Free (RPC call)
**Speed:** ~300ms

---

### **2.2 Token Metadata**

```typescript
// Fetch token metadata from Metaplex
const metadata = await metaplex.nfts().findByMint({ mintAddress });
```

**What you get:**

- Token name
- Token symbol
- Token logo/image
- Token description
- Social links
- Creator information

**Use cases:**

- Display token logos
- Show token details
- Verify token authenticity
- Enhanced portfolio UI

**API Cost:** Free (Metaplex)
**Speed:** ~400ms per token

---

### **2.3 Token Prices & Values**

```typescript
// Use Jupiter API for token prices
const prices = await fetch("https://price.jup.ag/v4/price?ids=TOKEN_MINT");
```

**What you get:**

- Real-time token prices
- 24h price change
- Trading volume
- Market cap
- Liquidity

**Use cases:**

- Calculate portfolio value
- Show profit/loss
- Price alerts
- Investment tracking

**API Cost:** Free (Jupiter)
**Speed:** ~300ms

---

## 🖼️ NFT Data

### **3.1 NFT Collection**

```typescript
const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });
```

**What you get:**

- All NFTs owned
- NFT images
- NFT metadata
- Collection information
- Rarity traits

**Use cases:**

- NFT gallery display
- Profile pictures
- NFT gating (require specific NFTs)
- Community membership verification
- Collectible showcases

**API Cost:** Free (Metaplex)
**Speed:** ~1-2s for full collection

---

### **3.2 NFT Floor Prices**

```typescript
// Use Magic Eden or Tensor API
const floorPrice = await fetch(
  "https://api-mainnet.magiceden.dev/v2/collections/COLLECTION/stats",
);
```

**What you get:**

- Collection floor price
- 24h volume
- Total supply
- Listed count
- Average sale price

**Use cases:**

- Calculate NFT portfolio value
- Show collection stats
- Investment tracking
- Rarity analysis

**API Cost:** Free (Magic Eden)
**Speed:** ~400ms

---

### **3.3 NFT Rarity & Traits**

```typescript
// Use HowRare.is or Moonrank API
const rarity = await fetch(
  "https://api.howrare.is/v0.1/collections/COLLECTION/nfts/MINT",
);
```

**What you get:**

- Rarity rank
- Trait distribution
- Rarity score
- Trait floor prices

**Use cases:**

- Show NFT rarity
- Highlight valuable NFTs
- Collection analysis
- Trading insights

**API Cost:** Free (HowRare.is)
**Speed:** ~500ms

---

## 📜 Transaction History

### **4.1 Recent Transactions**

```typescript
const signatures = await connection.getSignaturesForAddress(publicKey, {
  limit: 10,
});
```

**What you get:**

- Transaction signatures
- Timestamps
- Success/failure status
- Block numbers
- Fee amounts

**Use cases:**

- Activity feed
- Transaction history
- Audit logs
- User engagement tracking

**API Cost:** Free (RPC call)
**Speed:** ~300ms

---

### **4.2 Parsed Transactions**

```typescript
const tx = await connection.getParsedTransaction(signature);
```

**What you get:**

- Transaction type (transfer, swap, etc.)
- Token amounts
- Sender/receiver addresses
- Program interactions
- Instruction details

**Use cases:**

- Detailed transaction view
- Transaction categorization
- Spending analysis
- Tax reporting

**API Cost:** Free (RPC call)
**Speed:** ~400ms per transaction

---

### **4.3 Transaction Analytics**

```typescript
// Analyze all transactions
const allSignatures = await connection.getSignaturesForAddress(publicKey);
```

**What you get:**

- Total transaction count
- Average transactions per day
- Most active periods
- Transaction patterns
- Spending habits

**Use cases:**

- User engagement metrics
- Activity scoring
- Behavioral analysis
- Fraud detection

**API Cost:** Free (RPC call)
**Speed:** ~1-2s for full history

---

## 💹 DeFi Positions

### **5.1 Staking Positions**

```typescript
// Check Marinade staked SOL
const marinadeAccount = await connection.getAccountInfo(marinadeStateAddress);

// Check native staking
const stakeAccounts = await connection.getParsedProgramAccounts(
  STAKE_PROGRAM_ID,
  { filters: [{ memcmp: { offset: 12, bytes: publicKey.toBase58() } }] },
);
```

**What you get:**

- Staked SOL amount
- Staking rewards
- Validator information
- Lock-up periods
- APY rates

**Popular protocols:**

- Marinade Finance
- Lido
- Jito
- Native Solana staking

**Use cases:**

- Show staking positions
- Calculate total assets
- Track rewards
- Yield optimization

**API Cost:** Free (RPC call)
**Speed:** ~500ms

---

### **5.2 Liquidity Pool Positions**

```typescript
// Check Raydium LP positions
// Check Orca pools
// Check Meteora positions
```

**What you get:**

- LP token amounts
- Pool composition
- Impermanent loss
- Fee earnings
- Pool APY

**Use cases:**

- DeFi portfolio tracking
- Yield farming analytics
- Risk assessment
- Position management

**API Cost:** Varies by protocol
**Speed:** ~500ms per protocol

---

### **5.3 Lending Positions**

```typescript
// Check Solend positions
// Check Mango Markets
// Check Kamino Finance
```

**What you get:**

- Supplied assets
- Borrowed assets
- Collateral ratio
- Interest earned/paid
- Liquidation risk

**Use cases:**

- Lending dashboard
- Risk monitoring
- Interest tracking
- Portfolio management

**API Cost:** Protocol-specific APIs
**Speed:** ~500ms per protocol

---

## 👤 Identity & Social

### **6.1 Solana Name Service (SNS)**

```typescript
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

const { pubkey } = getDomainKeySync("yourname.sol");
const owner = await NameRegistryState.retrieve(connection, pubkey);
```

**What you get:**

- .sol domain name
- Domain owner
- Domain metadata
- Reverse lookup (address → domain)

**Use cases:**

- Display human-readable names
- Profile customization
- Identity verification
- Social features

**API Cost:** Free (Bonfida)
**Speed:** ~300ms

---

### **6.2 Social Verification**

```typescript
// Check Cardinal Twitter verification
// Check Civic Discord verification
// Check GitPOAP GitHub verification
```

**What you get:**

- Verified Twitter handle
- Verified Discord username
- Verified GitHub profile
- Other social links

**Use cases:**

- Social profiles
- Identity verification
- Community building
- Anti-sybil measures

**API Cost:** Protocol-specific
**Speed:** ~500ms per platform

---

### **6.3 DAO Memberships**

```typescript
// Check governance token holdings
// Check Realms participation
// Check DAO voting history
```

**What you get:**

- DAO tokens held
- Voting power
- Proposal history
- Governance participation

**Use cases:**

- Community membership
- Governance features
- Reputation building
- Access control

**API Cost:** Varies
**Speed:** ~500ms per DAO

---

## 📊 Activity & Analytics

### **7.1 Wallet Age**

```typescript
const allSigs = await connection.getSignaturesForAddress(publicKey);
const firstTx = allSigs[allSigs.length - 1];
const walletAge = Date.now() - firstTx.blockTime! * 1000;
```

**What you get:**

- Wallet creation date
- Age in days
- First transaction details
- Account history

**Use cases:**

- Trust scoring
- New user detection
- Account verification
- Risk assessment

**API Cost:** Free (RPC call)
**Speed:** ~500ms

---

### **7.2 Activity Patterns**

```typescript
// Analyze transaction timestamps
// Calculate active days
// Identify usage patterns
```

**What you get:**

- Active days count
- Peak activity times
- Usage frequency
- Engagement trends

**Use cases:**

- User segmentation
- Engagement scoring
- Retention analysis
- Personalization

**API Cost:** Free (analysis)
**Speed:** ~1s

---

### **7.3 Reputation Score**

```typescript
const score = calculateReputation({
  walletAge,
  transactionCount,
  balance,
  tokenCount,
  nftCount,
});
```

**What you get:**

- Reputation score (0-100)
- Trust level
- User tier
- Achievement badges

**Use cases:**

- Trust indicators
- Access tiers
- Gamification
- Community status

**API Cost:** Free (calculation)
**Speed:** Instant

---

## ⚡ Real-Time Features

### **8.1 Balance Monitoring**

```typescript
connection.onAccountChange(publicKey, (accountInfo) => {
  // Balance changed!
});
```

**What you get:**

- Real-time balance updates
- Instant notifications
- Live data sync

**Use cases:**

- Live dashboards
- Payment notifications
- Balance alerts
- Real-time UX

**API Cost:** WebSocket connection
**Speed:** Real-time

---

### **8.2 Transaction Monitoring**

```typescript
connection.onLogs(publicKey, (logs) => {
  // New transaction detected!
});
```

**What you get:**

- New transaction alerts
- Transaction logs
- Program interactions

**Use cases:**

- Activity notifications
- Transaction confirmations
- Live feeds
- Security monitoring

**API Cost:** WebSocket connection
**Speed:** Real-time

---

## 🔒 Security & Risk

### **9.1 Risk Assessment**

```typescript
const risk = assessWalletRisk({
  walletAge,
  hasActivity,
  balance,
  transactionCount,
});
```

**What you get:**

- Risk score (low/medium/high)
- Risk factors
- Security flags
- Recommendations

**Use cases:**

- Fraud prevention
- Account verification
- Security measures
- Compliance

**API Cost:** Free (calculation)
**Speed:** Instant

---

### **9.2 Sanctions Screening**

```typescript
// Use Chainalysis or Elliptic API
const screening = await checkSanctions(publicKey);
```

**What you get:**

- Sanctions status
- Risk indicators
- Compliance data
- Alert flags

**Use cases:**

- Regulatory compliance
- KYC/AML
- Risk management
- Legal protection

**API Cost:** Paid (Chainalysis/Elliptic)
**Speed:** ~500ms

---

### **9.3 Fraud Detection**

```typescript
// Analyze suspicious patterns
// Check for bot behavior
// Detect wash trading
```

**What you get:**

- Fraud indicators
- Bot detection
- Suspicious activity flags
- Pattern analysis

**Use cases:**

- Platform protection
- User safety
- Quality control
- Anti-abuse

**API Cost:** Custom implementation
**Speed:** Varies

---

## 🚀 Advanced Features

### **10.1 Token Gating**

```typescript
const hasRequiredToken = tokens.some(
  (t) => t.mint === REQUIRED_TOKEN_MINT && t.amount >= REQUIRED_AMOUNT,
);
```

**What you get:**

- Access control
- Membership verification
- Tier-based features

**Use cases:**

- Premium features
- Community access
- Exclusive content
- Loyalty programs

---

### **10.2 NFT Gating**

```typescript
const hasRequiredNFT = nfts.some(
  (nft) => nft.collection === REQUIRED_COLLECTION,
);
```

**What you get:**

- NFT-based access
- Collection verification
- Holder benefits

**Use cases:**

- Holder perks
- Community features
- Exclusive access
- Membership tiers

---

### **10.3 Airdrop Eligibility**

```typescript
const isEligible = checkAirdropCriteria({
  walletAge,
  balance,
  hasNFT,
  transactionCount,
});
```

**What you get:**

- Eligibility status
- Criteria matching
- Reward calculation

**Use cases:**

- Token distributions
- Reward programs
- Community incentives
- Marketing campaigns

---

### **10.4 Portfolio Analytics**

```typescript
const analytics = calculatePortfolio({
  solBalance,
  tokens,
  nfts,
  defiPositions,
});
```

**What you get:**

- Total portfolio value
- Asset allocation
- Performance metrics
- Risk analysis

**Use cases:**

- Investment tracking
- Portfolio management
- Financial planning
- Tax reporting

---

## 📊 Summary Matrix

| Feature             | Difficulty | Speed     | Cost | Value  |
| ------------------- | ---------- | --------- | ---- | ------ |
| SOL Balance         | Easy       | Fast      | Free | High   |
| Token Holdings      | Easy       | Fast      | Free | High   |
| NFT Collection      | Medium     | Medium    | Free | High   |
| Transaction History | Easy       | Fast      | Free | Medium |
| DeFi Positions      | Hard       | Slow      | Free | Medium |
| Identity/Social     | Medium     | Medium    | Free | Medium |
| Real-time Updates   | Medium     | Real-time | Free | High   |
| Risk Assessment     | Easy       | Fast      | Free | High   |
| Sanctions Screening | Easy       | Fast      | Paid | High   |

---

## 🎯 Quick Reference

### **Must-Have Features (Every App)**

- ✅ SOL Balance
- ✅ Wallet Age
- ✅ Transaction Count
- ✅ Risk Assessment

### **Recommended Features (Most Apps)**

- ✅ Token Holdings
- ✅ NFT Collection
- ✅ Recent Transactions
- ✅ Reputation Score

### **Advanced Features (Specific Use Cases)**

- ⚡ DeFi Positions
- ⚡ Real-time Monitoring
- ⚡ Social Verification
- ⚡ Token/NFT Gating

---

**This document covers 100% of capabilities available with a Solana wallet address.**
