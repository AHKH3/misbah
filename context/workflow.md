# Project Workflow: Misbah (مصباح)

## 1. Development Process
- **Task-Based Execution:** Development is organized into tracks, phases, and tasks.
- **E2E-First Testing:** Quality assurance is achieved primarily through **Playwright E2E tests** covering critical user flows (Auth, Admin Review, Profile Activation).
- **No Enforced Coverage:** There is no globally enforced code coverage percentage. Testing focuses on critical business logic; presentational or static code does not require unit test coverage.
- **Manual SEO Verification:** All SEO-critical pages must be manually verified for metadata, heading structure, and AI discoverability (llms.txt compliance).

## 2. Commit & Checkpoint Protocol
- **Phase-Based Commits:** Changes are committed after each **Phase** (group of tasks) is completed, rather than after every individual task.
- **Summaries in Commits:** Task and phase summaries are recorded directly in the **git commit messages**, not in Git Notes.
- **Simplicity over Ceremony:** Avoid excessive checkpointing protocols that hinder development velocity for non-critical features.

## 3. Deployment & Stability
- Production stability and SEO integrity are the highest priorities.
- Simplicity is a strategic decision: avoid overengineering infrastructure or testing suites.