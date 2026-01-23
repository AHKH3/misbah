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

A teacher profile can only exist in one of the following states:

1. **Submitted**
2. **Under Review**
3. **Active**
4. **Rejected**
5. **Expired**

### 4.1 No Drafts Policy
- The platform does **not** store unpaid drafts.
- No permanent record exists before payment proof submission.
- Persistence begins only after submission + payment proof.

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

1. Teacher fills structured profile data
2. Teacher selects subscription
3. Teacher uploads payment proof
4. Teacher acknowledges platform disclaimer
5. Profile enters **Under Review**
6. Admin performs manual review
7. Profile is either **Active** or **Rejected**

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
