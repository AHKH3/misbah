MISBAH MASTER DESIGN SYSTEM — v5.1
Status: Authoritative / Production
Enforcement: Strict Compliance Required

────────────────────────────────────────
0. AUTHORITY & SCOPE
────────────────────────────────────────

This document is the single source of truth for all UI/UX decisions in the Misbah project.

It governs:
- Production UI
- Design decisions
- Component behavior
- Motion and interaction logic

If a design decision is not explicitly allowed here, it is forbidden.

This is not a prototype guide.
This is a production constitution.

────────────────────────────────────────
1. CORE PHILOSOPHY
────────────────────────────────────────

Misbah is a decision-support tool, not a marketing product.

The interface must:
- Reduce anxiety
- Increase trust
- Surface critical information clearly

Premium is defined by restraint, not decoration.

────────────────────────────────────────
2. GEOMETRY & SPACING (THE 8PX LAW)
────────────────────────────────────────

All spacing values MUST be multiples of 8.
Micro-spacing may use 4px.

Allowed scale:
4 / 8 / 16 / 24 / 32 / 48 / 64

Forbidden:
10px, 15px, percentages for spacing.

Container max width:
680px (non-negotiable)

────────────────────────────────────────
3. COLOR SYSTEM (LUMINANCE ONLY)
────────────────────────────────────────

No expressive colors.
Color is defined by role.

Surfaces:
- Ground: #FAFAFA
- Card: #FFFFFF

Ink:
- Strong: #0A0A0A (Headings, Primary Actions)
- Body: #52525B (Reading text)
- Subtle: #A1A1AA (Meta information)

Borders:
- Ghost border: rgba(0,0,0,0.06)

Shadows:
- Rest: 0 4px 12px rgba(0,0,0,0.04)
- Lift: 0 12px 32px -4px rgba(0,0,0,0.08)

────────────────────────────────────────
4. TYPOGRAPHY (EDITORIAL SYSTEM)
────────────────────────────────────────

Fonts:
- Inter (UI / Latin)
- Amiri (Arabic content only)

Hierarchy:
H1: 3rem / 600 / -0.03em
H2: 1.5rem / 600 / -0.025em
H3: 1.125rem / 600 / -0.015em
Body: 1.0625rem / 400 / LH 1.6
Micro-label: 0.75rem / 600 / Uppercase

Rules:
- One H1 per page
- Long text is never center-aligned

────────────────────────────────────────
5. COMPONENT SYSTEM
────────────────────────────────────────

5.1 CARDS (Invisible Card)
- Background: Card
- Radius: 24px
- Padding: 24px
- Hover: Lift shadow + translateY(-4px)
- z-index on hover: 10

No heavy borders.
Separation is done via space.

────────────────────────────────────────
5.2 BUTTON SYSTEM (CRITICAL)
────────────────────────────────────────

Rule:
Only ONE Primary Button per screen.

(A) Primary Button
- Purpose: Final decision
- Shape: Pill (999px)
- Height: 48px
- Background: Ink Strong
- Text: White
- Hover: Lift (no color change)
- Active: scale(0.96)

(B) Ghost Button
- Purpose: Secondary action
- Background: Transparent
- Border: Ghost
- Same height & shape
- Hover: Card background + Rest shadow

(C) Text Link
- Purpose: Navigation / low-commitment
- Underlined text
- Never styled as button

────────────────────────────────────────
5.3 BADGES
────────────────────────────────────────

Purpose:
Display structured information (Location, Subject, Format).

- Shape: Rounded rectangle (8px)
- Background: Ground
- Border: Ghost
- Never pill-shaped
- Never animated

────────────────────────────────────────
6. MOTION PHYSICS
────────────────────────────────────────

No linear animations.

Allowed curves:
- Elastic: cubic-bezier(0.175, 0.885, 0.32, 1.15)
- Smooth: cubic-bezier(0.16, 1, 0.3, 1)

Duration:
< 300ms

────────────────────────────────────────
7. CONTENT RULES
────────────────────────────────────────

Tone:
Neutral. Calm. Factual.

Forbidden words:
Best, Top, Guaranteed, Easy.

Rules:
- No walls of text
- Critical data appears as badges
- Paragraphs explain, badges summarize

────────────────────────────────────────
8. ACCESSIBILITY
────────────────────────────────────────

- WCAG AA contrast minimum
- Custom focus ring:
  box-shadow: 0 0 0 4px rgba(0,0,0,0.1)

- Semantic HTML required

────────────────────────────────────────
9. QUALITY CONTROL — RED FLAGS
────────────────────────────────────────

Reject the design if:
[ ] More than one Primary button per screen
[ ] Arbitrary spacing values
[ ] Body text is pure black
[ ] Buttons change color on hover
[ ] Layout exceeds 680px
[ ] Linear animation detected

End of Specification v5.1
