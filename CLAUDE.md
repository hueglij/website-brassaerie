# CLAUDE.md — B:RASSäRIE Website

Context for Claude Code. Read this before touching any file.

## Stack

Plain HTML + CSS + JavaScript. No build step, no npm, no node_modules.
- Tailwind CSS via CDN (in `<head>`)
- No frameworks (no React, no Vue)
- Files in repo = files deployed

## Language rule

Code (variables, functions, comments) → English.
Website text (all user-visible strings) → German only.

## Design system

- Background: `#FFFFFF` | Text: `#000000` | Accent: `#FF0000`
- CTA button: red, pill-shaped (`border-radius: 9999px`), white text "Jetzt buchen!"
- Logo: `assets/images/logo.png` (temporary PNG — will be replaced with SVG once professional design is final). Always use as `<img>` tag, never recreated in text.
- Mobile-first: write base styles for mobile, layer `md:` / `lg:` overrides on top

## File structure

```
index.html               main page (gigs + booking form)
impressum.html           legal imprint
datenschutz.html         privacy notice
css/style.css            custom CSS beyond Tailwind
js/config.js             public API keys (Web3Forms, hCaptcha)
js/gigs.js               fetches data/gigs.json, renders gig list
js/booking.js            form conditional logic + validation
data/gigs.json           gig list — edit this to add/remove gigs
assets/images/           logo.png, portrait-1.jpg … portrait-9.jpg
assets/icons/            SVG social icons
```

## Member strip

9 members, 9 columns, alternating black/white backgrounds.
- Top row: instrument image (always visible)
- Bottom row: portrait photo (hidden by default)
- Desktop: `max-height` CSS transition on `:hover`
- Mobile (`@media (hover: none)`): same transition triggered by JS click/touch

Instrument order: trumpet ×3, euphonium, sousaphone, drum, trombone ×3

## gigs.json schema

Required: `id`, `date` (YYYY-MM-DD), `time` (HH:MM), `city`, `venue`, `eventName`
Optional: `description`, `ticketed` (bool), `ticketUrl`, `organizerUrl`
- Past gigs filtered at render time in `gigs.js`, not deleted from JSON
- If `ticketed: true`, `ticketUrl` must be present (log warning if missing)

## Booking form

Fields: `organizerName`, `email`, `eventDate`, `eventLocation`, `eventType` (radio: public/private), `ticketed` (radio: yes/no — only if public), `ticketUrl` (only if ticketed), `organizerWebsite` (optional), `message` (optional)
Radio inputs use Tailwind `peer` / `peer-checked:` for pill styling — never replace with `<button>` or `<div>`.

## Git workflow

- `main` = production — Cloudflare Pages auto-deploys on every push
- All code changes (HTML, CSS, JS) → feature branch → PR → merge to main
- Branch naming: `feature/short-description` (e.g. `feature/gig-cards`, `feature/booking-form`)
- Direct commits to `main` only for content-only updates (`data/gigs.json` edits from mobile)

## Operating principles

1. Simplest working solution — no abstractions beyond what the task requires
2. No comments unless the WHY is non-obvious
3. No error handling for impossible scenarios — trust the data schema
4. German text only in HTML user-visible content
