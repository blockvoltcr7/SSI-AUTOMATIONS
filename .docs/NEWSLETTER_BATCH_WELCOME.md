# Newsletter Batch Welcome Email System

## Overview

The newsletter feature now uses a **batch processing approach** for welcome emails instead of sending them immediately upon signup. This provides better control, reduces API rate limiting issues, and allows for scheduled delivery.

---

## How It Works

### 1. **Signup Flow** (Immediate)

When a user subscribes to the newsletter:

1. User enters email on website
2. Email is validated
3. Check for duplicates
4. Insert into database with `welcomed = false`
5. Return success response to user
6. **No email sent yet** ✅

### 2. **Welcome Email Flow** (Scheduled - Midnight Daily)

A scheduled job (cron/edge function) will:

1. Run at midnight (00:00) every day
2. Query database for `welcomed = false`
3. Batch send welcome emails to all unwelcomed subscribers
4. Update `welcomed = true` for successful sends
5. Log results

---

## Database Schema

### New Column: `welcomed`

```sql
ALTER TABLE newsletter_subscribers
ADD COLUMN welcomed BOOLEAN NOT NULL DEFAULT false;
```

**Purpose**: Track whether a subscriber has received their welcome email

**Values**:

- `false` (default) - Not yet welcomed
- `true` - Welcome email sent successfully

---

## Current Implementation Status

### ✅ Completed

1. **Migration Created**: `supabase/migrations/20251029_add_welcomed_column.sql`
2. **API Updated**: SendGrid logic removed from `/app/api/newsletter/route.ts`
3. **Database Insert**: Now includes `welcomed: false`
4. **Index Created**: For efficient batch queries

### ⏳ To Be Implemented

1. **Scheduled Job**: Cron/edge function to send batch emails
2. **Email Template**: Welcome email content
3. **SendGrid Integration**: Batch sending logic
4. **Error Handling**: Retry logic for failed emails
5. **Monitoring**: Track welcome email metrics

---

## Migration Instructions

### Run the SQL Migration

**Option 1: Supabase Dashboard**

1. Go to SQL Editor in Supabase dashboard
2. Copy contents of `supabase/migrations/20251029_add_welcomed_column.sql`
3. Paste and run
4. Verify success

**Option 2: Copy SQL directly**

```sql
-- Add welcomed column
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS welcomed BOOLEAN NOT NULL DEFAULT false;

-- Add index for batch queries
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_welcomed
ON newsletter_subscribers(welcomed)
WHERE welcomed = false;
```

### Verify Migration

```sql
-- Check column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'newsletter_subscribers'
AND column_name = 'welcomed';

-- Check existing subscribers
SELECT email, welcomed, subscribed_at
FROM newsletter_subscribers
ORDER BY subscribed_at DESC
LIMIT 10;
```

---

## Testing the Updated Flow

### Test 1: New Signup

```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Expected Response:**

```json
{
  "message": "Successfully subscribed to newsletter! You'll receive a welcome email soon.",
  "email": "test@example.com"
}
```

**Expected Database:**

```sql
SELECT email, welcomed FROM newsletter_subscribers WHERE email = 'test@example.com';
-- Result: welcomed = false
```

### Test 2: Check Unwelcomed Subscribers

```sql
SELECT COUNT(*) as unwelcomed_count
FROM newsletter_subscribers
WHERE welcomed = false;
```

This query will be used by the scheduled job to find users needing welcome emails.

---

## Future: Scheduled Job Implementation

### Supabase Edge Function Approach

Create a new edge function that runs on a schedule:

**File**: `supabase/functions/send-welcome-emails/index.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import sgMail from "@sendgrid/mail";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // 1. Find unwelcomed subscribers
  const { data: subscribers } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .eq("welcomed", false)
    .limit(100); // Batch size

  if (!subscribers || subscribers.length === 0) {
    return new Response("No unwelcomed subscribers", { status: 200 });
  }

  // 2. Send welcome emails
  sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY")!);

  const results = await Promise.allSettled(
    subscribers.map((sub) => sendWelcomeEmail(sub.email)),
  );

  // 3. Update welcomed status for successful sends
  const successfulEmails = results
    .filter((r, i) => r.status === "fulfilled")
    .map((_, i) => subscribers[i].email);

  if (successfulEmails.length > 0) {
    await supabase
      .from("newsletter_subscribers")
      .update({ welcomed: true })
      .in("email", successfulEmails);
  }

  return new Response(
    JSON.stringify({
      total: subscribers.length,
      successful: successfulEmails.length,
      failed: subscribers.length - successfulEmails.length,
    }),
    { status: 200 },
  );
});

async function sendWelcomeEmail(email: string) {
  // Welcome email template here
  return sgMail.send({
    to: email,
    from: Deno.env.get("SENDER_EMAIL")!,
    subject: "Welcome to SSI Automations Newsletter!",
    html: "<h1>Welcome!</h1>...",
  });
}
```

### Schedule the Function

```bash
# Deploy edge function
supabase functions deploy send-welcome-emails

# Set up cron schedule (midnight daily)
# In Supabase dashboard: Database → Cron Jobs
# Or via pg_cron extension:
```

```sql
SELECT cron.schedule(
  'send-welcome-emails',
  '0 0 * * *', -- Midnight daily
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/send-welcome-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
  $$
);
```

---

## Benefits of Batch Processing

### Advantages

1. **Rate Limit Control**: Send emails in controlled batches
2. **Error Recovery**: Retry failed emails without blocking signups
3. **Cost Optimization**: Batch operations are more efficient
4. **Monitoring**: Centralized logging and metrics
5. **Flexibility**: Easy to adjust send times
6. **User Experience**: Signups are instant (no waiting for email)

### Trade-offs

1. **Delayed Welcome**: Users don't get instant email
2. **Complexity**: Requires scheduled job infrastructure
3. **Timing**: Users might forget they signed up by midnight

---

## Query Reference

### Find Unwelcomed Subscribers

```sql
SELECT email, subscribed_at
FROM newsletter_subscribers
WHERE welcomed = false
ORDER BY subscribed_at DESC;
```

### Count Unwelcomed Subscribers

```sql
SELECT COUNT(*) as pending_welcomes
FROM newsletter_subscribers
WHERE welcomed = false;
```

### Mark Subscriber as Welcomed

```sql
UPDATE newsletter_subscribers
SET welcomed = true
WHERE email = 'user@example.com';
```

### Reset Welcome Status (Testing)

```sql
-- Reset all to unwelcomed for testing
UPDATE newsletter_subscribers
SET welcomed = false;
```

### Check Welcome Status by Date

```sql
SELECT
  DATE(subscribed_at) as signup_date,
  COUNT(*) as total_signups,
  SUM(CASE WHEN welcomed THEN 1 ELSE 0 END) as welcomed_count,
  SUM(CASE WHEN NOT welcomed THEN 1 ELSE 0 END) as pending_count
FROM newsletter_subscribers
GROUP BY DATE(subscribed_at)
ORDER BY signup_date DESC;
```

---

## Monitoring & Metrics

### Key Metrics to Track

1. **Pending Welcomes**: How many subscribers waiting for welcome email
2. **Welcome Success Rate**: % of emails delivered successfully
3. **Average Wait Time**: Time between signup and welcome email
4. **Daily Signups**: New subscribers per day
5. **Bounce Rate**: Emails that fail to deliver

### Recommended Dashboard Queries

```sql
-- Daily signup and welcome stats
SELECT
  DATE(subscribed_at) as date,
  COUNT(*) as signups,
  SUM(CASE WHEN welcomed THEN 1 ELSE 0 END) as welcomed
FROM newsletter_subscribers
WHERE subscribed_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(subscribed_at)
ORDER BY date DESC;

-- Current pending welcomes
SELECT COUNT(*) as pending_welcomes
FROM newsletter_subscribers
WHERE welcomed = false;

-- Oldest unwelcomed subscriber
SELECT email, subscribed_at,
  NOW() - subscribed_at as waiting_time
FROM newsletter_subscribers
WHERE welcomed = false
ORDER BY subscribed_at ASC
LIMIT 1;
```

---

## Next Steps

1. **Run the migration** in Supabase SQL Editor
2. **Test the updated API** with new signups
3. **Verify `welcomed = false`** in database
4. **Plan scheduled job implementation** (edge function or cron)
5. **Design welcome email template**
6. **Set up monitoring** for batch processing

---

**Last Updated**: 2025-10-29
**Status**: Phase 1 Complete (Database & API Updated)
**Next Phase**: Scheduled job implementation
