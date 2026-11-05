# Deployment Instructions for Café Artesanal Platform

To host this application in the cloud for free, we will use **Vercel** for the Next.js frontend/backend and **Supabase** for the PostgreSQL database. Both offer excellent free tiers.

## Step 1: Set up Supabase (Database)
1. Go to [Supabase](https://supabase.com) and create an account.
2. Click "New Project" and choose an organization and project name (e.g., "CafePlatform"). Set a strong database password and remember it.
3. Once the database finishes provisioning, go to the **SQL Editor** (on the left menu).
4. Copy the entire contents of `supabase/schema.sql` from this repository, paste it into the SQL Editor, and click "Run". This sets up your tables and views.

## Step 2: Get Supabase Credentials
1. In your Supabase dashboard, go to **Project Settings** (the gear icon) > **API**.
2. Under "Project URL", copy the URL. This will be your `NEXT_PUBLIC_SUPABASE_URL`.
3. Under "Project API keys", copy the `anon` `public` key. This will be your `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Step 3: Deploy to Vercel (Hosting)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com) and log in with your GitHub account.
3. Click "Add New..." > "Project".
4. Import your GitHub repository.
5. In the "Configure Project" screen, before clicking Deploy, open the **Environment Variables** section.
6. Add the following variables (using the values you got in Step 2):
   - Name: `NEXT_PUBLIC_SUPABASE_URL` | Value: `[your-supabase-url]`
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Value: `[your-supabase-anon-key]`
7. Click **Deploy**. Vercel will automatically build and host your application.

## Admin Access
Currently, the admin panel is located at `[your-vercel-url]/admin`. For a production application, you should add NextAuth or Supabase Auth to protect this route. 
