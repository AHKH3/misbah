# Product Guide: Misbah (مصباح)

## 1. Project Vision
**Misbah** is a specialized, SEO-first professional directory dedicated to independent teachers of the Qur’an, Arabic language, and Islamic studies.

The core philosophy is **"Visibility as the Product."** Misbah is purely a listing service designed to give teachers a stable, indexable, and discoverable presence on the open web. It deliberately rejects the complexities of marketplaces, booking systems, and payment processing to focus entirely on long-term organic discovery.

### Success Metric
The primary MVP success metric is:
> "The number of active, stable teacher profile pages that are successfully indexed by Google/Bing and remain publicly accessible over time."

**Connection to Outcomes:** While indexing is the technical success, the ultimate real-world value is measured by the **direct contact** initiated by students via the teacher's listed contact methods, which is only possible if the page is discoverable and ranks effectively.

---

## 2. Core Value Proposition
**For Teachers:**
"A simple, permanent, and discoverable professional page on the web without the hassle of building a website."

**For Visitors:**
"A clean, direct way to find independent teachers without forced sign-ups, hidden fees, or platform intermediaries."

**Key Differentiation:**
- **Zero Intermediation:** Students contact teachers directly.
- **SEO-First Design:** Every profile is built to rank independently.
- **AI-Ready:** Explicitly optimized for LLM discovery via `llms.txt`.
- **Strict Scope:** Exclusively for Qur’an, Arabic, and Islamic studies.

---

## 3. Target Audience
| Segment | Description | Needs |
| :--- | :--- | :--- |
| **Primary (Customers)** | Independent Teachers | Simple web presence, SEO visibility, low cost, no technical maintenance. |
| **Secondary (Users)** | Students/Parents | Trustworthy listings, direct contact info, no login walls. |
| **System (Users)** | Search Bots & LLMs | Semantic HTML, structured data, clear site boundaries (`llms.txt`). |

---

## 4. Feature Scope (MVP)
### ✅ Included (Core Features)
1.  **Teacher Profiles (Paid-First Onboarding):**
    -   **Onboarding Philosophy:** No account or profile data is persisted in the public-facing or primary database until payment is manually approved. The onboarding is a guided session that leads directly to the payment step.
    -   Structured data input (Subject, Audience, Experience, Format).
    -   Manual subscription activation workflow.
    -   SEO-optimized public pages (SSR/Static).
2.  **Public Directory:**
    -   Home page with clear value prop.
    -   Category pages (e.g., "Quran Teachers", "Arabic Tutors").
    -   **Browsing:** Discovery via lightweight filters (Subject, Format) rather than a complex internal search engine, prioritizing SEO-friendly static category routes.
3.  **Admin Dashboard:**
    -   Profile review queue (Approve/Reject).
    -   Payment proof verification.
    -   Subscription status management.
4.  **AI Discovery Layer:**
    -   `llms.txt` (Hybrid: Static definition + Dynamic sitemap references).
    -   Schema.org markup for Person/Service.

### ❌ Explicitly Excluded
-   Student accounts or logins.
-   On-platform messaging or chat.
-   Internal full-text search engine.
-   Booking, scheduling, or calendars.
-   Automated payment gateways (Stripe/PayPal).
-   Reviews, ratings, or "verified" badges.
-   Video hosting or classroom tools.

---

## 5. Content & Quality Guidelines
**Admin Review Criteria:**
The platform performs a discretionary manual review to protect directory quality and SEO integrity.
-   **Scope Enforcement:** Strictly strictly limits subjects to Qur’an, Arabic, and Islamic Studies.
-   **Human Authenticity:** Rejects clearly fake, spammy, or non-human profiles.
-   **Content Quality:** Rejects keyword stuffing and misleading/unverifiable claims (e.g., "guaranteed results").
-   **Disclaimer:** All profiles must carry a standardized disclaimer: *"Credentials and claims on this page are provided by the teacher and have not been independently verified."*

---

## 6. Business & Legal Model
-   **Model:** Paid Subscription (Listing Fee).
-   **Paid-First Logic:** The platform does not store "draft" or "inactive" profile data for non-paying users. Data persistence begins only upon manual payment approval and profile activation.
-   **Payment:** Manual/Offline only. No platform transaction fees.
-   **Legal Stance:** Directory only. Not an employer, school, or marketplace.
-   **Pricing:** Hidden from public. Visible only to teachers during the activation step.

---

## 7. AI & SEO Strategy
-   **Keywords:** High-intent terms (e.g., "Online Quran Teacher for adults").
-   **LLM Optimization:**
    -   `llms.txt` clearly defines Misbah as a **directory**, preventing AI hallucinations about it being a teaching platform.
    -   Profiles use semantic HTML to be easily parsed by RAG systems.
