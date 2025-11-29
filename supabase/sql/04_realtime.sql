-- ============================================
-- CHEFIAPP™ - ENABLE REALTIME
-- Execute APÓS 03_rls.sql
-- ============================================

-- Enable Realtime for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Enable Realtime for profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Enable Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable Realtime for activity_log table
ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;

-- ============================================
-- VERIFY REALTIME IS ENABLED
-- ============================================

-- Run this query to verify
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';

-- Expected output:
-- tasks
-- profiles
-- notifications
-- activity_log
