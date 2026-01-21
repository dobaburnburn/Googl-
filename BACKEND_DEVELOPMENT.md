# Backend Development Guide

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
```bash
# Copy and fill in the template
cat .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_SECRET_KEY` - Stripe secret API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

### 3. Start Development Server
```bash
pnpm dev
```

Server runs at `http://localhost:3000`

## API Architecture

### Routes Structure
```
app/api/
├── sentiment/
│   └── route.ts          # Sentiment analysis endpoint
├── webhooks/
│   └── stripe/
│       └── route.ts      # Stripe webhook handler
└── ... (other routes)
```

### Key API Endpoints

#### Sentiment Analysis
- **Endpoint**: `POST /api/sentiment`
- **Purpose**: Analyze text sentiment using HuggingFace API
- **Body**:
  ```json
  {
    "text": "AI is amazing",
    "apiKey": "hf_..." // optional
  }
  ```

#### Stripe Webhooks
- **Endpoint**: `POST /api/webhooks/stripe`
- **Events**:
  - `checkout.session.completed` - Subscription created
  - `customer.subscription.updated` - Subscription updated
  - `customer.subscription.deleted` - Subscription canceled

## Database Integration

### Supabase Client Setup
```typescript
// Server-side (recommended)
import { createClient } from "@/lib/supabase/server";
const client = await createClient();

// Client-side
import { createClient } from "@/lib/supabase/client";
const client = createClient();

// Admin operations
import { createClient } from "@supabase/supabase-js";
const admin = createClient(url, serviceRoleKey);
```

### Database Tables

#### profiles
User profile information extended from auth.users
```sql
SELECT * FROM profiles WHERE id = 'user-uuid';
```

#### articles
Blog articles with metadata
```sql
SELECT * FROM articles WHERE is_published = true ORDER BY published_at DESC;
```

#### subscriptions
Active subscriptions linked to Stripe
```sql
SELECT * FROM subscriptions WHERE user_id = 'user-uuid' AND status = 'active';
```

#### newsletter_subscribers
Newsletter email subscribers
```sql
SELECT * FROM newsletter_subscribers WHERE unsubscribed_at IS NULL;
```

## Authentication Flow

### Server-side Authentication
```typescript
import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser() {
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();
  return user;
}
```

### Protected API Routes
```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Your logic here
  return NextResponse.json({ data: "success" });
}
```

## Stripe Integration

### Creating a Subscription
```typescript
import { stripe } from "@/lib/stripe";

const session = await stripe.checkout.sessions.create({
  customer_email: userEmail,
  payment_method_types: ["card"],
  line_items: [
    {
      price: "price_pro_monthly",
      quantity: 1,
    },
  ],
  mode: "subscription",
  success_url: "https://yoursite.com/subscribe/success",
  cancel_url: "https://yoursite.com/subscribe",
  metadata: {
    user_id: userId,
    plan: "pro",
  },
});
```

### Handling Webhook Events
```typescript
case "customer.subscription.created": {
  const subscription = event.data.object as Stripe.Subscription;
  // Update subscription in database
  break;
}
case "customer.subscription.deleted": {
  const subscription = event.data.object as Stripe.Subscription;
  // Mark subscription as canceled
  break;
}
```

## Environment Variables

### Development
Use `.env.local` (gitignored) for local development:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
STRIPE_SECRET_KEY=sk_test_xxx...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_test_xxx...
```

### Production
Set environment variables in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Railway: Variables section
- Render: Environment tab

## Testing

### Test Stripe Integration
1. Use [Stripe Test Cards](https://stripe.com/docs/testing)
2. Common test card: `4242 4242 4242 4242`
3. Monitor events in [Stripe Dashboard](https://dashboard.stripe.com/test/events)

### Test Sentiment Analysis
```bash
curl -X POST http://localhost:3000/api/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"This is amazing"}'
```

### Test Database Connection
```typescript
const { data, error } = await client
  .from('articles')
  .select('*')
  .limit(1);
  
console.log(data, error);
```

## Deployment Checklist

- [ ] Fill all environment variables on deployment platform
- [ ] Set `STRIPE_SECRET_KEY` (not publishable key)
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` if using admin operations
- [ ] Update Stripe webhook URL to production domain
- [ ] Test authentication flow on production
- [ ] Test subscription flow with real Stripe account
- [ ] Monitor error logs in deployment dashboard
- [ ] Set up SSL/HTTPS certificate
- [ ] Configure CORS if needed

## Common Issues

### "SUPABASE_SERVICE_ROLE_KEY not found"
- Only needed for webhook handlers that update database with elevated privileges
- Add to environment variables on deployment platform

### "Stripe webhook not triggering"
- Verify webhook URL is publicly accessible
- Check webhook signing secret matches
- Review logs in Stripe dashboard

### "Authentication always fails"
- Clear browser cookies/cache
- Verify Supabase URL and keys match
- Check auth provider is enabled in Supabase

### "Database queries returning null"
- Verify Row Level Security (RLS) policies
- Check user has permissions for the table
- Ensure user is authenticated

## Performance Tips

1. **Use server components** for database queries
2. **Implement caching** with SWR for client data
3. **Use indexes** on frequently queried columns
4. **Batch operations** when possible
5. **Implement pagination** for large datasets
6. **Cache Stripe objects** to reduce API calls

## Security Best Practices

1. **Never expose STRIPE_SECRET_KEY** or service role key in client code
2. **Validate Stripe webhooks** with signature verification
3. **Implement rate limiting** on API endpoints
4. **Use HTTPS only** in production
5. **Sanitize user input** before database operations
6. **Use parameterized queries** to prevent SQL injection
7. **Implement proper RLS policies** in Supabase

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

For questions or issues:
1. Check the BACKEND_SETUP.md guide
2. Review API route implementations in `app/api/`
3. Check Supabase/Stripe dashboards for errors
4. Review browser console for client-side errors
5. Check server logs for backend errors
