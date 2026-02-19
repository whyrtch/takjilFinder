# Firestore Security Rules Setup

Your Firestore database uses public read/write rules for the mosques collection to allow anyone to view and submit mosques without authentication.

## Current Rules

Your Firestore rules for TakjilFinder should include rating updates:

```javascript
// TakjilFinder - Public Submission
match /mosques/{mosqueId} {
  // 🔓 Public can read all mosques
  allow read: if true;
  
  // 🔓 Public can create new mosque (but force status = "pending")
  allow create: if true;
  
  // 🔓 Public can update ratings (thumbsUp, thumbsDown only)
  allow update: if request.resource.data.diff(resource.data).affectedKeys()
                   .hasOnly(['thumbsUp', 'thumbsDown']);
  
  // 🔒 Admin can update all fields
  allow update: if request.auth != null && 
                 request.auth.token.role == "admin";
  
  // 🔒 Only admin can delete
  allow delete: if request.auth != null && 
                 request.auth.token.role == "admin";
}
```

## What These Rules Do:

- **read**: Anyone can read mosques (no authentication required)
- **create**: Anyone can submit new mosques (no authentication required)
- **update (ratings)**: Anyone can update thumbsUp/thumbsDown counts
- **update (admin)**: Only authenticated admin users can update all other fields
- **delete**: Only authenticated admin users can delete mosques

## Authentication Flow:

1. **Public Users**: No authentication required for viewing and submitting mosques
2. **Admin Users**: 
   - When admin logs in, the app performs anonymous Firebase authentication
   - This allows admin operations (update/delete) to work
   - When admin logs out, Firebase sign-out is called to clear the session

## Benefits of This Approach:

1. **No Authentication for Public**: Users can view and submit mosques immediately
2. **Faster Loading**: No authentication delays for regular users
3. **Better User Experience**: Instant access without any setup
4. **Admin Security**: Admin operations still require authentication

## Security Considerations:

Since the rules allow public write access, consider:
1. All new submissions default to "pending" status
2. Admin review required before mosques appear as "verified"
3. Rate limiting should be implemented at the application level if needed
4. Consider adding reCAPTCHA for form submissions to prevent spam

## Admin Access:

Admin operations (update/delete) still require:
- Authenticated user with `role: "admin"` in their token
- This is handled through the admin login in the app

## Vercel Deployment Checklist:

When deploying to Vercel, make sure:

1. **Environment Variables are Set**: Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add all `VITE_FIREBASE_*` variables from your `.env` file
   - Add `VITE_ADMIN_ACCOUNT` and `VITE_ADMIN_PASSWORD`
   - Make sure they're available for Production, Preview, and Development

2. **Firestore Rules are Published**: 
   - Verify the public access rules above are published in Firebase Console
   - No authentication setup needed since rules allow public access

## Debugging on Vercel:

1. Open your deployed site
2. Open browser console (F12)
3. Look for these messages:
   - "Firebase initialization" - Shows if env variables are loaded
   - "Auth not required for public read access" - Confirms public access mode
   - "Subscribing to Firestore..." - Connecting to database
   - "Received X mosques from Firestore" - Data loaded successfully

4. When admin logs in:
   - "Admin login: signing in anonymously to Firebase..." - Admin authentication starting
   - "Anonymous authentication successful for admin" - Admin can now update/delete

5. When admin logs out:
   - "Admin logout: signing out from Firebase..." - Clearing Firebase session
   - "Firebase sign out successful" - Session cleared

## Common Issues:

1. **Infinite Loading**: 
   - Check if environment variables are set in Vercel
   - Verify Firestore rules are published and allow public read

2. **Permission Denied**:
   - Firestore rules need to allow public read (`allow read: if true;`)
   - Make sure rules are published in Firebase Console

3. **Works Locally but Not on Vercel**:
   - Environment variables are missing in Vercel
   - Check the browser console on the deployed site for specific errors

## Testing:

To test if everything works:
1. Open your deployed site in an incognito/private window
2. Open browser console (F12)
3. You should see mosques loading within 2-3 seconds
4. No authentication required - data loads immediately
5. If not, check the console for error messages
