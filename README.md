# Focus Reader

Offline-first Spritz-style ORP RSVP speed reader with optional Google Drive sync.

**Live:** https://80oslik08.github.io/focus-reader/

## Features
- Classic ORP highlighting (Unicode-aware), timer, recent files (IndexedDB)
- Responsive + touch gestures + focus mode + wake lock
- Installable PWA (works offline after first visit)
- Optional sync via Google Drive **appDataFolder** only (`drive.appdata` scope)

## Enable cloud sync
1. Google Cloud Console → create OAuth **Web** client
2. Authorized JavaScript origin: `https://80oslik08.github.io`
3. Enable **Google Drive API**
4. Put the Client ID in [`config.js`](./config.js):

```js
window.FOCUS_READER_CONFIG = {
  googleClientId: '424960885576-…' // already set in this repo
};
```

No secrets are stored in the repo. Tokens live in the browser only.

## Local / file://
Opening `index.html` from disk still works (no service worker on `file://`). PDF worker uses a Blob fallback.



## Reading controls
- **−5 WPM / +5 WPM** buttons (press-and-hold repeats). Slider + number input still work.
- Keyboard: `↑`/`↓` = ±5 WPM; `Shift`+`↑`/`↓` = ±25 WPM; `←`/`→` = jump ±5 words (also swipe left/right on the stage).
- **Listen** (optional, off by default): Web Speech API speaks full sentences while the ORP view shows the current word. Voice picker + per-book language override. Prefers local (offline) voices; network voices are tagged “online”.
- **Voice limit zone** on the speed slider (Listen mode): amber→red band above an adaptive listening limit (default ~300 WPM, learns from your comfortable speed, also capped by measured voice max). Persisted in `localStorage` and synced via Drive `settings.json` when connected.

### Voice-limit learning (simple)
While Listen is ON and playing (ignoring the first 10s after enabling):
- Stay at speed S for ≥ 3 cumulative minutes with S > limit → raise: `limit = limit + 0.5*(S-limit)` (at least `S-5`).
- Slow down (especially after a raise / repeated slow-downs within ~2 min) → lower: `limit = limit - 0.5*(limit-newS)`.
- Clamp 100–600. Optional per-language values.

## Position resume
Progress is stored **per content-hash book id** (same file = same id whether opened from Recent, Library public pack, Drive, or re-import). Position flushes before every book switch, on pause, ~every 2s while playing, and on `visibilitychange` / `pagehide` / `beforeunload`. Sync merges never overwrite a newer local position with an older remote one, and never let a remote/local `0` wipe real progress.

## Tests
```bash
node test-orp.mjs
node test-sync.mjs
node test-listen.mjs
node e2e-resume.mjs          # local server on :8765
node e2e-resume.mjs https://80oslik08.github.io/focus-reader/
```

## License
Personal project.


## Library
- **Public domain** pack ships with the app (`library-seed/`) — Bible, Austen, Melville, etc.
- **Google Drive** folder `Focus Reader Books` is listed after you Connect (drive.readonly).
- Progress sync uses drive.appdata only.

First Google Connect may show an “app isn’t verified” warning (Testing mode) — expected.
