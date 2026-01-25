# Product Guidelines — Misbah (مصباح)
Status: Authoritative / Final  
Enforcement: Strict Compliance Required  

This document defines **how Misbah operates**.
It is the single source of truth for product behavior, rules, and boundaries.
If something is not explicitly allowed here, it is forbidden.

---

## 1. Product Scope & Identity

### 1.1 What Misbah IS
- A **public directory** for independent teachers.
- Focused on long-term **visibility and discoverability**.
- Profiles are static, indexable, and publicly accessible.
- Students contact teachers **directly**, outside the platform.

### 1.2 What Misbah IS NOT
- Not an academy.
- Not a marketplace.
- Not a booking or scheduling system.
- Not a payment processor for students.
- Not a verification authority.
- Not a hiring or employment platform.

Misbah does not mediate, supervise, rank, recommend, or endorse teachers.

---

## 2. Allowed Users (Strict)

### 2.1 Allowed
- **Individual teachers only**
- Independent freelancers
- Teaching privately (online or local)

### 2.2 Explicitly Forbidden
- Academies
- Institutes
- Schools
- Teams of teachers under one brand
- Any organizational or institutional entity

If an account represents more than one teacher → **reject immediately**.

---

## 3. Subject Matter Scope

### 3.1 Allowed Subjects ONLY
- Qur’an (Reading, Tajweed, Memorization)
- Arabic Language (Classical / Quran-focused)
- Islamic Studies (Fiqh, Aqeedah, Seerah)

### 3.2 Forbidden Subjects
- Non-Islamic studies
- Secular tutoring
- Coaching / life coaching
- Language teaching unrelated to Arabic
- Any commercial or motivational content

Out-of-scope content → **automatic rejection**.

---

## 4. Teacher Lifecycle (State Machine)

> **See full specification:** [onboarding-spec.md](./onboarding-spec.md)

A teacher profile can only exist in one of the following states:

| State | Description |
|-------|-------------|
| `draft` | Teacher is filling data (5-step wizard) |
| `under_review` | Submitted, awaiting admin review |
| `needs_changes` | Admin requested modifications |
| `approved` | Accepted, awaiting account creation + payment |
| `published` | Live in directory |
| `suspended` | Suspended (complaints/violations/expired) |

### 4.1 Draft Policy
- Drafts **are** stored during the 5-step wizard.
- No user account is created until after approval.
- Profile is linked to user only upon invitation acceptance.

---

## 5. Subscription & Pricing Logic

### 5.1 Pricing Model
- Listing subscription (visibility fee)
- No per-student fees
- No commissions

### 5.2 Pricing Structure
- **Base price:** 600 EGP / year
- **First-year discount:** 50%
- **First year price:** 300 EGP
- Renewal returns to full price

Pricing is:
- Hidden from public pages
- Visible only during activation flow

---

## 6. Activation Flow (Mandatory Order)

> **See full specification:** [onboarding-spec.md](./onboarding-spec.md)

### Phase 1: Onboarding (No Auth Required)
1. **Step 1:** Basic info + structured experience
2. **Step 2:** Specialization + qualifications
3. **Step 3:** Target audience + pricing
4. **Step 4:** Contact methods + sample video
5. **Step 5:** Preview + legal acknowledgement + submit
6. Profile enters `under_review`

### Phase 2: Admin Review
7. Admin performs manual review
8. Decision: `approved` | `rejected` | `needs_changes`

### Phase 3: Account Creation (After Approval Only)
9. Invitation email sent with 72h token
10. Teacher creates password via `/invite/[token]`
11. Profile linked to new user account

### Phase 4: Payment & Publication
12. Teacher completes payment
13. Profile status → `published`

No step may be skipped or reordered.

---

## 7. Manual Review Policy (Human-Only)

### 7.1 Review Responsibility
- All reviews are **human**
- No automated approvals
- Review includes payment + content

### 7.2 Review Timeframe
- Up to **24 hours**
- Communicated clearly to the teacher

---

## 8. Rejection Criteria (Non-Negotiable)

A profile MUST be rejected if any of the following apply:

- Out-of-scope subjects
- Institutional / academy identity
- Spam, exaggerated, or misleading claims
- Keyword stuffing
- Low-quality or irrelevant video
- Inappropriate language or tone
- Attempting to treat Misbah as an employer or academy
- Failure to follow instructions

Rejected profiles may reapply from scratch.

---

## 9. Video Policy (Critical)

### 9.1 Mandatory Video
- **One educational sample video is REQUIRED**
- Purpose: demonstrate teaching or subject competence
- Accepted types:
  - Lesson excerpt
  - Explanation
  - Quran recitation (for Quran teachers)

### 9.2 Optional Video
- Introductory/self-promotion video is **NOT required**
- Teachers are not forced to “sell themselves”

### 9.3 Technical Rules
- Videos must be hosted on **YouTube**
- Misbah does not host or stream videos
- Only links are stored

### 9.4 Rejection Rules
- Poor audio
- Irrelevant content
- Video addressing Misbah instead of students
- Platform misuse or misunderstanding

---

## 10. Profile Content Rules

### 10.1 Required Fields
- Full name
- Country
- Subjects taught
- Target audience
- Teaching format (online / local)
- Experience summary
- Direct contact method
- Educational video link

### 10.2 Writing Rules
- Neutral, factual tone
- No marketing language
- No guarantees
- No unverifiable claims

### 10.3 Forbidden Phrases
- “Best”
- “Top”
- “Guaranteed”
- “Certified by Misbah”
- “Official teacher”

---

## 11. Contact & Interaction

- All contact happens **outside** the platform
- Allowed contact methods:
  - WhatsApp
  - Email
  - Telegram
- Misbah does not monitor conversations

---

## 12. Trust, Neutrality & Legal Position

### 12.1 Platform Neutrality
- Misbah does not verify credentials
- Misbah does not rank or compare teachers
- No reviews or ratings

### 12.2 Mandatory Disclaimer
Every profile must display:

> “Misbah is a public directory. Information on this page is provided by the teacher and has not been independently verified. Students are responsible for verifying suitability.”

---

## 13. Teacher Status Indicators

### 13.1 Allowed
- Availability status (Accepting students / Limited / Not accepting)

### 13.2 Forbidden
- Number of current students
- Income claims
- Success metrics

---

## 14. Explicit Non-Features

Misbah will NEVER include:
- Student accounts
- Internal messaging
- Scheduling
- Payments from students
- Teacher ranking
- Recommendation algorithms
- Academy listings

---

## 15. Enforcement Principle

Misbah prioritizes:
- Clarity over growth
- Quality over volume
- Individual empowerment over institutions

Any feature that compromises these principles is forbidden.

---

## 16. SEO Philosophy (Core Principle)

> **See full document:** [seo-philosophy.md](./seo-philosophy.md)

### 16.1 Fundamental Principle

Misbah provides **SEO readiness**, not visibility guarantee.

- Having a teacher page = owning an eligible digital asset
- Indexing ≠ Ranking
- Most teacher pages may remain silent in search — **this is correct and intentional**

### 16.2 Forbidden Patterns

- Designing for "show everyone" instead of natural selection
- Internal keyword cannibalization between teacher pages
- Mass pushing for results with no real search demand
- Creating visibility expectations with teachers

### 16.3 Required Approach

- Unique, honest metadata per teacher page
- Structured data reflecting real information only
- Letting search engines choose naturally
- Clear communication with teachers: "eligibility to win, not guarantee"

This principle is **non-negotiable** and defines Misbah's identity as a Professional Directory.

---

End of Product Guidelines — Misbah
