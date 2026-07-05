# APP-01 - Auth, Student Dashboard, and Module Cards

## Goal

Build the first real app foundation for Toronto Academy CELPIP Practice.

This ticket adds user authentication, protected student dashboard, profile creation, and module cards.

Do not build recording yet.
Do not build transcription yet.
Do not build AI scoring yet.
Do not build payment yet.
Do not build the full speaking practice screen yet.

## Product name

Toronto Academy CELPIP Practice

## Current product direction

The app is a Toronto Academy test-prep platform.

First active module:
CELPIP Speaking Practice

Future modules:
CELPIP Writing Practice
CELPIP Reading Practice
CELPIP Listening Practice
Live CELPIP Classes

## User flow for this ticket

1. User visits the landing page at /
2. User can click a sign in or get started button
3. User can create an account
4. User can log in
5. User is redirected to /dashboard
6. User sees module cards
7. CELPIP Speaking is active
8. Writing, Reading, Listening, and Live Classes show as coming soon
9. User can sign out

## Required routes

Create or update:

src/app/(auth)/login/page.tsx
src/app/(auth)/signup/page.tsx
src/app/auth/callback/route.ts
src/app/dashboard/page.tsx
src/app/dashboard/loading.tsx
src/app/dashboard/error.tsx

Optional if useful:

src/app/(app)/layout.tsx

## Required components

Create:

src/components/auth/LoginForm.tsx
src/components/auth/SignupForm.tsx
src/components/app/AppHeader.tsx
src/components/app/ModuleCard.tsx
src/components/app/SignOutButton.tsx
src/components/app/DashboardShell.tsx

## Required Supabase helpers

Use the existing Supabase helpers from INFRA-01:

src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts

Do not expose the service role key to client components.

## Database migration

Create:

supabase/migrations/002_auth_profile_trigger.sql

The migration should create or replace a trigger function that automatically creates a public.profiles row when a new auth.users row is created.

The profile row should include:
- id
- email
- full_name from raw_user_meta_data if available
- role as student

Also make sure updated_at is maintained on profile updates if not already handled.

## Auth requirements

Use Supabase Auth.

Signup form fields:
- full_name
- email
- password

Login form fields:
- email
- password

After successful signup:
- show a friendly message if email confirmation is required
- otherwise redirect to /dashboard

After successful login:
- redirect to /dashboard

Dashboard:
- must be protected
- if no user session exists, redirect to /login
- fetch modules from public.modules
- display active and coming soon modules

Sign out:
- signs user out
- redirects to /

## Landing page update

Update the existing public landing page header or CTA area to include:

- Sign in
- Get started

Get started should go to /signup.
Sign in should go to /login.

Do not redesign the landing page in this ticket. Only add small navigation links or buttons if needed.

## Dashboard design

Keep the dashboard clean and professional.

Dashboard sections:

1. Header
- Toronto Academy CELPIP Practice
- Signed in user email
- Sign out button

2. Welcome card
Heading:
Welcome to your CELPIP practice dashboard

Text:
Start with CELPIP Speaking Practice. More practice modules are coming soon.

3. Module cards

CELPIP Speaking Practice:
- status active
- button text: Open module
- link can go to # for now or /dashboard?module=celpip-speaking until the speaking module ticket exists

CELPIP Writing Practice:
- coming soon

CELPIP Reading Practice:
- coming soon

CELPIP Listening Practice:
- coming soon

Live CELPIP Classes:
- coming soon

Do not build the module detail page yet.

## Copy requirements

Use Toronto Academy branding.

Do not mention Georgo Academy in the dashboard.

Use this disclaimer somewhere subtle in the app footer or dashboard:
Practice estimates and feedback are for preparation only and are not official CELPIP scores.

## Environment variables

Use:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL

Do not use old SUPABASE_URL.

## Manual hosted Supabase workflow

We are using hosted Supabase only.

Do not require local Supabase.
Do not require Supabase CLI.
Create the SQL migration locally, but the user will manually copy and run it in hosted Supabase SQL Editor.

## Security requirements

- .env.local must stay ignored
- service role key must not be imported in client components
- dashboard must use server-side session check
- client forms must use the browser Supabase client only
- protected routes must not show dashboard data without a session

## Important UI copy rule

Do not use long hyphens or em dashes anywhere in UI copy, comments, docs, or prompts. Use normal hyphens only.

## Done criteria

- /login page works
- /signup page works
- /dashboard is protected
- successful login redirects to /dashboard
- sign out works
- dashboard shows module cards from Supabase modules table
- landing page has sign in and get started links
- profile row is created for new signups after migration is run
- npm run lint passes
- npm run build passes
- no secrets are committed
- no service role key is used in client components
EOF