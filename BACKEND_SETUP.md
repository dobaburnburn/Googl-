# Backend Setup Guide

This guide walks you through setting up the backend for the blogging platform.

## Prerequisites

- Node.js 18+ and pnpm installed
- Supabase account (https://supabase.com)
- Stripe account (https://stripe.com)
- A code editor (VS Code recommended)

## Installation

### 1. Dependencies Installed ✅
All npm dependencies have been installed with pnpm.

### 2. Environment Configuration

Copy the `.env.local` file and fill in your credentials:

```bash
cp .env.local .env.local.example
```

Update `.env.local` with:

#### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

Get these from: [Supabase Dashboard](https://app.supabase.com) → Project Settings → API

#### Stripe Configuration
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret

Get these from: [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys

## Database Setup

### 1. Create Supabase Project
1. Go to [Supabase](https://app.supabase.com)
2. Click "New project"
3. Fill in project details
4. Wait for project to be created
5. Copy your project URL and anon key to `.env.local`

### 2. Run Database Migrations
The SQL scripts are located in `scripts/`:

1. **Create Tables** (`scripts/001-create-tables.sql`):
   - Open Supabase SQL Editor
   - Copy and paste the entire `001-create-tables.sql` content
   - Execute the script

2. **Seed Articles** (`scripts/002-seed-articles.sql`):
   - Copy and paste the entire `002-seed-articles.sql` content
   - Execute the script

This creates:
- `profiles` - User profiles linked to auth
- `articles` - Blog articles with metadata
- `subscriptions` - Stripe subscription records
- `newsletter_subscribers` - Newsletter email list
- `article_views` - Article view tracking
- `sentiments` - Sentiment analysis results

### 3. Enable Auth

1. In Supabase Dashboard → Authentication → Providers
2. Configure Email/Password provider:
   - Enable it
   - Set confirmation email settings as needed

### 4. Set Row Level Security (RLS)

1. In Supabase Dashboard → SQL Editor
2. Run `scripts/003-rls-policies.sql` (create this based on your needs)

Or manually set policies in Table Editor → RLS

## Stripe Setup

### 1. Create Products
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to Products
3. Create products matching your subscription plans:
   - **Pro**: Monthly - $9/month
   - **Enterprise**: Custom pricing

### 2. Configure Webhooks
1. Go to Developers → Webhooks
2. Create endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Subscribe to events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `charge.failed`
   - `charge.succeeded`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`

### 3. Update Price IDs
In `lib/stripe.ts`, update the price IDs with your Stripe product price IDs:
```typescript
priceId: "price_1ABC...XYZ"  // Replace with your actual price ID
```

## API Routes

The following API routes are configured:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Articles
- `GET /api/articles` - List articles
- `POST /api/articles` - Create article (admin)
- `GET /api/articles/[id]` - Get article
- `PUT /api/articles/[id]` - Update article (admin)
- `DELETE /api/articles/[id]` - Delete article (admin)

### Subscriptions
- `POST /api/subscribe` - Create subscription
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Sentiment Analysis
- `POST /api/sentiment` - Analyze text sentiment

## Development

### Start Development Server
```bash
pnpm dev
```

Server runs on `http://localhost:3000`

### Build for Production
```bash
pnpm build
pnpm start
```

### Lint Code
```bash
pnpm lint
```

## Database Tables Schema

### profiles
- `id` (UUID) - User ID from auth
- `email` (TEXT) - User email
- `full_name` (TEXT) - User name
- `avatar_url` (TEXT) - Profile image URL
- `role` (TEXT) - user | admin | author
- `subscription_status` (TEXT) - free | pro | enterprise
- `stripe_customer_id` (TEXT) - Stripe customer ID
- `created_at` (TIMESTAMPTZ) - Created timestamp
- `updated_at` (TIMESTAMPTZ) - Last updated timestamp

### articles
- `id` (UUID) - Article ID
- `title` (TEXT) - Article title
- `slug` (TEXT) - URL-friendly slug (unique)
- `excerpt` (TEXT) - Short description
- `content` (TEXT) - Full article content
- `cover_image` (TEXT) - Cover image URL
- `category` (TEXT) - Article category
- `tags` (TEXT[]) - Article tags
- `author_id` (UUID) - Author user ID
- `is_premium` (BOOLEAN) - Premium content flag
- `is_published` (BOOLEAN) - Published status
- `views` (INTEGER) - View count
- `read_time` (INTEGER) - Estimated read time (minutes)
- `published_at` (TIMESTAMPTZ) - Publication date
- `created_at` (TIMESTAMPTZ) - Created timestamp
- `updated_at` (TIMESTAMPTZ) - Last updated timestamp

### subscriptions
- `id` (UUID) - Subscription ID
- `user_id` (UUID) - User ID
- `stripe_subscription_id` (TEXT) - Stripe subscription ID
- `stripe_price_id` (TEXT) - Stripe price ID
- `plan` (TEXT) - pro | enterprise
- `status` (TEXT) - active | canceled | past_due | trialing
- `current_period_start` (TIMESTAMPTZ) - Period start
- `current_period_end` (TIMESTAMPTZ) - Period end
- `created_at` (TIMESTAMPTZ) - Created timestamp
- `updated_at` (TIMESTAMPTZ) - Last updated timestamp

### newsletter_subscribers
- `id` (UUID) - Subscriber ID
- `email` (TEXT) - Email address (unique)
- `subscribed_at` (TIMESTAMPTZ) - Subscription date
- `unsubscribed_at` (TIMESTAMPTZ) - Unsubscription date (if applicable)

## Key Features

✅ **Authentication** - Email/password auth with Supabase
✅ **Articles** - Full CRUD operations with publishing workflow
✅ **Subscriptions** - Stripe integration for billing
✅ **Premium Content** - Gate content by subscription level
✅ **Newsletter** - Email subscription management
✅ **Sentiment Analysis** - Text analysis API
✅ **Analytics** - Google Analytics integration
✅ **Admin Panel** - User, article, and subscriber management

## Testing

1. Create a test user account
2. Test subscription flow in Stripe test mode
3. Verify webhook delivery in Stripe dashboard
4. Check article CRUD operations in admin panel

## Troubleshooting

### "Missing environment variables"
- Ensure all required variables are set in `.env.local`
- Restart dev server after updating `.env.local`

### "Database connection failed"
- Verify Supabase URL and key are correct
- Check Supabase project status in dashboard
- Ensure RLS policies allow queries

### "Stripe webhook not working"
- Verify webhook signing secret matches
- Check webhook endpoint URL is accessible
- Review webhook delivery logs in Stripe dashboard

### "Authentication issues"
- Clear browser cookies
- Check Supabase auth settings
- Verify redirect URLs are configured

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Railway
- Render
- Railway
- Self-hosted (Docker)

Set up environment variables on your hosting platform before deploying.

## Support

For issues or questions:
- Check Supabase docs: https://supabase.com/docs
- Check Stripe docs: https://stripe.com/docs
- Check Next.js docs: https://nextjs.org/docs
