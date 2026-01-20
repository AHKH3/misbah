# Track Spec: Teacher Onboarding and Profile Activation

## 1. Overview
This track implements the primary "Paid-First" onboarding journey for teachers. It covers the flow from initial data entry to manual payment submission and final admin approval.

## 2. User Stories
- **As a Teacher**, I want to provide my profile details (subject, audience, etc.) in a guided form.
- **As a Teacher**, I want to see payment instructions and upload a screenshot of my payment proof.
- **As an Admin**, I want to review submitted profiles and payment proofs to activate or reject listings.

## 3. Technical Requirements

### A. Data Model (Supabase/Postgres)
- **Profiles Table:** `id`, `user_id` (auth), `full_name`, `subjects` (array), `audience` (array), `experience_text`, `teaching_format` (enum), `contact_method` (jsonb), `status` (enum: pending_payment, payment_submitted, active, inactive), `created_at`, `updated_at`.
- **Subscriptions Table:** `id`, `profile_id`, `plan_id` (monthly), `payment_proof_url`, `status` (enum: pending, verified, rejected), `verified_at`, `expires_at`.

### B. Teacher Onboarding Flow (Next.js)
1.  **Form Step:** A multi-part or single guided form capturing all required fields (A-E from requirements).
2.  **Activation Step:**
    -   Displays the monthly pricing (static text).
    -   Displays manual payment instructions (e.g., local transfer info).
    -   File upload field for "Proof of Payment" (Supabase Storage).
3.  **Submission:** Updates profile status to `payment_submitted`.

### C. Admin Review Interface
-   A protected route (`/admin/review`) listing all profiles with `payment_submitted` status.
-   View profile details and the uploaded payment proof image.
-   Actions: **Activate** (Sets profile to `active` and subscription to `verified`) or **Reject** (with reason).

## 4. Constraints
- **Paid-First:** Profiles are NOT publicly accessible or indexed unless `status === 'active'`.
- **Simplicity:** Use Supabase's built-in Auth and Storage. No custom backend logic beyond Next.js Server Actions.
- **Scope Enforcement:** Form inputs for "Subjects" must be restricted to the allowed domains (Quran, Arabic, Islamic Studies).
