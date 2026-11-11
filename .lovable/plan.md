# Header interactions and site search

## Experience
- Keep the existing Vietnamese pages, seven-item navigation, six-column mega menu, footer, and current semantic brand tokens.
- Add a responsive header account action that opens a two-tab sign-in/register dialog. Validate required fields, email format, six-character minimum passwords, and confirmation match; include show/hide password and success feedback. Close on X, Escape, or dialog dismissal.
- Add a header search form that submits by Enter to `/tim-kiem?q=...`. Show grouped article, question, and E-learning matches with per-group totals and an empty-results state.
- Change the header follow action to open a newsletter email dialog with email validation and success feedback.
- Keep all submissions demo-only and in-memory; add no backend or persistence.

## Technical details
- Keep page content/data in `src/pages/` and `src/data/`; use a new `src/routes/tim-kiem.tsx` route adapter with page metadata.
- Reuse project dialog, button, input, semantic tokens, news repository, question data, and E-learning JSON; extract shared search indexing where useful.
- Add tests for password minimum and confirmation match, email validation, search grouping, query matching, and empty results.
- Verify desktop, tablet, and mobile header layouts, keyboard focus and Escape handling, all legacy route matches, and current page appearance.
