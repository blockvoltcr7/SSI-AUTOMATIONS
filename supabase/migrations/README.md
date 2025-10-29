# Newsletter Database Migration

## Migration: Add `welcomed` Column

**File**: `20251029_add_welcomed_column.sql`

### What This Does

Adds a `welcomed` boolean column to track whether a subscriber has received their welcome email.

**Changes:**

- Adds `welcomed` column (default: `false`)
- Creates index on `welcomed` for efficient batch queries
- Adds documentation comments

### How to Run This Migration

#### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **"New Query"**
4. Copy the contents of `20251029_add_welcomed_column.sql`
5. Paste into the SQL editor
6. Click **"Run"**
7. Verify success message

#### Option 2: Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Verify Migration

After running the migration, verify it worked:

```sql
-- Check if column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'newsletter_subscribers'
AND column_name = 'welcomed';

-- Check existing subscribers (should all be false by default)
SELECT email, welcomed
FROM newsletter_subscribers
LIMIT 10;
```

### Expected Result

The `newsletter_subscribers` table should now have:

| Column        | Type        | Default   | Description                    |
| ------------- | ----------- | --------- | ------------------------------ |
| id            | uuid        | auto      | Primary key                    |
| email         | text        | -         | Subscriber email               |
| status        | text        | 'active'  | Subscription status            |
| subscribed_at | timestamptz | -         | When they subscribed           |
| created_at    | timestamptz | now()     | Record creation time           |
| **welcomed**  | **boolean** | **false** | **Whether welcome email sent** |

### What Happens Next

1. **New Signups**: All new subscribers will have `welcomed = false`
2. **Scheduled Job**: A cron job (to be implemented) will:
   - Run at midnight daily
   - Find all subscribers with `welcomed = false`
   - Send welcome emails in batch
   - Update `welcomed = true` after sending

### Rollback (If Needed)

If you need to remove the column:

```sql
-- Remove the column
ALTER TABLE newsletter_subscribers
DROP COLUMN IF EXISTS welcomed;

-- Remove the index
DROP INDEX IF EXISTS idx_newsletter_subscribers_welcomed;
```

### Related Files

- **API Route**: `/app/api/newsletter/route.ts` - Updated to set `welcomed = false`
- **Future Cron Job**: TBD - Will process unwelcomed subscribers
