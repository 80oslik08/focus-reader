Focus Reader — Offline edition
================================

HOW TO OPEN
-----------
1. Unzip FocusReader.zip if needed.
2. Open the FocusReader folder.
3. Double-click index.html
   Works in Chrome, Edge, or Firefox with no internet and no local server.

Everything (UI, fonts via system stack, PDF engine) is bundled. No network requests.

CONTROLS
--------
Play / Pause     — button or Space
Restart          — button
Skip ±5 words    — buttons or Left / Right arrow
Speed (WPM)      — slider, number box, or Up / Down arrow (±25)
Load sample      — demo English paragraph
Apply text       — use the textarea contents
Clear            — empty the reader
Import           — click the drop zone or drag .txt / .md / .pdf

TIPS
----
• Default speed is 300 WPM; start slower if you are new to RSVP.
• The red letter is the Optimal Recognition Point (ORP); keep your eyes on the ticks.
• PDF text extraction uses a local copy of Mozilla pdf.js (no CDN).

FILES
-----
index.html, styles.css, app.js, orp.js
lib/pdf.min.js, lib/pdf.worker.min.js, lib/pdf-worker-blob.js
ANALYSIS.md, README.txt
orp.mjs + test-orp.mjs (optional Node unit tests)

Optional Node test (needs Node.js):
  node test-orp.mjs


TIMER
-----
Elapsed counts only while playing; resets on Restart or new text.
Remaining / Total est. use the real per-word timing model (incl. pauses).
Session countdown: pick 5–30 min or custom, Start / Reset / Off.
Counts down only while playing; auto-pauses and shows a banner at 0.
Optional soft beep (toggle); prefs stored in localStorage.

RECENT FILES
------------
Imported and pasted texts are saved in IndexedDB (offline, large-text safe).
Click an entry to resume at the last word. Progress auto-saves while reading.
On open, the most recently read item loads automatically (paused).


RESPONSIVE & TOUCH
------------------
Works from phone portrait (~320px) to large desktops. Sticky control bar on phones.
Reader gestures (on the word area):
  Tap           — play / pause
  Swipe left    — skip +5 words
  Swipe right   — skip −5 words
  Swipe up      — WPM +25
  Swipe down    — WPM −25
  Long-press    — toggle Focus mode

FOCUS MODE
----------
Press the Focus button or keyboard F. Hides secondary panels; uses Fullscreen API
when available. Exit with Focus again, F, or Esc (exits browser fullscreen).

Wake Lock keeps the screen on while playing (supported browsers only).
