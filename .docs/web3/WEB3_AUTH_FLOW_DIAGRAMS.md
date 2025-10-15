# Web3 Authentication Flow Diagrams

## 🔄 Detailed Sequence Diagrams

### **1. Complete Authentication Flow**

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant LoginForm
    participant WalletButton
    participant WalletAdapter
    participant PhantomWallet
    participant Web3Module
    participant Supabase
    participant Middleware
    participant Dashboard

    User->>Browser: Navigate to /login
    Browser->>Middleware: HTTP Request
    Middleware->>Middleware: Check auth session
    Middleware->>Browser: Allow (public route)
    Browser->>LoginForm: Render component
    LoginForm->>LoginForm: Check existing session
    LoginForm->>Browser: Display login options

    User->>WalletButton: Click "Select Wallet"
    WalletButton->>WalletAdapter: Open wallet modal
    WalletAdapter->>Browser: Display wallet list

    User->>PhantomWallet: Select Phantom
    PhantomWallet->>User: Request connection approval
    User->>PhantomWallet: Approve connection
    PhantomWallet->>WalletAdapter: Connection established
    WalletAdapter->>WalletButton: Update state (connected)
    WalletButton->>Browser: Show "Sign in with Solana" button

    User->>WalletButton: Click "Sign in with Solana"
    WalletButton->>Web3Module: signInWithSolanaAdapter(wallet)
    Web3Module->>Web3Module: Validate wallet connection
    Web3Module->>Supabase: auth.signInWithWeb3({chain, statement, wallet})
    Supabase->>PhantomWallet: Request signature

    PhantomWallet->>User: Prompt to sign message
    User->>PhantomWallet: Sign message
    PhantomWallet->>Supabase: Return signature

    Supabase->>Supabase: Verify signature
    Supabase->>Supabase: Create/update user record
    Supabase->>Supabase: Generate session tokens
    Supabase->>Web3Module: Return session data
    Web3Module->>WalletButton: Return success

    WalletButton->>Browser: router.push("/dashboard")
    Browser->>Middleware: Request /dashboard
    Middleware->>Middleware: Validate session
    Middleware->>Dashboard: Allow access
    Dashboard->>User: Display protected content
```

---

### **2. Error Handling Flow**

```mermaid
sequenceDiagram
    actor User
    participant WalletButton
    participant Web3Module
    participant PhantomWallet
    participant Supabase

    User->>WalletButton: Click "Sign in with Solana"
    WalletButton->>Web3Module: signInWithSolanaAdapter(wallet)

    alt Wallet Not Connected
        Web3Module->>WalletButton: Error: "Wallet not connected"
        WalletButton->>User: Display error message
    else User Rejects Signature
        Web3Module->>Supabase: auth.signInWithWeb3()
        Supabase->>PhantomWallet: Request signature
        PhantomWallet->>User: Prompt to sign
        User->>PhantomWallet: Reject/Cancel
        PhantomWallet->>Supabase: User rejection error
        Supabase->>Web3Module: Error: "User rejected"
        Web3Module->>WalletButton: Friendly error message
        WalletButton->>User: "Signature request was cancelled"
    else Network Error
        Web3Module->>Supabase: auth.signInWithWeb3()
        Supabase--xWeb3Module: Network timeout
        Web3Module->>WalletButton: Error: "Network error"
        WalletButton->>User: "Please try again"
    else Success
        Web3Module->>Supabase: auth.signInWithWeb3()
        Supabase->>Web3Module: Session data
        Web3Module->>WalletButton: Success
        WalletButton->>User: Redirect to dashboard
    end
```

---

### **3. Session Management Flow**

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant Middleware
    participant Supabase
    participant Dashboard

    User->>Browser: Request protected route
    Browser->>Middleware: HTTP Request

    Middleware->>Middleware: Create Supabase client
    Middleware->>Supabase: auth.getUser()

    alt Valid Session
        Supabase->>Middleware: User data
        Middleware->>Dashboard: Allow access
        Dashboard->>User: Display content
    else Expired Token
        Supabase->>Supabase: Refresh token
        Supabase->>Middleware: New access token
        Middleware->>Middleware: Update cookies
        Middleware->>Dashboard: Allow access
        Dashboard->>User: Display content
    else No Session
        Supabase->>Middleware: No user
        Middleware->>Browser: Redirect to /login
        Browser->>User: Show login page
    end
```

---

### **4. Metadata Collection Flow**

```mermaid
sequenceDiagram
    participant Web3Module
    participant MetadataModule
    participant WalletAdapter
    participant SolanaRPC
    participant Supabase

    Web3Module->>MetadataModule: collectWeb3Metadata(wallet, request, true)

    MetadataModule->>WalletAdapter: Get wallet info
    WalletAdapter->>MetadataModule: {publicKey, walletName}

    MetadataModule->>MetadataModule: detectWalletType()
    MetadataModule->>MetadataModule: getDeviceInfo(userAgent)

    alt Fetch On-Chain Data Enabled
        MetadataModule->>SolanaRPC: getBalance(publicKey)
        SolanaRPC->>MetadataModule: Balance in lamports

        MetadataModule->>SolanaRPC: getSignaturesForAddress(publicKey)
        SolanaRPC->>MetadataModule: Transaction history

        MetadataModule->>MetadataModule: Calculate wallet age
        MetadataModule->>MetadataModule: assessRisk()
    end

    MetadataModule->>MetadataModule: Build metadata object
    MetadataModule->>Web3Module: Return Web3Metadata
    Web3Module->>Supabase: Store metadata with session
```

---

## 🎯 State Transition Diagrams

### **Wallet Button States**

```
┌─────────────────┐
│   NOT MOUNTED   │
│  (Loading...)   │
└────────┬────────┘
         │
         │ Component mounts
         ▼
┌─────────────────┐
│ NOT CONNECTED   │
│ WalletMultiBtn  │
└────────┬────────┘
         │
         │ User selects wallet
         │ & approves connection
         ▼
┌─────────────────┐
│   CONNECTED     │
│ "Sign in with   │
│    Solana"      │
└────────┬────────┘
         │
         │ User clicks sign in
         ▼
┌─────────────────┐
│    LOADING      │
│  "Signing in"   │
│   (Spinner)     │
└────────┬────────┘
         │
         ├─ Success ──────────┐
         │                    ▼
         │              ┌──────────┐
         │              │REDIRECTING│
         │              │    to     │
         │              │ Dashboard │
         │              └──────────┘
         │
         └─ Error ───────────┐
                             ▼
                    ┌─────────────────┐
                    │ ERROR DISPLAYED │
                    │  (Stay on page) │
                    └────────┬────────┘
                             │
                             │ User retries
                             ▼
                    ┌─────────────────┐
                    │   CONNECTED     │
                    │ (Ready to retry)│
                    └─────────────────┘
```

---

### **Authentication State Machine**

```
┌──────────────┐
│ UNAUTHENTICATED │
└───────┬────────┘
        │
        ├─ Email/OTP Flow ────┐
        │                     ▼
        │            ┌──────────────┐
        │            │ OTP SENT     │
        │            │ (Verify code)│
        │            └──────┬───────┘
        │                   │
        │                   │ Code verified
        │                   ▼
        │            ┌──────────────┐
        │            │ AUTHENTICATED│
        │            └──────────────┘
        │
        └─ Web3 Flow ────────┐
                             ▼
                    ┌──────────────────┐
                    │ WALLET CONNECTING│
                    └────────┬─────────┘
                             │
                             │ Connected
                             ▼
                    ┌──────────────────┐
                    │ SIGNING MESSAGE  │
                    └────────┬─────────┘
                             │
                             │ Signed
                             ▼
                    ┌──────────────────┐
                    │  AUTHENTICATED   │
                    └──────────────────┘
```

---

## 🔐 Security Flow

### **Cryptographic Signature Verification**

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. User initiates sign-in                              │
│     ↓                                                    │
│  2. App requests signature from wallet                  │
│     ↓                                                    │
│  3. Wallet generates message:                           │
│     "I accept the SSI Automations Terms of Service..."  │
│     + Nonce (timestamp)                                 │
│     + Domain                                            │
│     ↓                                                    │
│  4. User approves signature request                     │
│     ↓                                                    │
│  5. Wallet signs message with private key               │
│     (Private key NEVER leaves wallet)                   │
│     ↓                                                    │
│  6. Signature + Public Key sent to Supabase             │
│                                                          │
└──────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌──────────────────────────────────────────────────────────┐
│                    SERVER SIDE                           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  7. Supabase receives:                                  │
│     - Message                                           │
│     - Signature                                         │
│     - Public Key                                        │
│     ↓                                                    │
│  8. Verify signature using public key                   │
│     (Cryptographic proof of ownership)                  │
│     ↓                                                    │
│  9. Check nonce to prevent replay attacks               │
│     ↓                                                    │
│ 10. Verify domain matches                               │
│     ↓                                                    │
│ 11. Create/retrieve user by wallet address              │
│     ↓                                                    │
│ 12. Generate session tokens                             │
│     - Access token (short-lived)                        │
│     - Refresh token (long-lived)                        │
│     ↓                                                    │
│ 13. Return session to client                            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│   Storage   │
│  (Cookies)  │
└──────┬──────┘
       │
       │ Session Tokens
       │
       ▼
┌─────────────────────────────────────┐
│      Supabase Client (Browser)      │
│  - Manages auth state               │
│  - Handles token refresh            │
│  - Provides auth context            │
└──────┬──────────────────────────────┘
       │
       │ API Calls
       │
       ▼
┌─────────────────────────────────────┐
│      Supabase Auth Service          │
│  - Validates tokens                 │
│  - Refreshes expired tokens         │
│  - Manages user sessions            │
└──────┬──────────────────────────────┘
       │
       │ Database Queries
       │
       ▼
┌─────────────────────────────────────┐
│      PostgreSQL Database            │
│  ┌─────────────────────────────┐   │
│  │ auth.users                  │   │
│  │ - id (UUID)                 │   │
│  │ - wallet_address (unique)   │   │
│  │ - created_at                │   │
│  │ - last_sign_in_at           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ auth.sessions               │   │
│  │ - id (UUID)                 │   │
│  │ - user_id (FK)              │   │
│  │ - access_token              │   │
│  │ - refresh_token             │   │
│  │ - expires_at                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ public.user_metadata        │   │
│  │ - user_id (FK)              │   │
│  │ - wallet_type               │   │
│  │ - device_type               │   │
│  │ - risk_score                │   │
│  │ - sol_balance               │   │
│  │ - wallet_age_days           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 🔄 Token Refresh Mechanism

```
┌────────────────────────────────────────────────────────┐
│              TOKEN LIFECYCLE                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  User Signs In                                         │
│       ↓                                                │
│  ┌──────────────────────────────────────┐            │
│  │ Access Token (1 hour)                │            │
│  │ Refresh Token (30 days)              │            │
│  └──────────────────────────────────────┘            │
│       ↓                                                │
│  Tokens stored in HTTP-only cookies                   │
│       ↓                                                │
│  User makes requests (45 minutes pass)                │
│       ↓                                                │
│  ┌──────────────────────────────────────┐            │
│  │ Access Token: Still valid            │            │
│  │ Requests succeed                     │            │
│  └──────────────────────────────────────┘            │
│       ↓                                                │
│  User makes request (65 minutes pass)                 │
│       ↓                                                │
│  ┌──────────────────────────────────────┐            │
│  │ Access Token: EXPIRED                │            │
│  │ Middleware detects expiration        │            │
│  └──────────────────────────────────────┘            │
│       ↓                                                │
│  Middleware calls auth.getUser()                      │
│       ↓                                                │
│  ┌──────────────────────────────────────┐            │
│  │ Supabase checks refresh token        │            │
│  │ Refresh token: VALID                 │            │
│  │ Generate new access token            │            │
│  └──────────────────────────────────────┘            │
│       ↓                                                │
│  New access token set in cookies                      │
│       ↓                                                │
│  Request continues with new token                     │
│       ↓                                                │
│  User experience: SEAMLESS (no re-login)              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🎭 User Journey Map

```
┌─────────────────────────────────────────────────────────────┐
│                    FIRST-TIME USER                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Discovers SSI Automations                              │
│     Emotion: 😊 Curious                                     │
│     ↓                                                       │
│  2. Clicks "Get Started" → Lands on /login                 │
│     Emotion: 🤔 Evaluating options                          │
│     ↓                                                       │
│  3. Sees "Select Wallet" button                            │
│     Emotion: 😃 Excited (has Phantom wallet)                │
│     ↓                                                       │
│  4. Clicks button → Wallet modal appears                   │
│     Emotion: 😌 Familiar interface                          │
│     ↓                                                       │
│  5. Selects Phantom → Approves connection                  │
│     Emotion: 🔒 Feels secure (knows this flow)              │
│     ↓                                                       │
│  6. Clicks "Sign in with Solana"                           │
│     Emotion: ⚡ Fast and easy                               │
│     ↓                                                       │
│  7. Signs message in wallet                                │
│     Emotion: ✅ Confident (no password needed)              │
│     ↓                                                       │
│  8. Redirected to dashboard                                │
│     Emotion: 🎉 Delighted (instant access)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   RETURNING USER                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Visits SSI Automations                                 │
│     Emotion: 😊 Familiar                                    │
│     ↓                                                       │
│  2. Middleware checks session                              │
│     Session: VALID                                         │
│     ↓                                                       │
│  3. Auto-redirected to dashboard                           │
│     Emotion: 🚀 Seamless (no login needed)                  │
│     ↓                                                       │
│  4. Continues work                                         │
│     Emotion: 💯 Productive                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Companion to**: WEB3_AUTH_SYSTEM_DOCUMENTATION.md
