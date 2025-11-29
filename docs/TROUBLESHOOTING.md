# 🔧 ChefIApp - Troubleshooting Guide

Common issues and their solutions.

---

## 📋 Table of Contents

- [Environment Setup](#environment-setup)
- [Supabase Issues](#supabase-issues)
- [Authentication Issues](#authentication-issues)
- [Build Issues](#build-issues)
- [Mobile Issues](#mobile-issues)
- [Runtime Errors](#runtime-errors)
- [Performance Issues](#performance-issues)

---

## 🌍 Environment Setup

### Issue: "Missing Supabase environment variables"

**Symptoms:**
```
Error: Missing Supabase environment variables
Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

**Solution:**
```bash
# 1. Check if .env exists
ls -la .env

# 2. If not, copy from example
cp .env.example .env

# 3. Add your Supabase credentials
nano .env

# 4. Verify variables are set
cat .env
```

**Required format:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Issue: "Port 5173 already in use"

**Symptoms:**
```
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Find process using port
lsof -i :5173

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

---

## 💾 Supabase Issues

### Issue: "relation 'profiles' does not exist"

**Symptoms:**
```
PostgresError: relation "public.profiles" does not exist
```

**Solution:**
```bash
# 1. Open Supabase Dashboard
open https://app.supabase.com

# 2. Go to SQL Editor
# 3. Execute migration
# Copy/paste contents of supabase/COMPLETE_SETUP.sql
# Click RUN

# 4. Verify in Table Editor
# Should see: profiles, tasks, companies, etc.
```

### Issue: "bucket 'task-photos' not found"

**Symptoms:**
```
StorageError: Bucket not found
```

**Solution:**
```bash
# 1. Go to Supabase Dashboard → Storage
# 2. Click "New bucket"
# 3. Configure:
#    Name: task-photos
#    Public: ✅ Yes
#    File size limit: 5MB
# 4. Click "Create bucket"

# 5. Add policies in SQL Editor:
```

```sql
-- Allow authenticated upload
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'task-photos');

-- Allow public read
CREATE POLICY "Anyone can view task photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'task-photos');
```

### Issue: "Row Level Security policy violation"

**Symptoms:**
```
PostgresError: new row violates row-level security policy
```

**Solution:**
```sql
-- Temporarily disable RLS for debugging (NOT for production!)
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Test your query
-- Then re-enable:
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'tasks';

-- Fix policy (example)
DROP POLICY "Users can view their tasks" ON tasks;

CREATE POLICY "Users can view their tasks"
ON tasks FOR SELECT
USING (
  auth.uid() = assigned_to
  OR auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('manager', 'owner')
    AND profiles.company_id = tasks.company_id
  )
);
```

### Issue: "Realtime subscription not working"

**Symptoms:**
- Changes in database don't appear in app
- No console logs from subscription

**Solution:**
```bash
# 1. Enable Realtime in Supabase Dashboard
# Go to Database → Replication
# Execute:
```

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

```typescript
// 2. Verify subscription in code
const channel = supabase
  .channel('tasks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'tasks'
  }, (payload) => {
    console.log('Realtime update:', payload);  // Should log on changes
  })
  .subscribe((status) => {
    console.log('Subscription status:', status);  // Should be "SUBSCRIBED"
  });
```

---

## 🔐 Authentication Issues

### Issue: "Invalid login credentials"

**Symptoms:**
```
AuthError: Invalid login credentials
```

**Solutions:**

**1. Email not confirmed:**
```bash
# Check Supabase Dashboard → Authentication → Users
# If email_confirmed_at is null:
# 1. Resend confirmation email
# 2. Or manually confirm in dashboard
```

**2. Wrong password:**
```bash
# Reset password via Supabase
# Dashboard → Authentication → Users → ... → Reset Password
```

**3. User doesn't exist:**
```typescript
// Create user via signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
});
```

### Issue: "OAuth redirect not working"

**Symptoms:**
- OAuth flow starts but doesn't return to app
- Stuck on provider login screen

**Solution:**
```bash
# 1. Verify redirect URLs in Supabase Dashboard
# Settings → Authentication → Redirect URLs

# Add these URLs:
http://localhost:5173
http://localhost:5173/auth/callback
chefiapp://auth/callback         # iOS deep link
com.chefiapp.app://auth/callback  # Android deep link

# 2. Verify OAuth provider config
# Settings → Authentication → Providers
# Google/Apple must be enabled with correct credentials
```

### Issue: "Session expired"

**Symptoms:**
```
AuthError: Session expired
```

**Solution:**
```typescript
// Enable auto-refresh in supabase client
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,  // ← Ensure this is true
    detectSessionInUrl: true,
  },
});

// Manually refresh if needed
const { data, error } = await supabase.auth.refreshSession();
```

---

## 🏗️ Build Issues

### Issue: "TypeScript errors during build"

**Symptoms:**
```
error TS2307: Cannot find module '@/lib/supabase'
```

**Solution:**
```bash
# 1. Clear TypeScript cache
rm -rf node_modules/.vite

# 2. Reinstall dependencies
npm install

# 3. Check tsconfig.json paths
cat tsconfig.json
```

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // ← Should be present
    }
  }
}
```

### Issue: "Vite build fails with memory error"

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed
```

**Solution:**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Issue: "Module not found" errors

**Symptoms:**
```
Error: Cannot find module 'react-i18next'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or install specific package
npm install react-i18next
```

---

## 📱 Mobile Issues

### Issue: "White screen on iOS"

**Symptoms:**
- App builds successfully
- Opens to white screen
- No errors in Xcode console

**Solutions:**

**1. Check Capacitor config:**
```bash
cat capacitor.config.ts
```

```typescript
// Ensure webDir points to build output
const config: CapacitorConfig = {
  webDir: 'dist',  // ← Should match Vite output
};
```

**2. Rebuild and sync:**
```bash
npm run build
npx cap sync ios
npx cap open ios
```

**3. Check Safari DevTools:**
```bash
# Safari → Develop → Simulator → localhost
# Check console for errors
```

### Issue: "Capacitor plugin not found"

**Symptoms:**
```
Error: 'Camera' plugin is not implemented on ios
```

**Solution:**
```bash
# 1. Install plugin
npm install @capacitor/camera

# 2. Sync to native projects
npx cap sync

# 3. If still fails, clean and rebuild
cd ios
pod install
cd ..
npx cap sync ios
```

### Issue: "CocoaPods installation failed"

**Symptoms:**
```
[error] Pod install failed
```

**Solution:**
```bash
# Update CocoaPods
sudo gem install cocoapods

# Clean pods
cd ios/App
rm -rf Pods Podfile.lock
pod install

# If still fails, update repo
pod repo update
pod install
```

### Issue: "Android build fails with Gradle error"

**Symptoms:**
```
FAILURE: Build failed with an exception
```

**Solutions:**

**1. Clean Gradle cache:**
```bash
cd android
./gradlew clean
cd ..
```

**2. Update Gradle wrapper:**
```bash
cd android
./gradlew wrapper --gradle-version 8.0
cd ..
```

**3. Check Java version:**
```bash
java -version  # Should be 17+

# If wrong version, update JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

---

## ⚠️ Runtime Errors

### Issue: "Cannot read property of undefined"

**Symptoms:**
```
TypeError: Cannot read property 'id' of undefined
```

**Solution:**
```typescript
// ❌ Bad: No null checks
const user = useAppStore(state => state.currentUser);
console.log(user.id);  // Crashes if user is null

// ✅ Good: Safe access
const user = useAppStore(state => state.currentUser);
console.log(user?.id);  // Returns undefined if user is null

// ✅ Better: Guard clause
if (!user) {
  return <Loading />;
}
return <div>{user.id}</div>;
```

### Issue: "Maximum update depth exceeded"

**Symptoms:**
```
Error: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
```

**Solution:**
```typescript
// ❌ Bad: Missing dependencies
useEffect(() => {
  syncTasks();  // Causes re-render, which triggers useEffect again
}, []);

// ✅ Good: Stable function reference
useEffect(() => {
  const sync = async () => {
    await syncTasks();
  };
  sync();
}, [syncTasks]);  // Add dependency

// ✅ Better: Memoize callback
const syncTasks = useCallback(async () => {
  // ...
}, []);

useEffect(() => {
  syncTasks();
}, [syncTasks]);
```

### Issue: "Memory leak warning"

**Symptoms:**
```
Warning: Can't perform a React state update on an unmounted component
```

**Solution:**
```typescript
// ❌ Bad: No cleanup
useEffect(() => {
  const channel = supabase.channel('tasks')
    .on('postgres_changes', { ... }, handleChange)
    .subscribe();
}, []);

// ✅ Good: Cleanup subscription
useEffect(() => {
  const channel = supabase.channel('tasks')
    .on('postgres_changes', { ... }, handleChange)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);  // Cleanup on unmount
  };
}, []);
```

---

## 🐌 Performance Issues

### Issue: "App is slow/laggy"

**Solutions:**

**1. Profile with React DevTools:**
```bash
# Install React DevTools browser extension
# Enable Profiler
# Record session and check:
# - Unnecessary re-renders
# - Heavy components
```

**2. Memoize expensive computations:**
```typescript
// ❌ Bad: Recalculates on every render
const TaskList = ({ tasks }) => {
  const sortedTasks = tasks.sort((a, b) => b.xpReward - a.xpReward);
  return <>{sortedTasks.map(t => <TaskCard task={t} />)}</>;
};

// ✅ Good: Memoized
const TaskList = ({ tasks }) => {
  const sortedTasks = useMemo(
    () => tasks.sort((a, b) => b.xpReward - a.xpReward),
    [tasks]
  );
  return <>{sortedTasks.map(t => <TaskCard task={t} />)}</>;
};
```

**3. Virtualize long lists:**
```bash
npm install @tanstack/react-virtual
```

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const TaskList = ({ tasks }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <TaskCard
            key={virtualItem.key}
            task={tasks[virtualItem.index]}
          />
        ))}
      </div>
    </div>
  );
};
```

### Issue: "Large bundle size"

**Solution:**
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Lazy load routes
```

```typescript
// Before: Eager loading
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';

// After: Lazy loading
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'));
const ManagerDashboard = lazy(() => import('./pages/ManagerDashboard'));
```

---

## 🆘 Getting More Help

### Check Logs

**Web:**
```bash
# Browser console (F12)
# Network tab for API calls
# React DevTools for component state
```

**iOS:**
```bash
# Xcode console
# Safari → Develop → Simulator → localhost
```

**Android:**
```bash
# Android Studio Logcat
# Chrome DevTools: chrome://inspect
```

### Supabase Logs

```bash
# Dashboard → Logs
# Filter by level (error, warning, info)
# Check API logs
# Check Realtime logs
```

### Enable Debug Mode

```typescript
// In lib/supabase.ts
export const supabase = createClient(url, key, {
  auth: {
    debug: true,  // Enable auth debugging
  },
  global: {
    headers: {
      'x-my-custom-header': 'my-app-name',
    },
  },
});
```

---

## 📚 Additional Resources

- **Architecture:** `docs/ARCHITECTURE.md`
- **Development:** `docs/DEVELOPMENT.md`
- **Quick Start:** `docs/QUICKSTART.md`
- **Supabase Docs:** https://supabase.com/docs
- **Capacitor Docs:** https://capacitorjs.com/docs

---

Last updated: 2025-11-29
