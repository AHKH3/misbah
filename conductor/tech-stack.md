# Tech Stack: Misbah (مصباح)

## 1. Core Framework
-   **Framework:** **Next.js (App Router)**
-   **Language:** **TypeScript**
-   **Rationale:**
    -   Industry standard for SEO-critical applications.
    -   Unified architecture for both public static pages (SSG/ISR) and dynamic teacher dashboards.
    -   Excellent developer experience and long-term ecosystem stability.

## 2. Database & Backend
-   **Platform:** **Supabase** (PostgreSQL)
-   **ORM/Client:** **Supabase Client** (Native). Prisma is an optional extension but not required for MVP.
    -   *Prisma MAY be introduced in the future only if complex migrations, analytics-heavy queries, or advanced reporting become necessary. It is intentionally excluded from the MVP to preserve operational simplicity.*
-   **Rationale:**
    -   **Relational Model:** Misbah's data (teachers, subjects, subscriptions, payments) is inherently relational and structured. SQL is the correct fit.
    -   **Admin-Heavy Logic:** Complex state management (Draft -> Paid -> Verified -> Active) is managed via the Supabase dashboard and standard relational queries.
    -   **BaaS Convenience:** Supabase handles Authentication and Image Storage (for payment proofs and profile photos) out of the box, reducing backend boilerplate.

## 3. Styling & UI
-   **Methodology:** **CSS Modules** (with optional SASS)
-   **Rationale:**
    -   **Semantic HTML:** Ensures the cleanest possible DOM output for search engine crawlers.
    -   **Performance:** Zero runtime CSS-in-JS overhead. Styles are statically extracted.
    -   **Maintainability:** Enforces a clean separation of concerns and avoids the "class soup" of utility frameworks, aligning with the "Calm" design philosophy.

## 4. Hosting & Infrastructure
-   **Hosting:** **Vercel**
    -   Native Next.js support ensuring optimal performance for images and edge caching.
-   **Search & Discovery:** **SEO-Driven Discovery**
    -   No internal search engine. Discovery is powered by external search engines (Google/Bing) and AI discovery.
    -   Internal navigation relies on lightweight, static filters (e.g., Category and Format links) to maintain SEO-friendly routes.

## 5. Development Tooling
-   **Package Manager:** `npm` (default)
-   **Linting/Formatting:** ESLint + Prettier
-   **Version Control:** Git

## 6. Operational Philosophy
-   Prefer platform-native dashboards (Supabase, Vercel) over custom-built admin tooling.
-   Avoid introducing infrastructure that requires dedicated DevOps maintenance.
-   All critical user flows must be covered by end-to-end tests (Playwright).
-   Production stability and SEO integrity are prioritized over feature velocity.
-   Simplicity is a strategic decision, not a temporary shortcut.
