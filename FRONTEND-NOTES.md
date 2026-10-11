# ChelyPay frontend: setup and assumptions

## Setup
1. Copy app/, components/, lib/, types/, proxy.ts and .env.local.example into your project (overwrite app/globals.css, app/layout.tsx, app/page.tsx).
2. Copy .env.local.example to .env.local.
3. In package.json set "dev": "next dev -p 3001" (the backend uses 3000).
4. npm run dev, then open http://localhost:3001

## How it works
- The browser only talks to Next.js (/api/auth/*, /api/backend/*). The JWT lives in an httpOnly cookie and is attached server-side.
- proxy.ts (Next 16's name for middleware) guards /dashboard and checks the JWT expiry.
- The JWT lasts about 20 minutes and there is no refresh endpoint, so users are sent to /login?expired=1 afterwards.
- lib/mappers.ts is the only place that knows backend response shapes.

## Assumptions to verify (only login was confirmed)
- GET /account/get returns an array or { accounts | data: [...] } with accountName, accountNumber, accountAmount.
- GET /transaction/view-transactions returns an array or { transactions | data: [...] }; sender/receiver as ids or populated objects.
- POST /Ai/test-ai expects { prompt } (components/assistant-chat.tsx).
- POST /account/create accepts accountAmount: 0 when no opening balance is given.
- Account numbers are 10 digits (account-forms.tsx, send-form.tsx).
- Currency is NGN (lib/config.ts).

## Ask the backend developer
- Add a "get current user" endpoint and lock down GET /user/users.
- Stop letting clients choose accountAmount on account creation (then remove NEXT_PUBLIC_DEMO_FUNDING).
- Make the AI transfer tool require an explicit confirmation step.
- Document response shapes, and which account a transfer debits (the API takes no source account).
