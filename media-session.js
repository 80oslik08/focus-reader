/**
 * Media Session API — lock-screen / notification controls (Android Chrome reliable; iOS best-effort).
 */
(function (global) {
  'use strict';
  function refresh(meta) {
    if (!('mediaSession' in navigator)) return;
    meta = meta || {};
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: meta.title || 'Focus Reader',
        artist: meta.artist || 'Focus Reader',
        album: meta.album || 'Reading',
        artwork: meta.artwork || [
          { src: './icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: './icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      });
    } catch (e) {}
  }
  function setHandlers(h) {
    if (!('mediaSession' in navigator)) return;
    h = h || {};
    try {
      navigator.mediaSession.setActionHandler('play', h.play || null);
      navigator.mediaSession.setActionHandler('pause', h.pause || null);
      navigator.mediaSession.setActionHandler('stop', h.stop || null);
      navigator.mediaSession.setActionHandler('seekbackward', h.seekbackward || null);
      navigator.mediaSession.setActionHandler('seekforward', h.seekforward || null);
    } catch (e) {}
  }
  function setPlaybackState(state) {
    if (!('mediaSession' in navigator)) return;
    try { navigator.mediaSession.playbackState = state; } catch (e) {}
  }
  function setPosition(pos) {
    if (!('mediaSession' in navigator) || !navigator.mediaSession.setPositionState) return;
    try {
      navigator.mediaSession.setPositionState(pos);
    } catch (e) {}
  }
  global.FocusMediaSession = { refresh: refresh, setHandlers: setHandlers, setPlaybackState: setPlaybackState, setPosition: setPosition };
})(typeof window !== 'undefined' ? window : globalThis);
