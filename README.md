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
  googleClientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
};
```

No secrets are stored in the repo. Tokens live in the browser only.

## Local / file://
Opening `index.html` from disk still works (no service worker on `file://`). PDF worker uses a Blob fallback.

## License
Personal project.
