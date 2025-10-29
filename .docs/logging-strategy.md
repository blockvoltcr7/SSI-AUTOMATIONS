# Logging Strategy

## Overview

This project implements a structured logging system with multiple log levels for debugging, monitoring, and troubleshooting in development and production environments.

## Log Levels

The logging utility supports four log levels, from most to least verbose:

1. **DEBUG** - Detailed technical information for debugging
2. **INFO** - General informational messages about application flow
3. **WARN** - Warning messages for recoverable issues
4. **ERROR** - Error messages with full stack traces

## Configuration

### Environment Variables

Set the `LOG_LEVEL` environment variable to control which logs are displayed:

```bash
# .env.local or .env
LOG_LEVEL=DEBUG   # Show all logs (development default)
LOG_LEVEL=INFO    # Show INFO, WARN, ERROR (production default)
LOG_LEVEL=WARN    # Show only WARN and ERROR
LOG_LEVEL=ERROR   # Show only ERROR logs
```

**Default behavior:**

- Development (`NODE_ENV=development`): `LOG_LEVEL=DEBUG`
- Production (`NODE_ENV=production`): `LOG_LEVEL=INFO`

## Usage

### Basic Usage

```typescript
import { logger } from "@/lib/logger";

// Info-level logging
logger.info("CategoryName", "Something happened", { userId: 123 });

// Debug-level logging (only in development)
logger.debug("CategoryName", "Detailed debug info", { requestId: "abc123" });

// Warning logging
logger.warn("CategoryName", "Something unusual", { retryCount: 3 });

// Error logging with error object
logger.error("CategoryName", "Operation failed", error, { userId: 123 });
```

### Scoped Logger

Create a scoped logger for a specific feature or module:

```typescript
import { logger } from "@/lib/logger";

// Create scoped logger
const log = logger.scope("Newsletter");

// All logs will be prefixed with [Newsletter]
log.info("User subscribed", { email: "user@example.com" });
log.debug("Checking database", { table: "newsletter_subscribers" });
log.error("Failed to send email", error);
```

## Log Format

All logs follow this structured format:

```
[TIMESTAMP] [LEVEL] [CATEGORY] MESSAGE {CONTEXT}
```

**Example:**

```
[2025-10-29T21:10:35.123Z] [INFO] [Newsletter] User subscribed {
  "email": "user@example.com",
  "requestId": "abc123"
}
```

## Newsletter Feature Logging

The newsletter signup flow includes comprehensive logging at every step:

### Request Flow Logs

1. **Request received**

   ```
   [INFO] [Newsletter] [abc123] Incoming POST request to /api/newsletter
   ```

2. **Rate limiting**

   ```
   [DEBUG] [Newsletter] [abc123] Checking rate limit
   [DEBUG] [Newsletter] [abc123] Rate limit check passed
   ```

3. **Request parsing**

   ```
   [DEBUG] [Newsletter] [abc123] Parsing request body
   [INFO] [Newsletter] [abc123] Request body parsed { "email": "provided" }
   ```

4. **Email validation**

   ```
   [DEBUG] [Newsletter] [abc123] Validating email format
   [INFO] [Newsletter] [abc123] Email validation passed { "email": "user@example.com" }
   ```

5. **Database operations**

   ```
   [DEBUG] [Newsletter] [abc123] Creating Supabase client
   [DEBUG] [Newsletter] [abc123] Supabase client created successfully
   [DEBUG] [Newsletter] [abc123] Checking for existing subscription
   [INFO] [Newsletter] [abc123] No existing subscription found - proceeding with insert
   [DEBUG] [Newsletter] [abc123] Inserting new subscriber into database
   [INFO] [Newsletter] [abc123] Successfully inserted subscriber into database
   ```

6. **Email sending**

   ```
   [DEBUG] [Newsletter] [abc123] Preparing welcome email
   [INFO] [Newsletter] [abc123] Sending welcome email via SendGrid
   [INFO] [Newsletter] [abc123] Welcome email sent successfully
   ```

7. **Completion**
   ```
   [INFO] [Newsletter] [abc123] Newsletter subscription completed successfully
   ```

### Error Scenarios

**Invalid email:**

```
[WARN] [Newsletter] [abc123] Email validation failed: Invalid format { "email": "invalid" }
```

**Duplicate subscription:**

```
[WARN] [Newsletter] [abc123] Duplicate subscription attempt { "email": "user@example.com" }
```

**Database error:**

```
[ERROR] [Newsletter] [abc123] Database error inserting subscriber {
  "email": "user@example.com",
  "error": {
    "name": "PostgrestError",
    "message": "Connection failed",
    "stack": "..."
  }
}
```

**Rate limit exceeded:**

```
[WARN] [Newsletter] [abc123] Rate limit exceeded
```

## Best Practices

### DO:

✅ Use scoped loggers for features

```typescript
const log = logger.scope("FeatureName");
```

✅ Include request IDs for tracing

```typescript
const requestId = Math.random().toString(36).substring(7);
log.info(`[${requestId}] Processing request`);
```

✅ Log both successes and failures

```typescript
log.info("Operation successful", { result });
log.error("Operation failed", error, { context });
```

✅ Include relevant context

```typescript
log.info("User action", { userId, action, timestamp });
```

✅ Use appropriate log levels

```typescript
log.debug("Technical details"); // Development only
log.info("Flow milestones"); // Normal operations
log.warn("Recoverable issues"); // Issues that don't break flow
log.error("Failures"); // Operations that failed
```

### DON'T:

❌ Log sensitive data

```typescript
// BAD: Don't log passwords, tokens, credit cards
log.info("User login", { password: "..." });

// GOOD: Mask or omit sensitive data
log.info("User login", { email: user.email });
```

❌ Log excessively in production

```typescript
// BAD: Too verbose for production
log.debug("Variable x is", { x: 1 });
log.debug("Variable y is", { y: 2 });

// GOOD: Use INFO for important milestones only
log.info("Calculation completed", { result });
```

❌ Swallow errors silently

```typescript
// BAD: No visibility into errors
try {
  await operation();
} catch (error) {
  // Silent failure
}

// GOOD: Log all errors
try {
  await operation();
} catch (error) {
  log.error("Operation failed", error);
}
```

## Monitoring in Development

Watch your terminal for logs when testing:

```bash
npm run dev
```

You'll see logs appear in real-time:

```
[2025-10-29T21:10:35.123Z] [INFO] [Newsletter] Initializing SendGrid...
 GET / 200 in 150ms
[2025-10-29T21:10:40.456Z] [INFO] [Newsletter] [abc123] Incoming POST request...
[2025-10-29T21:10:40.500Z] [INFO] [Newsletter] [abc123] Newsletter subscription completed
 POST /api/newsletter 200 in 45ms
```

## Production Monitoring

In production, logs are output to stdout and can be collected by logging services:

- **Vercel**: Automatic log collection in dashboard
- **Custom hosting**: Use tools like Winston, Pino, or cloud logging services
- **Log aggregation**: Consider services like Datadog, LogRocket, or Sentry

## Debugging Tips

### Enable DEBUG logs temporarily

```bash
# In .env.local
LOG_LEVEL=DEBUG
```

### Filter logs by category

```bash
# Terminal (macOS/Linux)
npm run dev 2>&1 | grep "\[Newsletter\]"
```

### Check for errors only

```bash
# Terminal (macOS/Linux)
npm run dev 2>&1 | grep "\[ERROR\]"
```

### Follow request flow

Look for the request ID in brackets (e.g., `[abc123]`) to trace a single request through all log messages.

## Adding Logging to New Features

When implementing new features, follow this pattern:

```typescript
import { logger } from "@/lib/logger";

// Create scoped logger
const log = logger.scope("FeatureName");

export async function myFeature(input: string) {
  const requestId = Math.random().toString(36).substring(7);

  log.info(`[${requestId}] Starting feature operation`, { input });

  try {
    log.debug(`[${requestId}] Step 1: Validation`);
    // ... validation logic

    log.debug(`[${requestId}] Step 2: Processing`);
    // ... processing logic

    log.info(`[${requestId}] Feature operation completed`, { result });
    return result;
  } catch (error) {
    log.error(`[${requestId}] Feature operation failed`, error, { input });
    throw error;
  }
}
```

## Related Files

- **Logger utility**: `/lib/logger.ts`
- **Newsletter API with logging**: `/app/api/newsletter/route.ts`
- **Environment config**: `.env.local`, `.env`

## Future Enhancements

Potential improvements to the logging system:

- [ ] Structured JSON logging for production
- [ ] Integration with external logging services (Datadog, Sentry)
- [ ] Log sampling/rate limiting in production
- [ ] Request correlation IDs across services
- [ ] Performance metrics logging
- [ ] User action audit trail
