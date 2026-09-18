# Editorial Redesign — Portfolio

## Objective

Replace the current dark navy + coral, effect-heavy portfolio with a light "paper"
editorial design that reads as hand-crafted rather than template-generated, without
changing the site's information architecture or inventing any new claims.

## Problem

The site presents every known signature of an LLM-generated developer portfolio:

- Navy `#0d1b2a` + coral `#ff6b35` — the default generated palette.
- A decorative fake terminal (`whoami` / `cat focus.txt` / blinking cursor / macOS dots).
- Gratuitous motion: `float` keyframes, staggered `nth-child` reveal delays, a shine
  sweep on buttons, and `rotate(-5deg) scale(1.1)` on the logo hover.
- One identical card hover (`translateY(-8px) scale(1.02)` + colored glow) cloned across
  skills, projects and results.
- Brittany-Chiang-clone `01.` `02.` numbered section titles.
- `a:hover { transform: translateY(-1px) }` applied to all anchors, including inline text.
- Rainbow devicon logo wall.

It also has real accessibility and engineering defects:

- Body text at `0.9rem` on a ~4.6:1 contrast pair.
- No `prefers-reduced-motion` support despite four always-on animations.
- No `:focus-visible` styling at all.
- `nav-toggle` lacks `aria-expanded` / `aria-controls`; menu cannot be closed with Escape.
- Broken heading hierarchy (`.expertise-category` and `.section-subtitle` are `h3` at the
  same level as card `h3`s).
- `overflow-x: hidden` on `body` masking layout bugs.
- No image `width`/`height`/`loading` attributes (CLS); `techcup.png` is 2.3 KB rendered
  at 200px wide.

## Why

The user's goal is an internship-facing portfolio for 2027. The current design is not
ugly — it is anonymous. Craft is the differentiator, and the existing file adds effects
where it should add decisions.

## Scope

In scope:

- `index.html` — restructure markup, heading hierarchy, ARIA, image attributes, copy.
- `css/style.css` — full rewrite around a new token system.
- `js/main.js` — rewrite as honest functionality only.

Out of scope: information architecture (same five sections), new projects, new claims,
imagery replacement, build tooling, framework adoption, hosted analytics.

## Constraints

- No build step, no framework, no bundler. Hand-written HTML/CSS/JS only (GitHub Pages).
- Static deploy via `.github/workflows/deploy.yml` — must keep working unchanged.
- No new third-party runtime dependency. The devicon CDN is removed.
- No invented facts: every number, date, project and claim must trace to the current site.
- All user-facing copy in English.

## Acceptance criteria

1. Zero forbidden patterns (see `## Forbidden patterns`) in the shipped CSS/HTML/JS.
2. Body text contrast >= 7:1; all meta text >= 4.5:1 on its background.
3. `prefers-reduced-motion: reduce` neutralizes every transition.
4. Every interactive element has a visible `:focus-visible` state.
5. Mobile menu exposes `aria-expanded`, closes on Escape, outside click, and link click.
6. Heading order is `h1` -> `h2` -> `h3` with no skipped or mis-nested levels.
7. All `<img>` carry `width`, `height`, `alt`, and `loading` (lazy except the first
   in-viewport image).
8. No horizontal overflow at 320px, 768px, 1280px without `overflow-x: hidden`.
9. Every fact present on the old site is still present (nothing silently dropped).

## Forbidden patterns (hard fail)

- Any `box-shadow` at all (glow or neutral). Hairlines separate, not shadows.
- Any `translateY`, `translateX`, `scale`, or `rotate` in a `:hover` rule.
- Any `@keyframes` block.
- Any `radial-gradient` or `linear-gradient` used as decoration.
- `backdrop-filter`.
- `overflow-x: hidden`, or `overflow: hidden` on `body`/`html`. (Local `overflow: hidden`
  for image cropping is fine.)
- `nth-child` transition delays.
- Section numbers rendered as `01.` / `02.`.
- Decorative fake terminal / shell prompt markup.
- Emoji.
- Colored third-party icon fonts (devicon).
- Card `border-radius` above 4px, or a border-radius on every container.

## Design tokens

```
--paper:       #faf8f3
--paper-sunk:  #f1ece2
--ink:         #16130e
--ink-soft:    #453e35   /* body copy, ~9.9:1 */
--ink-mute:    #6e6559   /* meta, ~5.4:1 */
--rule:        #ddd5c8
--rule-soft:   #e9e3d9
--accent:      #9d3b1c   /* terracotta, ~6.4:1 */
--accent-ink:  #7a2d14
```

Accent budget: terracotta appears only on the hero eyebrow, link text/underlines, the
active nav item, and small mono eyebrows. Nothing else.

## Typography

- Display / headings: **Newsreader** (400, 500, italic 400).
- Body / UI: **IBM Plex Sans** (400, 500, 600).
- Meta / labels: **IBM Plex Mono** (400, 500).

Scale: hero name `clamp(2.75rem, 7vw, 5rem)` / lh `0.98`; section title
`clamp(1.75rem, 3.5vw, 2.5rem)` / lh `1.1`; lead `clamp(1.05rem, 1.6vw, 1.25rem)` / lh
`1.55`; body `1rem` / lh `1.7`; meta `0.78rem` uppercase mono / ls `0.12em`.

## Layout

- Container `max-width: 1180px`, gutter `clamp(1.25rem, 4vw, 2.5rem)`.
- Prose measure `max-width: 62ch`.
- Section padding `clamp(4.5rem, 9vw, 8rem) 0`.
- Hairline rules are the primary separator. No boxes-in-boxes.
- Hero is an asymmetric two-column grid (content + meta definition list).

## Tasks

- [ ] **T1 — Branch + tokens.** Create `feat/editorial-redesign`; rewrite the `:root`
      token block in `css/style.css` with the design tokens above; load the three font
      families with `preconnect` + `display=swap`; drop the devicon stylesheet link.
- [ ] **T2 — CSS foundation.** Base reset, body/typography defaults, container, section
      rhythm, hairline rule utilities, link styling (real underline, no transform), and
      the `prefers-reduced-motion` block plus `:focus-visible` ring.
- [ ] **T3 — Nav.** Rebuild nav markup + styles: wordmark (no box, no rotate), plain text
      links with underline hover, `aria-current` active state, accessible mobile panel
      with `aria-expanded` / `aria-controls`.
- [ ] **T4 — Hero.** Remove `.hero-bg` gradient and the fake terminal entirely. New hero:
      eyebrow, serif `h1`, lead paragraph, two text links, and a mono meta definition
      list (Education, Focus, Graduating, Status).
- [ ] **T5 — About + facts.** Two tightened paragraphs; university logo rendered honestly
      at a readable size with a caption. Replace the glowing stats box with a hairline
      definition list.
- [ ] **T6 — Expertise.** Replace the six glowing cards with an editorial index: three
      mono group headers, with each entry a `term + description` row separated by
      hairlines. No icons.
- [ ] **T7 — Featured projects.** Three entries on a shared image/content grid. Images
      `aspect-ratio: 16/10`, `object-fit: cover`, with `width`/`height`/`loading`.
      CNN entry has no screenshot — use a typographic panel with the 81.11% figure.
      Eyebrows replace badge pills; tags become plain mono text separated by `·`.
- [ ] **T8 — More projects.** Convert the four cards into a hairline-separated list of
      rows (serif title, mono stack, description, link). No thumbnails, no 60px squares.
- [ ] **T9 — Results + looking-for + contact + footer.** Hairline list for the four
      results; plain note block for "Looking for"; oversized serif email link as the
      contact focal point; quiet mono footer.
- [ ] **T10 — JavaScript.** Rewrite `js/main.js`: scrolled state, mobile menu with
      `aria-expanded` sync / Escape / outside click / link click, and `aria-current`
      active-section tracking. Remove the scroll-reveal observer entirely.
- [ ] **T11 — Verification.** Run the pattern scan and structural checks; confirm no
      horizontal overflow at 320 / 768 / 1280; confirm every old fact still present.
- [ ] **T12 — Commit.** One work-unit commit on the feature branch with a Conventional
      Commit message. No push, no PR.

## Checks

- `node`/`npm` are absent in this repo; there is no test runner and no build step.
- Functional check: forbidden-pattern scan + structural assertions (runnable PowerShell).
- Visual check: requires a browser; reported honestly as unverified by the agent.

## Progress

| Task | Status | Evidence |
| ---- | ------ | -------- |
| ODD task file created | done | this file |
| T1 — Branch + tokens | done | `feat/editorial-redesign` checked out; `:root` tokens in `css/style.css`; Newsreader / IBM Plex Sans / IBM Plex Mono loaded with `preconnect` + `display=swap`; devicon link removed from `index.html` |
| T2 — CSS foundation | done | reset, body/type defaults, `.container`, `--section-y` rhythm, hairline rules, underline links, `:focus-visible` ring, `prefers-reduced-motion` block |
| T3 — Nav | done | wordmark, text links with underline hover, `aria-current="true"` active state, mobile panel with `aria-expanded` / `aria-controls`, Escape + outside click + link click |
| T4 — Hero | done | `.hero-bg` gradient and fake terminal removed; eyebrow, serif `h1`, lead, two text links, mono meta `dl` |
| T5 — About + facts | done | two tightened paragraphs; university logo at 48px linked to `escuelaing.edu.co` with a serif italic caption; glowing stats box replaced with hairline `dl` |
| T6 — Expertise | done | three mono group headers, hairline `term + description` rows, no icons |
| T7 — Featured projects | done | shared two-column grid; images `aspect-ratio: 16 / 10` with `width`/`height`/`loading`/`decoding`; CNN typographic 81.11% panel; TechCup `object-fit: contain` on `--paper-sunk` |
| T8 — More projects | done | four rows separated by vertical space instead of rules (serif title, mono stack, description, arrow link); no thumbnails or cards |
| T9 — Results + contact + footer | done | hairline results list; `--paper-sunk` Looking for note; oversized serif email link; quiet footer |
| T10 — JavaScript | done | `js/main.js` rewritten: scrolled class, mobile menu state, `aria-current` via `IntersectionObserver`, menu reset on desktop via `matchMedia`; `.fade-in` observer deleted; all element access guarded |
| T11 — Verification | done | pattern scan A returns zero matches; checks B/C/D/E pass; heading order `h1 -> h2 -> h3`; all referenced assets exist |
| T12 — Commit | done | code commit `77011ea` on `feat/editorial-redesign`, base boundary `0b3321c`; no push, no PR |

> Note: the Progress table is updated in a doc-only follow-up commit, so the recorded code commit hash stays resolvable.

## Next step

Done. Browser-level visual verification (320 / 768 / 1280 rendering) still requires a human with a browser; the automated structural checks are the agent-verifiable subset.
