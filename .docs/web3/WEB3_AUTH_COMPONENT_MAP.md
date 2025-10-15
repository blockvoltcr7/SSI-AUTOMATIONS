# Web3 Authentication - Component Interaction Map

## 🗺️ Complete System Map

### **Component Hierarchy**

```
app/(auth)/login/page.tsx
  └─ components/login.tsx (LoginForm)
      ├─ Email/OTP Form
      └─ components/solana-wallet-button.tsx (SolanaWalletButton)
          └─ @solana/wallet-adapter-react-ui (WalletMultiButton)

app/(auth)/layout.tsx
  └─ context/solana-wallet-provider.tsx (SolanaWalletProvider)
      └─ layouts/auth-layout.tsx (AuthLayout)
          └─ {children}
```

---

## 📦 Component Details

### **Presentation Layer**

#### **`app/(auth)/login/page.tsx`**

- **Type**: Server Component
- **Purpose**: Login route entry point
- **Exports**: `LoginPage` (default)
- **Key Features**: Sets metadata, renders LoginForm

#### **`components/login.tsx`**

- **Type**: Client Component
- **Purpose**: Main authentication UI
- **State**: `isLoading`, `error`, `form`
- **Dependencies**: `SolanaWalletButton`, Supabase client, react-hook-form, zod
- **Key Functions**:
  - `onSubmit()`: Email/OTP flow
  - `useEffect()`: Session check on mount

#### **`components/solana-wallet-button.tsx`**

- **Type**: Client Component
- **Purpose**: Wallet connection & auth UI
- **State**: `isLoading`, `error`, `mounted`, `wallet`
- **Dependencies**: `useWallet`, `signInWithSolanaAdapter`, `WalletMultiButton`
- **Rendering States**: Not mounted → Not connected → Connected → Loading → Success/Error

---

### **Context Layer**

#### **`context/solana-wallet-provider.tsx`**

- **Type**: Client Component
- **Purpose**: Provides wallet context
- **Configuration**: RPC endpoint, network, wallet adapters
- **Supported Wallets**: Phantom, Solflare, Torus, Ledger
- **Provider Stack**: ConnectionProvider → WalletProvider → WalletModalProvider

---

### **Business Logic Layer**

#### **`lib/supabase/web3.ts`**

- **Purpose**: Web3 authentication logic
- **Key Function**: `signInWithSolanaAdapter(wallet)`
  - Validates wallet connection
  - Calls `supabase.auth.signInWithWeb3()`
  - Handles errors gracefully
  - Returns `{ data, error }`

#### **`lib/supabase/web3-metadata.ts`**

- **Purpose**: Metadata collection
- **Key Function**: `collectWeb3Metadata(wallet, request?, fetchOnChain?)`
  - Collects wallet info, device info, on-chain data
  - Assesses risk score
  - Returns `Web3Metadata` object

---

### **Data Access Layer**

#### **`lib/supabase/client.ts`**

- **Purpose**: Browser-side Supabase client
- **Usage**: Client components
- **Features**: Automatic cookie management

#### **`lib/supabase/server.ts`**

- **Purpose**: Server-side Supabase client
- **Usage**: Server components, API routes, middleware
- **Features**: Manual cookie management via Next.js API

---

### **Middleware Layer**

#### **`middleware.ts`**

- **Purpose**: Middleware entry point
- **Execution**: Every request (except static files)
- **Delegates to**: `updateSession()`

#### **`lib/supabase/middleware.ts`**

- **Purpose**: Session validation & route protection
- **Key Function**: `updateSession(request)`
  - Validates session
  - Refreshes expired tokens
  - Protects routes
  - Redirects unauthenticated users

---

### **API Layer**

#### **`app/api/auth/signout/route.ts`**

- **Method**: POST
- **Purpose**: Sign out endpoint
- **Flow**: Create client → Sign out → Redirect to /login

---

## 🔄 Data Flow

### **Authentication Sequence**

```
1. User clicks "Select Wallet"
   → SolanaWalletButton state update
   → WalletMultiButton modal opens

2. User selects wallet
   → WalletAdapter connects
   → wallet.connected = true
   → UI updates to show sign-in button

3. User clicks "Sign in with Solana"
   → handleSignIn() called
   → signInWithSolanaAdapter(wallet)

4. Signature request
   → supabase.auth.signInWithWeb3()
   → Wallet prompts user
   → User signs message

5. Authentication
   → Supabase validates signature
   → Creates session
   → Returns tokens

6. Redirect
   → router.push("/dashboard")
   → Middleware validates session
   → Access granted
```

---

## 🔐 Security Flow

### **Token Management**

```
Sign In
  ↓
Access Token (1 hour) + Refresh Token (30 days)
  ↓
Stored in HTTP-only cookies
  ↓
Middleware validates on each request
  ↓
If expired: Refresh using refresh token
  ↓
New access token issued
  ↓
Seamless user experience
```

---

## 📊 State Management

### **Component State**

**SolanaWalletButton**:

- `mounted`: Prevents hydration mismatch
- `isLoading`: Sign-in process state
- `error`: Error messages
- `wallet`: From `useWallet()` hook

**LoginForm**:

- `isLoading`: Form submission state
- `error`: Error messages
- `form`: Form state from react-hook-form

### **Global State (Context)**

**WalletContext** (from Wallet Adapter):

- `connected`: boolean
- `connecting`: boolean
- `publicKey`: PublicKey | null
- `wallet`: Wallet | null
- `connect()`, `disconnect()`, `signMessage()`

---

## 🎯 Integration Points

### **External Dependencies**

1. **Solana Wallet Adapter**
   - Provides wallet context
   - Handles multi-wallet support
   - Manages wallet connections

2. **Supabase Auth**
   - Validates signatures
   - Manages sessions
   - Stores user data

3. **Next.js**
   - Middleware for route protection
   - Cookie management
   - Server/client rendering

4. **Solana RPC** (optional)
   - On-chain data queries
   - Balance checks
   - Transaction history

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Companion to**: WEB3_AUTH_SYSTEM_DOCUMENTATION.md
