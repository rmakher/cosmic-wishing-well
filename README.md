# Cosmic Wishing Well — Deployment Guide

## Files
- `public/index.html` — Your website
- `api/checkout.js` — Stripe serverless function
- `package.json` — Dependencies (Stripe SDK)
- `vercel.json` — Vercel config

## Deploy to Vercel (Free)

### Step 1: Push to GitHub
1. Create a new GitHub repository called `cosmic-wishing-well`
2. Upload all these files to it (drag & drop works)

### Step 2: Deploy on Vercel
1. Go to vercel.com and sign up (free) with your GitHub account
2. Click "Import Project" → select your `cosmic-wishing-well` repo
3. Vercel auto-detects the config — just click Deploy

### Step 3: Add Stripe Keys
1. In Vercel dashboard → your project → Settings → Environment Variables
2. Add these two variables:
   - `STRIPE_SECRET_KEY` = your sk_live_... key from Stripe dashboard
   - `DOMAIN` = https://cosmicwishingwell.com
3. Redeploy (Vercel → Deployments → click the three dots → Redeploy)

### Step 4: Connect Your Domain
1. In Vercel → your project → Settings → Domains
2. Add `cosmicwishingwell.com`
3. Vercel gives you DNS records — add these in Namecheap:
   - Go to Namecheap → Domain List → Manage → Advanced DNS
   - Change nameservers to Vercel's, OR add the A/CNAME records Vercel provides

### That's it! Your site is live with payments.

## How Payments Work
1. User fills out wish form → clicks "Cast Your Wish"
2. Site calls /api/checkout (your serverless function)
3. Function creates a Stripe Checkout session
4. User is redirected to Stripe's secure payment page
5. After payment, user returns to your site with ?success=true
6. Success modal + ripple effects play

## Find Your Stripe Keys
- Go to dashboard.stripe.com
- Click Developers → API Keys
- Publishable key: pk_live_... (not needed for this setup)
- Secret key: sk_live_... (this goes in Vercel environment variables)

## Important
- NEVER put your sk_live_ key in the HTML or any client-side code
- It goes ONLY in Vercel's environment variables
- The serverless function accesses it securely via process.env
