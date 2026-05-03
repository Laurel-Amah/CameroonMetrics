# CameroonMetrics (Cameroon Financial News)

This repository is a **Next.js** news desk application: a public reader site plus an **editor/admin** area backed by **Supabase** (database and authentication). You can run everything on your laptop for review and testing before deploying to production.

---

## What you need installed

- **Node.js** 18.18 or newer (20 LTS recommended). Check with `node -v`.
- **npm** (comes with Node). Check with `npm -v`.
- A **Supabase** account (free tier is fine) for database and login.
- *(Optional)* An **OpenAI API key** if you want AI-assisted drafts from URLs or pasted text. You can still create and publish articles **manually** without it.

---

## 1. Get the project and install dependencies

From a terminal in the folder where you keep projects:

```bash
cd cameroon-financial-news
npm install
```

---

## 2. Create a Supabase project and database

1. In [Supabase](https://supabase.com), create a new project and wait until it is fully provisioned.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the migration script **first** (creates tables, security rules, and storage setup):

   - Open the file `supabase/migrations/0001_init.sql` from this project in a text editor.
   - Copy its full contents into the SQL Editor and run it.

4. *(Optional but useful for a populated demo site)* Run the seed file **second**:

   - Open `supabase/seed.sql`, copy all of it, run it in the SQL Editor.  
   - If the editor reports that `public.articles` does not exist, go back and run `0001_init.sql` first.

5. **Enable email login for the admin**

   - In Supabase: **Authentication → Providers → Email** — ensure email/password sign-in is enabled (default is usually on).
   - **Authentication → Users → Add user** — create a user with email and password you will use to log into the admin panel.

Row-level security is already defined in the migration: visitors can only read **published** articles; signed-in users can manage drafts.

---

## 3. Configure environment variables on your laptop

1. In the project root, copy the example env file:

   ```bash
   copy .env.local.example .env.local
   ```

   On macOS/Linux use `cp .env.local.example .env.local`.

2. Edit **`.env.local`** (this file is **not** committed to git — keep it private).

   | Variable | Where to find it |
   |----------|------------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase **Project Settings → API → Project URL** |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **Project Settings → API** — use the **anon public** key (or the publishable key your Supabase project shows for browser clients) |

3. **OpenAI (optional)**

   - Set `OPENAI_API_KEY` if you use **New draft → From URL / Pasted text** and want the model to structure content.
   - Leave it empty if you only use **Write manually** or the **blank draft** fallback when the API fails.

4. Restart the dev server after any change to `.env.local`.

---

## 4. Run the site locally

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

- **Public site** — home page, articles, markets/sectors sections as implemented.
- **Admin / editor** — go to **http://localhost:3000/admin/login** and sign in with the Supabase user you created.  
  From there you can create drafts (including **manual** drafts without AI), edit, and **publish** so stories appear on the public site.

---

## 5. Check that a production build works (recommended before deployment)

```bash
npm run build
npm run start
```

Visit **http://localhost:3000** again. This mirrors how many hosts (e.g. Vercel) run the app.

---

## 6. Useful commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development with hot reload |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npm run generate:seed` | Regenerate seed SQL from mock data (advanced; main seed is `supabase/seed.sql`) |

---

## 7. Deployment checklist (when you are ready)

- Use the **same** Supabase project (or a duplicate project with the same migration + seed applied).
- Set the **same** environment variables on your host (**Vercel**, **Netlify**, etc.) as in `.env.local`, especially `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Set `OPENAI_API_KEY` on the server only if you use AI extraction/regeneration; never expose a **service role** key to the browser.
- Run `npm run build` in CI or rely on the platform’s build step to catch errors before go-live.

---

## Troubleshooting

- **Blank article list but data in Supabase** — Articles must have **`status = published`** and be visible under your RLS rules. Publish from the admin or set status in SQL for testing.
- **Cannot log in** — Confirm the user exists under **Authentication → Users** and email/password provider is enabled.
- **AI features fail** — Confirm `OPENAI_API_KEY` or use **Write manually** / **Create blank draft** under **New draft**.

For database structure and policies, see `supabase/migrations/0001_init.sql`.
