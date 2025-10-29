# SendGrid Setup & Troubleshooting Guide

## Current Issue: "Unauthorized" Error

The newsletter feature is getting an "Unauthorized" error from SendGrid. This guide will help you resolve it.

---

## Quick Fix Checklist

### ✅ Step 1: Verify Sender Email in SendGrid

**Why this matters**: SendGrid requires you to verify the email address you're sending from.

1. Go to SendGrid Dashboard: https://app.sendgrid.com/settings/sender_auth
2. Click **"Verify a Single Sender"**
3. Fill in the form:
   - **From Name**: SSI Automations (or your company name)
   - **From Email Address**: `sami@ssiautomations.com` (must match `SENDER_EMAIL` in `.env.local`)
   - **Reply To**: Same as From Email
   - **Company Address**: Your business address
   - **Nickname**: SSI Automations Newsletter
4. Click **"Create"**
5. **Check your email** for verification link
6. Click the link to verify

**Important**: The `SENDER_EMAIL` in your `.env.local` MUST match the verified email in SendGrid.

### ✅ Step 2: Check API Key Permissions

1. Go to https://app.sendgrid.com/settings/api_keys
2. Find your API key (or create a new one)
3. Ensure it has **"Mail Send"** permission (at minimum)
4. If creating new key:
   - Name: "SSI Automations Newsletter"
   - Permissions: **Full Access** or at least **Mail Send**
   - Copy the key immediately (you won't see it again!)

### ✅ Step 3: Update Environment Variables

Edit `.env.local`:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-actual-api-key-here
SENDER_EMAIL=sami@ssiautomations.com  # Must be verified in SendGrid!
```

**Critical**:

- `SENDER_EMAIL` must match the email you verified in Step 1
- `SENDGRID_API_KEY` must have "Mail Send" permission

### ✅ Step 4: Restart Dev Server

```bash
# Kill current server
pkill -f "next dev"

# Clear cache and restart
npm run clear-cache && npm run dev
```

### ✅ Step 5: Test Newsletter Signup

```bash
# Test via curl
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test-email@example.com"}'
```

**Expected response**:

```json
{
  "message": "Successfully subscribed to newsletter!",
  "email": "your-test-email@example.com"
}
```

**Check logs** for:

```
[INFO] [Newsletter] Welcome email sent successfully
```

---

## Common Issues & Solutions

### Issue 1: "Unauthorized" Error

**Cause**: API key is invalid or doesn't have permissions

**Solutions**:

1. Generate a new API key in SendGrid dashboard
2. Ensure it has "Mail Send" permission
3. Copy it immediately (shown only once)
4. Update `.env.local` with new key
5. Restart server

### Issue 2: "Forbidden" or "Bad Request"

**Cause**: Sender email not verified

**Solution**:

1. Verify sender email in SendGrid (see Step 1 above)
2. Ensure `SENDER_EMAIL` in `.env.local` matches verified email
3. Wait 5-10 minutes after verification
4. Restart server

### Issue 3: Email Sent But Not Received

**Possible Causes**:

- Email in spam folder
- Email blocked by recipient's server
- SendGrid account in sandbox mode

**Solutions**:

1. Check spam/junk folder
2. Check SendGrid Activity Feed: https://app.sendgrid.com/email_activity
3. Look for delivery status
4. If in sandbox mode, verify your account

### Issue 4: "The from address does not match a verified Sender Identity"

**Cause**: Mismatch between `.env.local` sender and SendGrid verified email

**Solution**:

```bash
# In .env.local, ensure this matches your verified SendGrid email:
SENDER_EMAIL=your-verified-email@yourdomain.com
```

---

## Verifying Email Delivery

### 1. Check Server Logs

Look for this in your terminal:

```
[INFO] [Newsletter] [abc123] Welcome email sent successfully {
  "statusCode": 202,
  "messageId": "..."
}
```

**Status Code Meanings**:

- `202`: Accepted (email queued for delivery)
- `401`: Unauthorized (bad API key)
- `403`: Forbidden (sender not verified)

### 2. Check SendGrid Activity Feed

1. Go to https://app.sendgrid.com/email_activity
2. Search for the recipient email
3. Check status:
   - **Delivered**: Email successfully sent ✅
   - **Processed**: Email accepted, being delivered
   - **Bounced**: Recipient's server rejected
   - **Dropped**: SendGrid blocked (spam, invalid email)

### 3. Check Inbox

- Check spam/junk folder
- Add `noreply@ssiautomations.com` to contacts
- Check email filters

---

## SendGrid Configuration Reference

### Current Implementation

The newsletter feature uses SendGrid with this flow:

1. User submits email on homepage
2. Email validated (format check)
3. Duplicate check in database
4. **Insert into database** ✅
5. **Send welcome email** via SendGrid
6. Return success to user

**Key Point**: Database insert succeeds even if email fails (user is subscribed regardless).

### Email Template

**Subject**: "Welcome to SSI Automations Newsletter!"

**Content**:

- Welcome message
- What to expect (4 bullet points)
- Unsubscribe information
- Company branding

**From**: `SENDER_EMAIL` (must be verified)
**To**: User's email from form

### Code Location

File: `/app/api/newsletter/route.ts`

```typescript
// SendGrid initialization (line ~15)
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Email sending (line ~192)
const welcomeMsg = {
  to: email,
  from: process.env.SENDER_EMAIL as string,
  subject: "Welcome to SSI Automations Newsletter!",
  text: "...",
  html: "...",
};

const result = await sgMail.send(welcomeMsg);
```

---

## Testing Checklist

Before considering SendGrid fully configured:

- [ ] Sender email verified in SendGrid dashboard
- [ ] API key created with "Mail Send" permission
- [ ] `.env.local` updated with correct `SENDGRID_API_KEY`
- [ ] `.env.local` updated with correct `SENDER_EMAIL` (matches verified email)
- [ ] Dev server restarted after environment changes
- [ ] Test email sent via curl or browser
- [ ] Check server logs for success message
- [ ] Check SendGrid Activity Feed for delivery
- [ ] Check inbox (and spam) for welcome email

---

## Production Deployment

### Vercel Environment Variables

When deploying to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

| Variable Name      | Value                    | Exposure       |
| ------------------ | ------------------------ | -------------- |
| `SENDGRID_API_KEY` | `SG.xxxxx`               | ❌ Server-only |
| `SENDER_EMAIL`     | `noreply@yourdomain.com` | ❌ Server-only |

3. **Important**: These are server-only (no `NEXT_PUBLIC_` prefix)
4. Redeploy after adding variables

### Domain Authentication (Optional but Recommended)

For better deliverability and removing "via sendgrid.net" from emails:

1. Go to https://app.sendgrid.com/settings/sender_auth/domain
2. Add your domain (e.g., `ssiautomations.com`)
3. Add DNS records provided by SendGrid
4. Wait for verification (can take up to 48 hours)
5. Update `SENDER_EMAIL` to use your domain

**Benefits**:

- Better email deliverability
- Professional appearance
- Higher trust score
- Removes SendGrid branding

---

## Monitoring & Analytics

### SendGrid Dashboard

**Activity Feed**: https://app.sendgrid.com/email_activity

- See all sent emails
- Delivery status
- Bounce reasons
- Click/open rates (if tracking enabled)

**Statistics**: https://app.sendgrid.com/statistics

- Email volume over time
- Delivery rates
- Bounce rates
- Spam reports

### Application Logs

Check your server logs for:

```bash
# Success
[INFO] [Newsletter] Welcome email sent successfully

# Failure
[ERROR] [Newsletter] Failed to send welcome email
```

---

## Getting Help

### SendGrid Support

- **Documentation**: https://docs.sendgrid.com/
- **Support**: https://support.sendgrid.com/
- **Status Page**: https://status.sendgrid.com/

### Common SendGrid Errors

| Error                   | Meaning              | Solution                            |
| ----------------------- | -------------------- | ----------------------------------- |
| `401 Unauthorized`      | Invalid API key      | Regenerate key, update `.env.local` |
| `403 Forbidden`         | Sender not verified  | Verify sender email in dashboard    |
| `400 Bad Request`       | Invalid email format | Check email validation              |
| `429 Too Many Requests` | Rate limit exceeded  | Wait or upgrade plan                |

---

## Quick Commands

```bash
# Restart dev server
pkill -f "next dev" && npm run dev

# Test newsletter API
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check logs (macOS/Linux)
tail -f /tmp/newsletter-server.log | grep "Newsletter"

# Check environment variables (masked)
grep SENDGRID .env.local | sed 's/=.*/=***/'
```

---

## Next Steps

1. **Verify sender email** in SendGrid dashboard
2. **Update `.env.local`** with verified email
3. **Restart dev server**
4. **Test signup** on homepage
5. **Check inbox** for welcome email
6. **Celebrate** 🎉

---

**Last Updated**: 2025-10-29
**Related Files**:

- `/app/api/newsletter/route.ts` - Newsletter API implementation
- `.env.local` - Environment configuration
- `.docs/supabase/SECRETS_MANAGEMENT.md` - Security best practices
