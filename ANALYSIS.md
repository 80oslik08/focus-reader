# Focus Reader (Offline) — ORP Analysis


Spritz-style RSVP (Rapid Serial Visual Presentation) keeps the eyes fixed on an **Optimal Recognition Point (ORP)** while words flash one at a time. This app follows the classic ORP table from public RSVP research (US patent US20140016867A1, TABLE I).

## ORP table (alphanumeric letter length)

Only letters and digits count toward length. Punctuation is still shown with the word but does not shift the focus letter.

| Alphanumeric length | Focus letter (1-based) | 0-based index |
|--------------------:|-----------------------:|--------------:|
| 1                   | 1                      | 0             |
| 2                   | 2                      | 1             |
| 3–5                 | 2                      | 1             |
| 6–9                 | 3                      | 2             |
| 10–13               | 4                      | 3             |
| 14+                 | 5                      | 4             |

The ORP letter is highlighted in red (`#e53935`) and pinned at **~42%** of the reader width (not geometric center), with tick marks above and below.

## Examples (red / bracketed letter = ORP)

| Word | Alpha length | Focus # | Highlighted |
|------|-------------:|--------:|-------------|
| `a` | 1 | 1 | **[a]** |
| `to` | 2 | 2 | t**[o]** |
| `the` | 3 | 2 | t**[h]**e |
| `read` | 4 | 2 | r**[e]**ad |
| `reading` | 7 | 3 | re**[a]**ding |
| `recognition` | 11 | 4 | rec**[o]**gnition |
| `antidisestablishmentarianism` | 28 | 5 | anti**[d]**isestablishmentarianism |
| `Hello,` | 5 (comma ignored for length) | 2 | H**[e]**llo, |

## Timing model

- Base beat: `60000 / WPM` ms
- Length multiplier on display time: `<8 → 1.0`, `8–13 → 1.3`, `>13 → 1.6`
- After `, ; :` → extra `0.5×` base
- After `. ! ?` → extra by sentence word count: `≤7 → 1.0×`, `8–22 → 2.2×`, `≥23 → 3.3×`
- Paragraph break → `≥2.5×` base

## Files

- `index.html` — shell / UI
- `styles.css` — dark full-screen theme
- `app.js` — player, import, keyboard
- `orp.js` — shared ORP + tokenize + timing (also used by tests)
- `test-orp.mjs` — headless ORP assertions


## Offline notes

- Classic scripts (`orp.js` → `window.ORP`, `app.js`) so `file://` works in Chrome.
- pdf.js worker loaded via Blob URL (`lib/pdf-worker-blob.js`) because Chrome blocks workers from `file://` paths.
- System font stack only — no Google Fonts.
