# Mohammad Sabith Portfolio

A fresh chat-first portfolio for Mohammad Sabith. The active build is a public one-page Next.js app that presents the portfolio as a grounded AI conversation instead of a traditional scrolling resume site.

## Active App

The new portfolio lives in `site/`.

It includes:

- a GPT-style chat interface with Sabith as the portfolio voice
- grounded answers for experience, projects, skills, resume, and contact
- Gemini server-side integration with local portfolio guardrails
- rich response cards for projects, experience, and contact actions
- a direct `resume.pdf` route for resume access

## Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Google Gemini via `@google/genai`
- Upstash rate limiting support

## Local Development

From the `site/` folder:

```bash
npm install
npm run dev
```

If `next dev` has trouble in your shell, you can still verify the app with:

```bash
npm run build
npm run start
```

## Environment Variables

Create `site/.env.local` with the variables from `site/.env.example`:

```bash
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Notes:

- `GEMINI_API_KEY` is required for live model responses
- without Upstash credentials, the app falls back to in-memory rate limiting
- `.env.local` is intentionally ignored and should never be committed

## Deployment

Deploy the `site/` directory as the Vercel project root.

Recommended settings:

- Framework preset: `Next.js`
- Root directory: `site`
- Build command: `npm run build`
- Install command: `npm install`

## Project Status

This repository still contains some legacy template history from the earlier portfolio base, but the current portfolio work is centered on the `site/` app.

