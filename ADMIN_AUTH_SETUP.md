# Admin Authentication Setup

This guide explains how to set up admin authentication for your clothing store admin portal.

## Overview

The admin portal is now protected with Supabase Authentication. Only users who have been created in your Supabase Auth system can log in to the admin dashboard.

## Setup Steps

### 1. **Environment Variables**

Make sure your `.env.local` file includes the Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

These variables should already be set if you have Supabase configured in your project.

### 2. **Enable Email/Password Authentication in Supabase**

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Providers**
3. Make sure **Email** provider is enabled
4. You can optionally require email verification

### 3. **Create Admin User**

You mentioned you already created a user in Supabase Auth. This user will now be able to log in to the admin portal.

**To verify or create a user:**
1. Go to Supabase Dashboard > **Authentication > Users**
2. Click **Add user** (if you haven't created one yet)
3. Enter an email address and password
4. Click **Create user**

### 4. **Access the Admin Portal**

1. Navigate to `http://localhost:3000/admin/login` (or your deployed URL `/admin/login`)
2. Sign in with the email and password you created in Supabase
3. After successful login, you'll be redirected to the admin dashboard
4. You can now manage products, categories, and blog posts

## File Structure

- **`app/admin/login.js`** - Login page where users enter credentials
- **`app/admin/page.js`** - Protected admin dashboard (now wrapped with authentication)
- **`lib/admin-auth.js`** - Authentication helper components:
  - `ProtectedAdminRoute` - Wrapper that checks if user is authenticated
  - `AdminLogoutButton` - Logout button component

## How It Works

1. When an unauthenticated user tries to access `/admin`, they are automatically redirected to `/admin/login`
2. The user enters their Supabase credentials
3. Upon successful login, they are redirected to the admin dashboard
4. The `ProtectedAdminRoute` component continuously monitors authentication state
5. If the user logs out or the session expires, they are redirected back to the login page

## Logout

A logout button is available in the top-right corner of the admin dashboard. Clicking it will:
1. Sign out the user from Supabase
2. Redirect to the login page

## Security Notes

- Only users created in your Supabase Auth system can access the admin panel
- Passwords should be strong and unique
- Consider enabling multi-factor authentication (MFA) in Supabase for additional security
- The authentication uses Supabase's secure session management
- All API calls to Supabase still use your public anon key, but data access is controlled via database RLS (Row Level Security) policies

## Troubleshooting

### "Invalid login credentials" error
- Double-check the email and password
- Make sure the user exists in Supabase > Authentication > Users
- Verify that Email provider is enabled in Supabase

### Getting redirected to login page repeatedly
- Check that your Supabase URL and ANON_KEY in `.env.local` are correct
- Clear browser cookies/cache
- Check browser console for any JavaScript errors

### Session expires too quickly
- This is normal behavior. Sessions typically last 24 hours with Supabase
- The user will need to log in again after session expiration
- You can adjust session duration in Supabase project settings if needed

## Future Enhancements

Consider adding these features later:
- Password reset functionality
- Email verification
- Multi-factor authentication (MFA)
- Role-based access control (different admin roles)
- Audit logs of admin actions
