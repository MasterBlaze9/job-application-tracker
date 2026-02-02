# Job Application Tracker

A lightweight Kanban-style job application tracker built with Next.js and MongoDB. It provides boards, columns, drag-and-drop job application cards, and user authentication.

## Features

- User sign-up / sign-in (email & password)
- Per-user default board initialization
- Kanban board with drag-and-drop columns and cards
- Create and manage job applications (title, company, notes, status)
- Seed script to populate sample job applications

## Tech Stack

- Next.js (App Router)
- React 19
- Tailwind CSS
- MongoDB + Mongoose
- better-auth for authentication
- @dnd-kit for drag-and-drop UI

## Getting Started

Prerequisites:

- Node.js 18+ and a package manager (`npm`, `pnpm`, or `yarn`)
- A MongoDB connection URI

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Available npm scripts (from `package.json`):

- `dev` - run Next.js in development mode
- `build` - build for production
- `start` - run built app
- `lint` - run ESLint
- `seed:jobs` - seed sample job applications (`tsx --env-file=.env.local script/seed.ts`)

## Environment Variables

Create a `.env.local` file at the project root with the variables below (example values omitted):

- `MONGODB_URI` — MongoDB connection string used by `lib/db.ts`
- `NEXT_PUBLIC_BASE_URL` — public base URL used by auth trusted origins (e.g. `http://localhost:3000`)
- `NEXTAUTH_URL` — optional NextAuth URL (used by some auth flows)
- `VERCEL_URL` — optional when deploying to Vercel (used for trusted origins)

The project will throw an error if `MONGODB_URI` is not set when trying to connect.

## Database & Auth Notes

- Database connection logic lives in `lib/db.ts` and uses `mongoose`.
- Authentication is implemented with `better-auth` and the MongoDB adapter in `lib/auth`.
- When a new user is created the code initializes a default board for them via `lib/init-user-board.ts`.

## Seeding Sample Data

To seed sample job applications (reads `.env.local`), run:

```bash
npm run seed:jobs
```

## Project Structure (high-level)

- `app/` — Next.js app routes and pages
- `components/` — shared React components (boards, cards, dialogs)
- `lib/` — utilities, DB connection, auth, actions
- `public/` — static assets
- `script/seed.ts` — seed script for demo data

## Development Tips

- Edit the UI in `components/` and page layouts in `app/`.
- The kanban interactions use `@dnd-kit` and client components — check `components/kanban-board.tsx` and `components/kanban-board-client.tsx`.
- Use the `seed:jobs` script to generate test data for a fresh database.

## Deployment

This project is ready to deploy to Vercel. Ensure the environment variables above are set in your deployment settings.

## Contributing

Contributions are welcome. Open issues or PRs for bug fixes and improvements. Keep changes focused and run linting before submitting.

## License

This repository has no license specified. Add a `LICENSE` file if you want to choose one.

---

If you'd like, I can also add a minimal `.env.local.example` template or update `package.json` scripts. Which would you prefer next?
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
