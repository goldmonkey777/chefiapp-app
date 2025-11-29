-- ============================================
-- CHEFIAPP™ - ROW LEVEL SECURITY (RLS)
-- Execute APÓS 02_functions.sql
-- ============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: companies
-- ============================================

-- Users can view their own company
CREATE POLICY "Users can view their company"
ON companies FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  )
);

-- Only ADMIN can insert companies
CREATE POLICY "Only admins can create companies"
ON companies FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Only ADMIN can update their company
CREATE POLICY "Only admins can update companies"
ON companies FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT company_id FROM profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- ============================================
-- POLICIES: profiles
-- ============================================

-- Users can view profiles from their company
CREATE POLICY "Users can view profiles from their company"
ON profiles FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  ) OR id = auth.uid()
);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- ============================================
-- POLICIES: tasks
-- ============================================

-- Users can view tasks from their company
CREATE POLICY "Users can view tasks from their company"
ON tasks FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  )
);

-- MANAGER and ADMIN can create tasks
CREATE POLICY "Managers and admins can create tasks"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('MANAGER', 'ADMIN')
    AND company_id = tasks.company_id
  )
);

-- Users can update tasks assigned to them
CREATE POLICY "Users can update their assigned tasks"
ON tasks FOR UPDATE
TO authenticated
USING (
  assigned_to = auth.uid() OR
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('MANAGER', 'ADMIN')
  )
);

-- Only MANAGER and ADMIN can delete tasks
CREATE POLICY "Only managers and admins can delete tasks"
ON tasks FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('MANAGER', 'ADMIN')
  )
);

-- ============================================
-- POLICIES: notifications
-- ============================================

-- Users can view their own notifications
CREATE POLICY "Users can view their notifications"
ON notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- System can create notifications
CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update their own notifications
CREATE POLICY "Users can update their notifications"
ON notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete their notifications"
ON notifications FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================
-- POLICIES: activity_log
-- ============================================

-- Users can view activity from their company
CREATE POLICY "Users can view company activity"
ON activity_log FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT company_id FROM profiles WHERE id = auth.uid()
  )
);

-- System can create activity logs
CREATE POLICY "System can create activity logs"
ON activity_log FOR INSERT
TO authenticated
WITH CHECK (true);
