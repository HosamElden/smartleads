# Supabase Edge Functions Setup Guide

## Prerequisites
- Supabase CLI installed
- Supabase project created
- Resend account (free tier)

## Installation Steps

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
cd /Users/hosamelden/Documents/antigravity/smartleads_migrated
supabase link --project-ref your-project-ref
```

**To find your project ref:**
- Go to Supabase Dashboard
- Project Settings → General
- Copy "Reference ID"

### 4. Set Up Resend

1. Sign up at https://resend.com (free)
2. Add your domain OR use `onboarding@resend.dev` for testing
3. Get your API key from Dashboard → API Keys

### 5. Configure Environment Variables

Set secrets in Supabase:

```bash
# Set Resend API Key
supabase secrets set RESEND_API_KEY=re_your_key_here

# Set your app URL
supabase secrets set APP_URL=https://your-app.vercel.app

# For local development
supabase secrets set APP_URL=http://localhost:5173
```

### 6. Deploy Edge Function

```bash
supabase functions deploy send-password-reset
```

### 7. Test the Function

```bash
# Test locally first
supabase functions serve send-password-reset

# In another terminal, test it:
curl -i --location --request POST 'http://localhost:54321/functions/v1/send-password-reset' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"email":"test@example.com"}'
```

## Verification

After deployment, test the forgot password flow:
1. Go to your app's login page
2. Click "Forgot Password?"
3. Enter your email
4. Check your email inbox for the reset link

## Troubleshooting

**Function not found?**
- Make sure you deployed: `supabase functions deploy send-password-reset`
- Check function logs: `supabase functions logs send-password-reset`

**Email not sending?**
- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard for delivery logs
- For testing, use `onboarding@resend.dev` as the "from" address

**CORS errors?**
- The function already has CORS headers configured
- Make sure you're using the correct Supabase URL

## Environment Variables Summary

```env
# In Supabase Dashboard → Edge Functions → Secrets
RESEND_API_KEY=re_xxxxx
APP_URL=https://your-app.vercel.app

# In your .env file (already configured)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

## Cost

✅ **100% FREE** with:
- Supabase Free Plan: 500K function invocations/month
- Resend Free Plan: 100 emails/day (3,000/month)
