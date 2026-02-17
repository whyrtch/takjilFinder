# Vercel Deployment Guide

## Quick Setup

### 1. Set Environment Variables in Vercel

Go to your Vercel project dashboard:
1. Click on your project
2. Go to **Settings** > **Environment Variables**
3. Add these variables (copy from your `.env` file):

```
VITE_FIREBASE_API_KEY=AIzaSyDi4t30BHW7iCwnMu6aV3Xdph9y3XGZBos
VITE_FIREBASE_AUTH_DOMAIN=projects-8f743.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=projects-8f743
VITE_FIREBASE_STORAGE_BUCKET=projects-8f743.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=784967224976
VITE_FIREBASE_APP_ID=1:784967224976:web:7344d4bf3f115e84d69215
VITE_ADMIN_ACCOUNT=admin@takjilfinder.com
VITE_ADMIN_PASSWORD=admin12345
```

4. Make sure to select **Production**, **Preview**, and **Development** for each variable
5. Click **Save**

### 2. Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### 3. Verify Firebase Settings

Make sure in Firebase Console:

1. **Firestore Rules Allow Public Access**:
   - Go to Firebase Console > Firestore Database > Rules
   - Verify mosques collection has `allow read: if true;`
   - See `FIRESTORE_RULES.md` for the correct rules
   - Make sure they're published

Note: No authentication setup needed since your rules allow public read/write access.

## Troubleshooting

### Issue: Infinite Loading on Vercel

**Symptoms**: App shows loading spinner forever, but works locally

**Solutions**:
1. Check browser console (F12) on the deployed site
2. Look for "Firebase initialization" log - all values should show "✓ Set"
3. If any show "✗ Missing", environment variables aren't set correctly in Vercel
4. Verify Firestore rules allow public read access
5. Check Firestore rules are published

### Issue: Works with Admin Login but Not Without

**Symptoms**: Data loads when logged in as admin, but not for public users

**Solutions**:
1. Check Firestore rules allow public read access (`allow read: if true;`)
2. Verify rules are published in Firebase Console
3. Check browser console for permission errors

### Issue: "Permission Denied" Errors

**Symptoms**: Console shows Firestore permission errors

**Solutions**:
1. Update Firestore rules (see `FIRESTORE_RULES.md`)
2. Make sure rules are published in Firebase Console
3. Wait 30 seconds for rules to propagate
4. Refresh the page

## Testing Your Deployment

1. Open your deployed site in an **incognito/private window**
2. Open browser console (F12)
3. You should see these logs in order:
   ```
   Firebase initialization: { apiKey: "✓ Set", ... }
   Auth not required for public read access
   Subscribing to Firestore...
   Received X mosques from Firestore
   ```
4. Mosques should load within 2-3 seconds (no authentication delay)

## Common Mistakes

1. **Forgetting to add environment variables in Vercel** - Most common issue!
2. **Not publishing Firestore rules** - Rules must be published to take effect
3. **Using wrong environment variable names** - Must start with `VITE_` for Vite projects
4. **Firestore rules not allowing public access** - Rules must have `allow read: if true;` for mosques

## Need Help?

If you're still having issues:
1. Check the browser console on your deployed site
2. Copy any error messages
3. Verify all environment variables are set in Vercel
4. Confirm Firestore rules allow public read access
5. Make sure Firestore rules are published
