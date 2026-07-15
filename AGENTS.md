# Project rules

- Before making any visual, layout, typography, color, animation, or component change, read and follow `DESIGN_SYSTEM.md`.
- `DESIGN_SYSTEM.md` is the canonical design authority for this project. Do not introduce a new brand color, card language, motion style, or typography family without updating that document first.
- Preserve the full-screen chapter model on the homepage. When a chapter exceeds its content capacity, create a continuation chapter instead of shrinking text until it is difficult to read.
- Public-facing identity uses `reflex4`; do not expose the real name, phone number, email address, or other resume contact details in site content.
- Keep top-level Home / Blog / Photography navigation as native document links. Do not replace them with client-side router links: the homepage uses a nested scroll-snap deck, and a full navigation is required to guarantee that every destination starts at the top of its viewport.

## Change verification workflow

- For small detail changes to an existing page—including spacing, copy, color intensity, font size, alignment, border, texture, animation speed, or a minor component-style adjustment—make the requested change and hand it back to the user immediately for manual visual inspection.
- Do not perform browser screenshots, visual QA, repeated viewport checks, or extra polish passes for those detail changes unless the user explicitly asks for them or the change creates a functional risk.
- A proportionate compile/build check is still allowed when the edit could cause a syntax, type, or bundling failure; do not delay handoff for unnecessary visual inspection.
- For a newly created page, a new full-screen chapter, a major page redesign, or a new interaction flow, perform one complete self-review before handoff. This review must cover layout, navigation/interaction, viewport fit, responsive behavior, visual consistency with `DESIGN_SYSTEM.md`, and build validity. Fix discovered issues before reporting completion.
- If it is unclear which category applies, treat a new route or a structurally new viewport as a new page; treat a localized change inside an existing structure as a detail change.

## Per-page design logs

- Every top-level page has a persistent design log under `design-logs/`: `home.md`, `blog.md`, and `photography.md`.
- Before changing a page, read `DESIGN_SYSTEM.md` and that page's complete design log. Treat the log as the fastest recovery context when conversation history is long or compacted.
- Every page modification must update its log in the same change set. Refresh the current-state sections when the implemented structure or rule changes, then append one concise dated entry to the change history.
- Each history entry records: the user-visible change, the design decision that must persist, the main files or surfaces affected, and whether verification was user inspection or agent self-review.
- A shared component or global-style change that visibly affects multiple pages requires updating every affected page log. A change with no visible page impact does not require artificial page-log entries.
- When adding a new top-level page, create its design log at the same time and add it to `design-logs/README.md`.
- Keep logs concise and current. Do not copy entire conversations, implementation dumps, personal contact details, secrets, or temporary debugging notes into them.
