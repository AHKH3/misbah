# Track Plan: Teacher Onboarding and Profile Activation

## Phase 1: Database & Environment Setup
- [ ] **Task 1: Initialize Supabase Project**
  - Create Supabase project and link local environment.
  - Setup Authentication (Email/Password).
- [ ] **Task 2: Define Schema & Migrations**
  - Create `profiles` and `subscriptions` tables.
  - Create Supabase Storage bucket for `payment-proofs`.
- [ ] **Task 3: Basic Server Actions**
  - Implement basic CRUD actions for profile submission.
- [ ] **Task 4: Commit Phase 1**
  - Commit changes with message `feat(db): initialize supabase schema and storage`.

## Phase 2: Teacher Onboarding UI
- [ ] **Task 1: Guided Profile Form**
  - Build the Next.js form component with validation for all required fields.
- [ ] **Task 2: Payment Activation Step**
  - Build the UI for displaying payment instructions and the file upload component.
- [ ] **Task 3: E2E Test - Onboarding Flow**
  - Write Playwright test to verify a teacher can fill the form and "submit" proof.
- [ ] **Task 4: Commit Phase 2**
  - Commit changes with message `feat(ui): implement teacher onboarding and payment submission flow`.

## Phase 3: Admin Review Interface
- [ ] **Task 1: Admin Dashboard Route**
  - Build a simple, protected page to list pending reviews.
- [ ] **Task 2: Review Actions**
  - Implement "Approve" and "Reject" logic using Server Actions.
- [ ] **Task 3: E2E Test - Admin Review**
  - Write Playwright test to verify an admin can activate a profile and see it change state.
- [ ] **Task 4: Commit Phase 3**
  - Commit changes with message `feat(admin): build manual review and activation dashboard`.

## Phase 4: Verification & SEO Baseline
- [ ] **Task 1: Public Profile Accessibility Check**
  - Ensure `inactive` profiles return 404 or are hidden from public routes.
- [ ] **Task 2: Basic Metadata**
  - Implement basic SEO metadata for the public profile route (once active).
- [ ] **Task 3: Commit Phase 4**
  - Commit changes with message `feat(core): final state validation and seo baseline`.
