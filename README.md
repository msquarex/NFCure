# Supabase Auth Setup

1) Install dependency

```bash
npm i @supabase/supabase-js
```

2) Add env vars (create `.env.local` at project root):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3) Run the app (PowerShell):

- cd "NFCure"
- npm run dev

Auth page lives at `/auth` and supports email/password login and sign up.
