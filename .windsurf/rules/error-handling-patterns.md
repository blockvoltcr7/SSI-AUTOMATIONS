---
trigger: model_decision
description: when attempting to perform error handling for web3 integrations
---

# Error Handling Patterns for Web3

## User Actions vs System Errors

Always distinguish between user-initiated cancellations and actual system errors.

### Detection Pattern

```typescript
// Detect user rejections
const errorMessage = error.message || "";
const isUserRejection =
  errorMessage.includes("User rejected") ||
  errorMessage.includes("rejected the request") ||
  errorMessage.includes("User cancelled") ||
  error.code === 4001; // Standard error code for user rejection

if (isUserRejection) {
  // Don't log as error - this is normal behavior
  return {
    data: null,
    error: "Signature request was cancelled. Please try again when ready.",
  };
}

// Log actual errors
console.error("Wallet sign-in error:", error);
```

### Visual Feedback

```tsx
{
  error && (
    <p
      className={`text-xs text-center ${
        error.includes("cancelled") || error.includes("rejected")
          ? "text-amber-600 dark:text-amber-400" // Amber for cancellations
          : "text-red-500 dark:text-red-400" // Red for actual errors
      }`}
    >
      {error}
    </p>
  );
}
```

## Error Classification

### User Actions (Amber Warning)

- User clicks "Reject" in wallet
- User clicks "Cancel" in wallet
- User closes wallet popup
- Error code 4001

**Message**: "Signature request was cancelled. Please try again when ready."

### System Errors (Red Error)

- Network issues
- Wallet connection problems
- Authentication failures
- Invalid signatures

**Message**: Specific error message from the system

## Best Practices

1. **Never log user cancellations as errors** - They're normal user behavior
2. **Use amber color for warnings** - "Something you did, no problem"
3. **Use red color for errors** - "Something went wrong, needs attention"
4. **Provide actionable messages** - Tell users what to do next
5. **Don't alarm users** - Cancellations are not failures

## Anti-Patterns

❌ Logging all rejections to console as errors
❌ Using red color for user cancellations
❌ Generic error messages that don't help users
❌ Treating cancellations the same as system failures
