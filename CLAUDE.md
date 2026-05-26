# CLAUDE.md — B:RASSäRIE Website

Context for Claude Code. Read this before touching any file.

## Project

Swiss brass band website. Plain HTML + CSS + JavaScript — no build step, no npm, no node_modules.
Files in the repo = files deployed. Hosted on Cloudflare Pages (auto-deploy on push to `main`).

## Language rule

Code (variables, functions, comments) → English.
All user-visible text in HTML → German only.

## Current build status

| Phase | Description                        | Status      |
|-------|------------------------------------|-------------|
| A     | Skeleton, Tailwind, meta tags      | ✅ Done     |
| B     | Flip card gig grid, member strip   | ✅ Done     |
| C     | Booking form                       | ✅ Done     |
| D     | Legal pages (Impressum, Datenschutz)| ✅ Done     |
| E     | Initial Cloudflare Pages deploy    | ⬜ Pending |
| F     | Domain + email                     | ⬜ Pending |
| G     | Form.taxi live + hCaptcha          | ⬜ Pending |
| H     | Analytics + polish                 | ⬜ Pending |
| I     | Launch                             | ⬜ Pending |

## Desktop layout — NEVER change this structure

```
┌──────────────────┬──────────────────────────────────────────┐
│  LEFT SIDEBAR    │  RIGHT MAIN (flex-1)                     │
│  lg:w-72, sticky │                                          │
│                  │  [logo — full width of right column]     │
│  Kommende        │  ══════════════════════════════          │
│  Auftritte       │                                          │
│                  │  [ Jetzt buchen! ]  ← red pill button    │
│  [flip card]     │                                          │
│  [flip card]     │  [member strip — 9 columns]              │
│  ...             │                                          │
│                  │                                          │
│  [Instagram]     │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

Mobile: single column. `<main>` gets `order-1` (logo on top), `<aside>` gets `order-2` (cards below).
Instagram is `hidden lg:inline-flex` in the sidebar, and `lg:hidden` in the footer.

## Design system

- Background: `#FFFFFF` | Text: `#000000` | Accent: `#FF0000`
- CTA: red, pill-shaped (`rounded-full`), white text "Jetzt buchen!"
- Logo: `<img src="assets/images/logo.png" alt="B:RASSäRIE Logo">` — placeholder PNG.
  Will be replaced with SVG once professional design is finalised. Never recreate in text.
- Mobile-first: write base styles for mobile, layer `md:` / `lg:` overrides on top

## File structure

```
index.html               main page
impressum.html           legal imprint (Phase D)
datenschutz.html         privacy notice (Phase D)
css/style.css            custom CSS (flip cards, member strip)
js/config.js             public API keys — hCaptcha (Phase G); Form.taxi key is in the action URL
js/gigs.js               fetches data/gigs.json, renders flip cards
js/booking.js            booking form logic (Phase C)
data/gigs.json           gig list — edit to add/remove gigs
assets/images/           logo.png
assets/images/instruments/  trumpet.png, euphonium.png, sousaphone.png, drum.png, trombone.png
assets/images/portraits/     joshua.png, johannes.png, marco.png, jan.png, fio.png
                             (4 more pending: lars, samuel, mike, denise — total 9 members)
assets/icons/            instagram.svg
assets/design/           V4_Sketch.png (gitignored — local only)
```

## Gig flip cards

- Rendered by `js/gigs.js` into `#gig-cards` inside `<aside>`
- Front: red date+time, event name, venue/city, optional description, optional ticket link
- Back: black bg, white text, organizer + ticket links, subtle "schliessen" hint (no emoji)
- Click/tap toggles `.is-flipped` class; links use `onclick="event.stopPropagation()"`
- Hover zoom (`scale(1.03)`) on desktop only via `@media (hover: hover)` in `style.css`
- Past gigs (date < today) filtered in JS, not deleted from JSON

## gigs.json schema

Required: `id`, `date` (YYYY-MM-DD), `time` (HH:MM), `city`, `venue`, `eventName`
Optional: `description`, `ticketed` (bool), `ticketUrl`, `organizerUrl`
- If `ticketed: true`, `ticketUrl` must be present (console.warn if missing)

## Member strip

9 members, 9 columns, alternating black/white backgrounds.
Members (left → right): Jan (trombone), Lars (trombone), Samuel (trombone), Joshua (euphonium),
Marco (sousaphone), Mike (drum), Denise (trumpet), Johannes (trumpet), Fio (trumpet).
Instrument images available: trumpet, euphonium, sousaphone, drum, trombone (reuse for multiples).
Portraits available: jan, joshua, marco, johannes, fio — 4 more pending (lars, samuel, mike, denise).
- Top row: instrument image (always visible on all columns)
- Bottom row: portrait (hidden, expands on hover/tap) — only on `.has-portrait` columns
- Columns without portraits: instrument only, no cursor, no hover effect
- Desktop: `max-height` CSS transition on `.has-portrait:hover` via `@media (hover: hover)`
- Mobile: JS (`js/members.js`) toggles `.is-open` on `.has-portrait` tap via `@media (hover: none)`

## Booking form (Phase C — placeholder section exists in index.html)

Fields: `organizerName`, `email`, `eventDate`, `eventLocation`,
`eventType` (radio: öffentlich/privat), `ticketed` (radio: ja/nein — only if öffentlich),
`ticketUrl` (only if ticketed), `organizerWebsite` (optional), `message` (optional)
- If `eventType === private`: hide ticketing section, remove its `required` attributes
- Radio inputs styled as pill segmented controls via Tailwind `peer` / `peer-checked:`
- Never replace radios with `<button>` or `<div>` — radios provide free keyboard/a11y semantics

## Git workflow

- `main` = production — Cloudflare Pages auto-deploys on push
- All code changes → feature branch → PR → merge to `main`
- Branch naming: `feature/phase-X-description` or `fix/short-description`
- Direct commits to `main` only for `data/gigs.json` content updates
- Branch protection on `main`: require PR, block force pushes, restrict deletions
- `gh` CLI is not installed — after pushing, give the user this URL to open the PR:
  `https://github.com/hueglij/website-brassaerie/compare/main...{branch-name}`

**When a phase or significant task is done:** commit → push → provide the PR URL.
Do not wait to be asked. Include a short checklist in the PR body.

## Cross-file consistency

When any of the following change, update **all** listed files in the same commit — never just one:

| What changed | Files to update |
|---|---|
| Phase status | `CLAUDE.md` build table + `BUILD_PLAN.md` phase header |
| Form backend | `CLAUDE.md` + `index.html` (action URL) + `datenschutz.html` |
| Legal address or contact email | `impressum.html` + `datenschutz.html` |
| Member count or portrait/instrument images | `CLAUDE.md` (member strip + file structure) + `.gitignore` |
| New HTML page added | All existing pages' `<footer>` nav links |
| Band name spelling | Every file that references it |

## Operating principles

1. Simplest working solution — no abstractions beyond what the task requires
2. No comments unless the WHY is non-obvious
3. No error handling for impossible scenarios — trust the data schema
4. German text only in HTML user-visible content
5. Keep `BUILD_PLAN.md` updated as decisions are made (gitignored — local only)
6. When any project detail changes, apply the cross-file consistency rules above
7. When a phase is complete, commit, push, and give the PR URL — unprompted
