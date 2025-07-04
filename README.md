@@ -2,25 +2,27 @@

This repository contains the source for the Griot web application built with Next.js.

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and edit it:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and provide your `OPENROUTER_API_KEY`. You can also adjust other settings such as the model, email configuration, or JWT secret as needed.
3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Configuration

When deploying to Vercel, set the same environment variables in your project.
Navigate to **Project Settings → Environment Variables** and add `OPENROUTER_API_KEY` along with any optional variables from `.env.local`.
Vercel automatically configures `VERCEL_URL` in production.

On startup the API checks that `OPENROUTER_API_KEY` is defined and throws an error if it isn't found, so be sure to set the key through Vercel's Environment Variables page.
