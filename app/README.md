# Podomoro

A Pomodoro timer application built with Next.js 14, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm

### Installation

```bash
npm install
```

### Development

Start the development server on [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

### Build

Create a production build:

```bash
npm run build
```

### Lint

Run ESLint to check for code quality issues:

```bash
npm run lint
```

### Start Production Server

After building, start the production server:

```bash
npm start
```

## Project Structure

```
app/
├── app/
│   ├── api/            # API routes (backend)
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles (Tailwind)
├── components/         # Reusable UI components
├── lib/                # Utility functions and helpers
├── data/               # Data storage (sessions.json, etc.)
├── public/             # Static assets
├── tailwind.config.ts  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── next.config.mjs     # Next.js configuration
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (dark mode via `class` strategy)
- **Package manager:** npm
