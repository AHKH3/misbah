# UI / UX Guidelines — Misbah (مصباح)

Status: Authoritative / Final
Enforcement: Strict Compliance Required

This document defines the **visual system, interaction rules, and UX behavior** of Misbah.
It must be followed exactly by humans and models.
If a design decision is not explicitly allowed here, it is forbidden.

---

## 0. Design Authority

* This document governs **all screens**: landing, directory, profile, onboarding, admin.
* No page-level improvisation is allowed.
* Reuse existing components when possible; if none exist, create new ones **only** according to Section 6.
* Personal taste, trends, and decoration are forbidden.

---

## 1. Core Philosophy — Quiet Depth

### 1.1 Purpose

Misbah is used to make **serious decisions** (choosing a teacher), not to browse content.
The interface must support scanning, comparison, and trust.

### 1.2 Principles

* **Content Over Chrome:** Content is primary; UI recedes.
* **Calm, Not Empty:** Space is structured and intentional, never blank or vague.
* **Premium Through Restraint:** Quality is communicated by precision, not color or motion.

---

## 2. Geometry & Spacing — The 8px Law

### 2.1 Absolute Rule

All spacing MUST be a multiple of 8px (or 4px for micro-spacing).
Forbidden values include: 10px, 12px, 15px, 20px, percentages.

### 2.2 Spacing Scale

* 4px — Micro (badge padding, icon gaps)
* 8px — Base
* 16px — Component separation
* 24px — Card internal padding
* 32px — Section separation
* 48px — Major breaks
* 64px — Page top/bottom clearance

### 2.3 Layout Width

* **Max width:** 680px (strict)
* Single-column layout only
* No sidebars

---

## 3. Color System — Luminance-Based Monochrome

### 3.1 Surfaces

* **Ground:** #FAFAFA (base background)
* **Card:** #FFFFFF (floating surfaces)

### 3.2 Ink (Text)

* **Strong:** #0A0A0A (headings, primary actions)
* **Body:** #52525B (reading text — never pure black)
* **Subtle:** #A1A1AA (meta, labels)

### 3.3 Borders & Shadows

* **Ghost Border:** rgba(0,0,0,0.06) — optional, never required
* **Shadow (Rest):** 0 4px 12px rgba(0,0,0,0.04)
* **Shadow (Lift):** 0 12px 32px -4px rgba(0,0,0,0.08)

No colored borders. No gradients. No glows.

---

## 4. Typography — Editorial System

### 4.1 Fonts

* **Primary:** Inter
* **Arabic Support:** Amiri (used automatically when Arabic content appears)

### 4.2 Type Scale

* **H1:** 3rem | 600 | -0.03em | LH 1.05
* **H2:** 1.5rem | 600 | -0.025em
* **H3:** 1.125rem | 600 | -0.015em
* **Body:** 1.0625rem (~17px) | 400 | LH 1.6
* **Micro Label:** 0.75rem | Uppercase | 600 | +0.06em

### 4.3 Alignment

* All text is **start-aligned**
* Centering allowed ONLY for:

  * Page snapshot headers
  * Short hero descriptions

---

## 5. Core Components (Mandatory System)

### 5.1 Cards — “Invisible Card”

* Background: Card surface
* Radius: 24px
* Padding: 24px
* Shadow: Rest state only

**Hover (Lift):**

* translateY(-4px)
* scale(1.005)
* shadow: Lift
* z-index: 10

Cards must never feel boxed or outlined.

---

### 5.2 Buttons — Tactile System

There are exactly **two button types**.

#### Primary Button

* Shape: Pill (radius 999px)
* Height: 48px (minimum)
* Background: #0A0A0A
* Text: White

**Hover:** Lift + shadow (no color change)
**Active:** scale(0.96–0.98)

#### Ghost Button

* Background: Transparent
* Text: Body ink
* Border: 1px Ghost

Used for secondary actions only.

No other button styles are allowed.

---

### 5.3 Badges — Structured Information

Badges are REQUIRED to surface key data.

* Radius: 8px (not pills)
* Background: Ground
* Border: Ghost
* Padding: 4px × 8px

Use badges for:

* Subjects
* Audience
* Format (Online / Local)
* Availability status

Never place this data in long paragraphs.

---

### 5.4 Avatars & Images

* All avatars must include a **white ring**:
  `box-shadow: 0 0 0 2px white`
* Images may be grayscale or neutral
* Directory listings MUST show teacher avatar

---

## 6. Component Creation Rules (Critical)

### 6.1 Reuse First

If a component exists that fits the purpose → reuse it.

### 6.2 Creating a New Component

Allowed ONLY if:

* No existing component fits
* The component serves a **functional purpose**

New components must define:

* Geometry (spacing)
* States (rest / hover / active)
* Role (what information it surfaces)

Decorative components are forbidden.

---

## 7. Motion & Interaction Physics

### 7.1 Motion Philosophy

Motion communicates **weight and affordance**, not delight.

### 7.2 Allowed Curves

* **Elastic Hover:** cubic-bezier(0.175, 0.885, 0.32, 1.15)
* **Smooth Transition:** cubic-bezier(0.16, 1, 0.3, 1)

### 7.3 Duration

* ≤ 300ms

Linear animations are forbidden.

---

## 8. Layout Logic & RTL Safety

### 8.1 Required Properties

* margin-inline-start / end
* padding-inline-start / end
* text-align: start

### 8.2 Forbidden Properties

* margin-left / right
* padding-left / right
* text-align: left

The layout must work for English and Arabic without redesign.

---

## 9. Content Presentation Rules

### 9.1 No Fluff Policy

* Neutral, factual tone
* No marketing language

### 9.2 Structure

* No walls of text
* Break content into:

  * Sections
  * Cards
  * Badges

Critical information must be scannable in < 5 seconds.

---

## 10. Accessibility & Quality Gates

### 10.1 Focus States

* Native outlines forbidden
* Use custom focus ring:
  `box-shadow: 0 0 0 4px rgba(0,0,0,0.1)`

### 10.2 Contrast

* Body text must meet WCAG AA

### 10.3 Semantic HTML

* One H1 per page
* Use nav, main, article, section correctly

---

## 11. Red Flag Checklist (Automatic Rejection)

Reject the UI if ANY apply:

* Arbitrary spacing values
* Colored buttons or accents
* Centered paragraphs
* Missing avatars in directory
* Paragraphs used for structured data
* Linear animations
* Layout wider than 680px

---

End of UI / UX Guidelines — Misbah
