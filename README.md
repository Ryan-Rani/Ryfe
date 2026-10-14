# Ryfe

Public Pokémon TCG inventory site with a private admin dashboard for cost, asking price, sold price, and profit.

## Stack

- Next.js + TypeScript + Tailwind
- Supabase for sets and products
- Password-protected admin

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. Install and run:

```bash
npm install
npm run dev
```

Public catalog: `/`  
Sets: `/sets`  
Admin: `/admin`
