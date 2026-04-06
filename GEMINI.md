# Misbah (مصباح) - Project Context

## Project Overview
**Misbah** is a public, SEO-first directory for independent teachers of Quran, Tajweed, and Arabic. Its core philosophy is "visibility without interference." It acts solely as a discovery layer, not an academy or marketplace.

*   **Primary Goal:** Enable students to find independent teachers directly via search engines (SEO) and AI tools.
*   **Core Constraint:** Misbah **never** intermediates lessons, payments (between student/teacher), or scheduling. It does not rank teachers or provide "top lists."
*   **Target Audience:** Independent teachers (seeking autonomy) and serious students (seeking clarity).

## Tech Stack
*   **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript.
*   **Backend/DB:** Supabase (PostgreSQL, Auth, Storage) via native client.
*   **State Management:** Zustand.
*   **Styling:** CSS Modules (semantic, zero-runtime).
*   **Testing:** Playwright (E2E-first approach).
*   **Deployment:** Vercel.

## Key Directories
*   `conductor/`: **Authoritative Source of Truth.** Contains all product specs (`product.md`), tech decisions (`tech-stack.md`), and workflow protocols (`workflow.md`). Always check here for business logic validation.
*   `src/app/`: Next.js App Router structure.
    *   `(legal)/`: Static legal pages (Privacy, Terms).
    *   `admin/`: Admin dashboard (Review, Audit).
    *   `directory/`: Public teacher listing.
    *   `onboarding/`: Teacher registration wizard.
    *   `teachers/[id]/`: Public teacher profiles.
*   `src/lib/`: Shared utilities, data constants, and Supabase clients.
*   `supabase/migrations/`: Database schema definitions.
*   `tests/`: Playwright E2E test suites.

## Development & Testing
*   **Run Dev Server:** `npm run dev`
*   **Build:** `npm run build`
*   **Lint:** `npm run lint`
*   **Run E2E Tests:** `npx playwright test` (or `npx playwright test --ui` for interactive mode)

## Critical Guidelines
1.  **Conductor First:** Before implementing features, check `conductor/` for specific constraints.
2.  **No Ratings/Reviews:** Never suggest or implement features that "rank" teachers.
3.  **Video Policy:** Teachers must provide an *educational* sample, not a promotional intro.
4.  **Simplicity:** Prefer native Supabase/Vercel dashboards over building custom admin tools where possible.
5.  **SEO Integrity:** Semantic HTML and metadata are higher priority than complex UI interactions.
