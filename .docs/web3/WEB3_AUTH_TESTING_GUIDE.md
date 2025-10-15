# Web3 Authentication - Testing & QA Guide

## 🧪 Test Coverage Overview

### **Test Categories**

1. **Unit Tests**: Individual function testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Full user journey testing
4. **Security Tests**: Vulnerability & attack vector testing
5. **Performance Tests**: Load & response time testing

---

## ✅ Test Cases

### **1. Wallet Detection Tests**

#### **TC-001: Detect Phantom Wallet**

- **Precondition**: Phantom extension installed
- **Steps**: Navigate to /login
- **Expected**: Phantom appears in wallet list
- **Priority**: High

#### **TC-002: No Wallet Installed**

- **Precondition**: No wallet extensions installed
- **Steps**: Navigate to /login, click "Select Wallet"
- **Expected**: Empty wallet list or install prompt
- **Priority**: High

#### **TC-003: Multiple Wallets Installed**

- **Precondition**: Phantom + Solflare installed
- **Steps**: Click "Select Wallet"
- **Expected**: Both wallets appear in list
- **Priority**: Medium

---

### **2. Wallet Connection Tests**

#### **TC-004: Successful Connection**

- **Precondition**: Phantom installed
- **Steps**:
  1. Click "Select Wallet"
  2. Select Phantom
  3. Approve connection in wallet
- **Expected**: "Sign in with Solana" button appears
- **Priority**: Critical

#### **TC-005: User Rejects Connection**

- **Precondition**: Phantom installed
- **Steps**:
  1. Click "Select Wallet"
  2. Select Phantom
  3. Reject connection in wallet
- **Expected**: Error message displayed, can retry
- **Priority**: High

#### **TC-006: Wallet Locked**

- **Precondition**: Phantom installed but locked
- **Steps**: Click "Select Wallet", select Phantom
- **Expected**: Wallet prompts for password
- **Priority**: Medium

---

### **3. Authentication Tests**

#### **TC-007: Successful Sign-In**

- **Precondition**: Wallet connected
- **Steps**:
  1. Click "Sign in with Solana"
  2. Approve signature in wallet
- **Expected**: Redirect to /dashboard
- **Priority**: Critical

#### **TC-008: User Rejects Signature**

- **Precondition**: Wallet connected
- **Steps**:
  1. Click "Sign in with Solana"
  2. Reject signature in wallet
- **Expected**: Amber error message: "Signature request was cancelled"
- **Priority**: High

#### **TC-009: Network Error During Sign-In**

- **Precondition**: Wallet connected, network disconnected
- **Steps**:
  1. Disconnect internet
  2. Click "Sign in with Solana"
- **Expected**: Error message with retry option
- **Priority**: High

#### **TC-010: Sign-In Without Connection**

- **Precondition**: Wallet not connected
- **Steps**: Attempt to trigger sign-in
- **Expected**: Error: "Please connect your wallet first"
- **Priority**: Medium

---

### **4. Session Management Tests**

#### **TC-011: Session Persistence**

- **Precondition**: User authenticated
- **Steps**:
  1. Navigate to /dashboard
  2. Refresh page
- **Expected**: User remains authenticated
- **Priority**: Critical

#### **TC-012: Token Refresh**

- **Precondition**: User authenticated, access token expired
- **Steps**: Make request after 1+ hour
- **Expected**: Token refreshed automatically, no re-login
- **Priority**: Critical

#### **TC-013: Expired Refresh Token**

- **Precondition**: User authenticated, refresh token expired (30+ days)
- **Steps**: Make request after 30+ days
- **Expected**: Redirect to /login
- **Priority**: High

#### **TC-014: Concurrent Sessions**

- **Precondition**: User authenticated in Browser A
- **Steps**: Sign in with same wallet in Browser B
- **Expected**: Both sessions valid
- **Priority**: Medium

---

### **5. Route Protection Tests**

#### **TC-015: Access Protected Route (Authenticated)**

- **Precondition**: User authenticated
- **Steps**: Navigate to /dashboard
- **Expected**: Dashboard loads
- **Priority**: Critical

#### **TC-016: Access Protected Route (Unauthenticated)**

- **Precondition**: User not authenticated
- **Steps**: Navigate to /dashboard
- **Expected**: Redirect to /login
- **Priority**: Critical

#### **TC-017: Access Public Route (Unauthenticated)**

- **Precondition**: User not authenticated
- **Steps**: Navigate to /about
- **Expected**: Page loads without redirect
- **Priority**: High

#### **TC-018: Auto-Redirect on Login Page**

- **Precondition**: User already authenticated
- **Steps**: Navigate to /login
- **Expected**: Redirect to /dashboard
- **Priority**: Medium

---

### **6. Sign-Out Tests**

#### **TC-019: Successful Sign-Out**

- **Precondition**: User authenticated
- **Steps**:
  1. Click sign-out button
  2. Confirm sign-out
- **Expected**: Redirect to /login, session cleared
- **Priority**: High

#### **TC-020: Sign-Out Error Handling**

- **Precondition**: User authenticated, network disconnected
- **Steps**: Attempt to sign out
- **Expected**: Error message displayed
- **Priority**: Medium

---

### **7. UI/UX Tests**

#### **TC-021: Loading States**

- **Precondition**: Wallet connected
- **Steps**: Click "Sign in with Solana"
- **Expected**: Button shows spinner + "Signing in..." text
- **Priority**: Medium

#### **TC-022: Error Display**

- **Precondition**: Any error condition
- **Steps**: Trigger error
- **Expected**: Error message displayed in appropriate color
- **Priority**: Medium

#### **TC-023: Hydration Safety**

- **Precondition**: None
- **Steps**: Load /login page
- **Expected**: No hydration mismatch errors in console
- **Priority**: High

#### **TC-024: Mobile Responsiveness**

- **Precondition**: Mobile device or viewport
- **Steps**: Navigate to /login
- **Expected**: UI adapts to mobile screen
- **Priority**: Medium

---

### **8. Security Tests**

#### **TC-025: CSRF Protection**

- **Precondition**: User authenticated
- **Steps**: Attempt cross-site request
- **Expected**: Request blocked
- **Priority**: Critical

#### **TC-026: XSS Prevention**

- **Precondition**: None
- **Steps**: Inject script in error message
- **Expected**: Script not executed
- **Priority**: Critical

#### **TC-027: Session Hijacking**

- **Precondition**: User authenticated
- **Steps**: Copy session cookie to different browser
- **Expected**: Session invalid or additional verification required
- **Priority**: Critical

#### **TC-028: Replay Attack**

- **Precondition**: Captured signature
- **Steps**: Attempt to reuse old signature
- **Expected**: Authentication fails (nonce validation)
- **Priority**: Critical

---

### **9. Metadata Collection Tests**

#### **TC-029: Basic Metadata Collection**

- **Precondition**: Wallet connected
- **Steps**: Sign in
- **Expected**: Wallet address, type, device info collected
- **Priority**: Medium

#### **TC-030: On-Chain Data Collection**

- **Precondition**: fetchOnChain enabled
- **Steps**: Sign in
- **Expected**: Balance, wallet age, activity collected
- **Priority**: Low

#### **TC-031: Risk Assessment**

- **Precondition**: New wallet (<7 days)
- **Steps**: Sign in
- **Expected**: Risk score calculated correctly
- **Priority**: Low

---

### **10. Edge Cases**

#### **TC-032: Wallet Disconnects During Sign-In**

- **Precondition**: Wallet connected
- **Steps**:
  1. Click "Sign in with Solana"
  2. Disconnect wallet before signing
- **Expected**: Error handled gracefully
- **Priority**: Medium

#### **TC-033: Browser Back Button After Sign-In**

- **Precondition**: User just signed in
- **Steps**: Click browser back button
- **Expected**: Redirect to /dashboard (already authenticated)
- **Priority**: Low

#### **TC-034: Multiple Sign-In Attempts**

- **Precondition**: Wallet connected
- **Steps**: Click "Sign in with Solana" multiple times rapidly
- **Expected**: Only one request processed
- **Priority**: Medium

#### **TC-035: Wallet Address Change**

- **Precondition**: User authenticated with Wallet A
- **Steps**: Switch to Wallet B in extension
- **Expected**: Session remains valid or prompts re-auth
- **Priority**: Medium

---

## 🔧 Test Implementation

### **Unit Test Example (Jest)**

```typescript
// lib/supabase/__tests__/web3.test.ts

import { signInWithSolanaAdapter } from "../web3";
import { createClient } from "../client";

jest.mock("../client");

describe("signInWithSolanaAdapter", () => {
  it("should return error when wallet not connected", async () => {
    const mockWallet = {
      connected: false,
      publicKey: null,
    } as any;

    const result = await signInWithSolanaAdapter(mockWallet);

    expect(result.error).toBe(
      "Wallet not connected. Please connect your wallet first.",
    );
    expect(result.data).toBeNull();
  });

  it("should handle user rejection gracefully", async () => {
    const mockWallet = {
      connected: true,
      publicKey: { toBase58: () => "mock-address" },
    } as any;

    const mockSupabase = {
      auth: {
        signInWithWeb3: jest.fn().mockResolvedValue({
          error: { message: "User rejected the request" },
          data: null,
        }),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    const result = await signInWithSolanaAdapter(mockWallet);

    expect(result.error).toBe(
      "Signature request was cancelled. Please try again when ready.",
    );
  });
});
```

---

### **Integration Test Example (React Testing Library)**

```typescript
// components/__tests__/solana-wallet-button.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SolanaWalletButton } from '../solana-wallet-button';
import { useWallet } from '@solana/wallet-adapter-react';
import { signInWithSolanaAdapter } from '@/lib/supabase/web3';

jest.mock('@solana/wallet-adapter-react');
jest.mock('@/lib/supabase/web3');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('SolanaWalletButton', () => {
  it('should show WalletMultiButton when not connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: false,
      publicKey: null,
    });

    render(<SolanaWalletButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show sign-in button when connected', () => {
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: { toBase58: () => 'mock-address' },
    });

    render(<SolanaWalletButton />);

    expect(screen.getByText(/Sign in with Solana/i)).toBeInTheDocument();
  });

  it('should handle sign-in success', async () => {
    const mockPush = jest.fn();
    (useWallet as jest.Mock).mockReturnValue({
      connected: true,
      publicKey: { toBase58: () => 'mock-address' },
    });
    (signInWithSolanaAdapter as jest.Mock).mockResolvedValue({
      data: { session: {} },
      error: null,
    });

    render(<SolanaWalletButton />);

    fireEvent.click(screen.getByText(/Sign in with Solana/i));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });
});
```

---

### **E2E Test Example (Playwright)**

```typescript
// tests/e2e/web3-auth.spec.ts

import { test, expect } from "@playwright/test";

test.describe("Web3 Authentication", () => {
  test("should complete sign-in flow with Phantom wallet", async ({
    page,
    context,
  }) => {
    // Navigate to login page
    await page.goto("/login");

    // Click "Select Wallet" button
    await page.click("text=Select Wallet");

    // Wait for wallet modal
    await page.waitForSelector('[role="dialog"]');

    // Select Phantom wallet
    await page.click("text=Phantom");

    // Mock wallet approval (in real test, use Phantom's test mode)
    // ... wallet interaction ...

    // Verify "Sign in with Solana" button appears
    await expect(page.locator("text=Sign in with Solana")).toBeVisible();

    // Click sign-in button
    await page.click("text=Sign in with Solana");

    // Mock signature approval
    // ... wallet interaction ...

    // Verify redirect to dashboard
    await expect(page).toHaveURL("/dashboard");

    // Verify user is authenticated
    const cookies = await context.cookies();
    const authCookie = cookies.find((c) => c.name.includes("auth"));
    expect(authCookie).toBeDefined();
  });

  test("should handle signature rejection", async ({ page }) => {
    await page.goto("/login");

    // ... connect wallet ...

    await page.click("text=Sign in with Solana");

    // Mock signature rejection
    // ... wallet interaction ...

    // Verify error message
    await expect(
      page.locator("text=Signature request was cancelled"),
    ).toBeVisible();

    // Verify still on login page
    await expect(page).toHaveURL("/login");
  });
});
```

---

## 📊 Test Execution

### **Running Tests**

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# E2E tests (requires running dev server)
npm run test:e2e

# Specific test file
npm run test -- web3.test.ts
```

---

### **Coverage Requirements**

- **Critical paths**: 100% coverage
- **Business logic**: 90%+ coverage
- **UI components**: 80%+ coverage
- **Overall**: 85%+ coverage

---

## 🐛 Bug Report Template

```markdown
### Bug Report

**Title**: [Brief description]

**Priority**: Critical / High / Medium / Low

**Environment**:

- Browser: [Chrome 120 / Firefox 121 / etc.]
- OS: [macOS 14 / Windows 11 / etc.]
- Wallet: [Phantom 23.1.0 / etc.]

**Steps to Reproduce**:

1. Navigate to /login
2. Click "Select Wallet"
3. ...

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots/Videos**:
[Attach if applicable]

**Console Errors**:
```

[Paste console errors]

```

**Network Logs**:
[Attach HAR file or relevant network requests]

**Additional Context**:
[Any other relevant information]
```

---

## ✅ QA Checklist

### **Pre-Release Checklist**

- [ ] All critical test cases pass
- [ ] No console errors on happy path
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete (Chrome, Firefox, Safari, Brave)
- [ ] Wallet compatibility verified (Phantom, Solflare, Ledger)
- [ ] Error messages are user-friendly
- [ ] Loading states work correctly
- [ ] Session persistence verified
- [ ] Token refresh tested
- [ ] Route protection verified
- [ ] Sign-out flow tested
- [ ] Security tests pass
- [ ] Performance benchmarks met
- [ ] Accessibility audit complete
- [ ] Documentation updated

---

## 🎯 Performance Benchmarks

### **Target Metrics**

- **Page Load**: <2 seconds (login page)
- **Wallet Connection**: <1 second
- **Sign-In Process**: <5 seconds (including signature)
- **Token Refresh**: <500ms
- **Middleware Execution**: <100ms

### **Monitoring**

```typescript
// Example performance monitoring
console.time("sign-in-flow");

await signInWithSolanaAdapter(wallet);

console.timeEnd("sign-in-flow");
// Expected: <5000ms
```

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-15  
**Maintained By**: QA & Engineering Teams
