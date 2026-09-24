/**
 * Spritz-style ORP helpers (classic script — exposes window.ORP).
 * Also kept as orp.mjs for Node tests.
 */
(function (global) {
'use strict';

/**
 * Spritz-style ORP (Optimal Recognition Point) helpers.
 * Based on public RSVP research / US patent US20140016867A1 TABLE I.
 * Letter length counts alphanumeric characters only; punctuation still displays.
 */

/**
 * Count alphanumeric characters in a token (for ORP length).
 * @param {string} word
 * @returns {number}
 */
function alphaLength(word) {
  if (!word) return 0;
  return (word.match(/[\p{L}\p{N}]/gu) || []).length;
}

/**
 * ORP 0-based index among alphanumeric letters only.
 * Mapping (1-indexed letter position → 0-indexed):
 *   1 → 1 (0)
 *   2 → 2 (1)
 *   3–5 → 2 (1)
 *   6–9 → 3 (2)
 *   10–13 → 4 (3)
 *   14+ → 5 (4)
 * @param {number} length alphanumeric length
 * @returns {number} 0-based index into alphanumeric sequence
 */
function orpIndexForLength(length) {
  if (length <= 0) return 0;
  if (length === 1) return 0;
  if (length === 2) return 1;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  if (length <= 13) return 3;
  return 4;
}

/**
 * Find the character index in the full display string that is the ORP letter.
 * Walks alphanumeric characters until the ORP slot is reached.
 * @param {string} word
 * @returns {number} index into `word`, or -1 if none
 */
function orpCharIndex(word) {
  const len = alphaLength(word);
  if (len === 0) return -1;
  const target = orpIndexForLength(len);
  let alphaSeen = 0;
  for (let i = 0; i < word.length; i++) {
    if (/[\p{L}\p{N}]/u.test(word[i])) {
      if (alphaSeen === target) return i;
      alphaSeen++;
    }
  }
  return -1;
}

/**
 * Split word into { before, orp, after } for highlighting.
 * @param {string} word
 * @returns {{ before: string, orp: string, after: string }}
 */
function splitAtOrp(word) {
  const idx = orpCharIndex(word);
  if (idx < 0) {
    return { before: word || '', orp: '', after: '' };
  }
  return {
    before: word.slice(0, idx),
    orp: word[idx],
    after: word.slice(idx + 1),
  };
}

/**
 * Format word with ORP letter in brackets, e.g. re[a]ding
 * @param {string} word
 * @returns {string}
 */
function highlightOrpBracket(word) {
  const { before, orp, after } = splitAtOrp(word);
  if (!orp) return word || '';
  return `${before}[${orp}]${after}`;
}

/**
 * Tokenize text into display words, preserving punctuation on tokens.
 * Paragraph breaks become special markers with type 'para'.
 * @param {string} text
 * @returns {Array<{ text: string, type: 'word' | 'para' }>}
 */

function tokenizeAsync(text, onProgress) {
  return new Promise(function (resolve) {
    if (!text || !String(text).trim()) {
      resolve([]);
      return;
    }
    var normalized = String(text).normalize('NFC').replace(/\r\n/g, '\n');
    var paragraphs = normalized.split(/\n\s*\n/);
    var tokens = [];
    var i = 0;
    function chunk() {
      var start = Date.now();
      while (i < paragraphs.length && Date.now() - start < 12) {
        var para = paragraphs[i];
        var words = para.trim().split(/\s+/).filter(Boolean);
        words.forEach(function (w) {
          tokens.push({ text: w, type: 'word' });
        });
        if (i < paragraphs.length - 1 && words.length > 0) {
          tokens.push({ text: '', type: 'para' });
        }
        i++;
      }
      if (onProgress) onProgress(i / Math.max(paragraphs.length, 1));
      if (i < paragraphs.length) {
        setTimeout(chunk, 0);
      } else {
        resolve(tokens);
      }
    }
    chunk();
  });
}

function tokenize(text) {
  if (!text || !text.trim()) return [];
  const tokens = [];
  // Split on whitespace but track blank lines as paragraph breaks
  const paragraphs = text.normalize('NFC').replace(/\r\n/g, '\n').split(/\n\s*\n/);
  paragraphs.forEach((para, pIdx) => {
    const words = para.trim().split(/\s+/).filter(Boolean);
    words.forEach((w) => {
      tokens.push({ text: w, type: 'word' });
    });
    if (pIdx < paragraphs.length - 1 && words.length > 0) {
      tokens.push({ text: '', type: 'para' });
    }
  });
  return tokens;
}

/**
 * Base millisecond duration for one "beat" at given WPM.
 * @param {number} wpm
 * @returns {number}
 */
function baseMs(wpm) {
  const w = Math.max(1, Number(wpm) || 300);
  return 60000 / w;
}

/**
 * Display multiplier from alphanumeric length.
 * <8 → 1.0; 8–13 → 1.3; >13 → 1.6
 * @param {number} len
 * @returns {number}
 */
function lengthMultiplier(len) {
  if (len < 8) return 1.0;
  if (len <= 13) return 1.3;
  return 1.6;
}

/**
 * Extra pause multiplier after punctuation / sentence / paragraph.
 * @param {string} word
 * @param {number} sentenceWordCount words in the sentence just completed (if ending)
 * @param {boolean} isParagraphBreak
 * @returns {number} additional pause as multiple of baseMs (0 if none)
 */
function pauseMultiplier(word, sentenceWordCount, isParagraphBreak) {
  if (isParagraphBreak) return 2.5;
  if (!word) return 0;
  const last = word[word.length - 1];
  if (',;:'.includes(last)) return 0.5;
  if ('.!?'.includes(last)) {
    const n = sentenceWordCount || 1;
    if (n <= 7) return 1.0;
    if (n <= 22) return 2.2;
    return 3.3;
  }
  return 0;
}

/**
 * Duration in ms to show a token at given WPM.
 * @param {{ text: string, type: string }} token
 * @param {number} wpm
 * @param {number} sentenceWordCount
 * @returns {number}
 */
function displayDurationMs(token, wpm, sentenceWordCount) {
  const base = baseMs(wpm);
  if (token.type === 'para') {
    return base * 2.5;
  }
  const len = alphaLength(token.text);
  const show = base * lengthMultiplier(len);
  const pause = base * pauseMultiplier(token.text, sentenceWordCount, false);
  return show + pause;
}

/**
 * Reference ORP table rows for UI / docs.
 */

/**
 * Estimate playback duration (ms) from wordIndices[fromWordIndex] to end,
 * matching the player timing model (length multipliers, punct/sentence pauses, paragraph pauses).
 * @param {Array<{text:string,type:string}>} tokens
 * @param {number[]} wordIndices
 * @param {number} fromWordIndex
 * @param {number} wpm
 * @returns {number}
 */
function estimateRemainingMs(tokens, wordIndices, fromWordIndex, wpm) {
  const total = wordIndices.length;
  if (!total || fromWordIndex >= total) return 0;

  function endsSentence(word) {
    return /[.!?]$/.test(word || '');
  }

  function sentenceCountAt(wordIndex) {
    let count = 0;
    for (let i = wordIndex; i >= 0; i--) {
      const ti = wordIndices[i];
      const w = tokens[ti].text;
      count++;
      if (i < wordIndex && endsSentence(w)) {
        count--;
        break;
      }
      if (i > 0) {
        const prevTi = wordIndices[i - 1];
        for (let j = prevTi + 1; j < ti; j++) {
          if (tokens[j].type === 'para') return count;
        }
      }
    }
    return count;
  }

  let ms = 0;
  let sentenceWordCount = 0;
  const base = baseMs(wpm);

  for (let wi = 0; wi < total; wi++) {
    const ti = wordIndices[wi];
    const token = tokens[ti];
    let sc = sentenceWordCount;
    if (endsSentence(token.text)) sc = sentenceCountAt(wi);

    let dur = displayDurationMs(token, wpm, sc);

    if (wi < total - 1) {
      const nextTi = wordIndices[wi + 1];
      for (let j = ti + 1; j < nextTi; j++) {
        if (tokens[j].type === 'para') {
          dur += base * 2.5;
          break;
        }
      }
    }

    if (wi >= fromWordIndex) ms += dur;

    if (endsSentence(token.text)) sentenceWordCount = 0;
    else sentenceWordCount += 1;
  }
  return ms;
}

const ORP_TABLE = [
  { lengths: '1', position: 1, index: 0 },
  { lengths: '2', position: 2, index: 1 },
  { lengths: '3–5', position: 2, index: 1 },
  { lengths: '6–9', position: 3, index: 2 },
  { lengths: '10–13', position: 4, index: 3 },
  { lengths: '14+', position: 5, index: 4 },
];


global.ORP = {
  alphaLength: alphaLength,
  orpIndexForLength: orpIndexForLength,
  orpCharIndex: orpCharIndex,
  splitAtOrp: splitAtOrp,
  highlightOrpBracket: highlightOrpBracket,
  tokenize: tokenize,
  tokenizeAsync: tokenizeAsync,
  baseMs: baseMs,
  lengthMultiplier: lengthMultiplier,
  pauseMultiplier: pauseMultiplier,
  displayDurationMs: displayDurationMs,
  estimateRemainingMs: estimateRemainingMs,
  ORP_TABLE: ORP_TABLE
};
})(typeof window !== 'undefined' ? window : globalThis);
