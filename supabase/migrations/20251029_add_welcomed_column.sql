-- Migration: Add 'welcomed' column to newsletter_subscribers
-- Description: Track whether a welcome email has been sent to the subscriber
-- Date: 2025-10-29

-- Add welcomed column with default value of false
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS welcomed BOOLEAN NOT NULL DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN newsletter_subscribers.welcomed IS
'Tracks whether a welcome email has been sent to this subscriber. False by default, set to true after welcome email is sent by scheduled job.';

-- Create an index for efficient querying of unwelcomed users
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_welcomed
ON newsletter_subscribers(welcomed)
WHERE welcomed = false;

COMMENT ON INDEX idx_newsletter_subscribers_welcomed IS
'Index to efficiently find subscribers who have not been welcomed yet for batch processing.';
