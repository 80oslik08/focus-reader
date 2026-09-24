/**
 * Book genres — labels, heuristics, persistence helpers.
 */
(function (global) {
  'use strict';

  var GENRES = [
    'Adventure', 'Action', 'Sci-fi', 'Fantasy', 'Horror', 'Mystery/Crime',
    'Romance', 'Drama', 'Historical', 'Epic/Poetry', 'Biography/Memoir',
    'Philosophy', 'Religion/Spiritual', 'Science/Non-fiction', 'Business/Strategy',
    'Children', 'Other'
  ];

  var PUBLIC_PREASSIGN = [
    { re: /bible|king james/i, genre: 'Religion/Spiritual' },
    { re: /moby\s*dick/i, genre: 'Adventure' },
    { re: /dracula/i, genre: 'Horror' },
    { re: /frankenstein/i, genre: 'Horror' },
    { re: /sherlock|holmes/i, genre: 'Mystery/Crime' },
    { re: /pride and prejudice/i, genre: 'Romance' },
    { re: /crime and punishment/i, genre: 'Drama' },
    { re: /war and peace/i, genre: 'Historical' },
    { re: /odyssey/i, genre: 'Epic/Poetry' },
    { re: /meditations/i, genre: 'Philosophy' },
    { re: /art of war/i, genre: 'Business/Strategy' },
    { re: /alice.*wonderland/i, genre: 'Children' }
  ];

  var KEYWORDS = {
    'Sci-fi': /\b(spaceship|galaxy|android|robot|mars|alien|cyber|quantum|future|starship|vesmír|rakete)\b/i,
    'Horror': /\b(vampire|ghost|blood|terror|horror|nightmare|monster|upír|strašid)\b/i,
    'Mystery/Crime': /\b(detective|murder|clue|investigation|crime|vražda|detektív|sherlock)\b/i,
    'Romance': /\b(love|marriage|heart|kiss|romance|láska|svatba|srdce)\b/i,
    'Fantasy': /\b(wizard|dragon|magic|elf|sword|enchant|čarodej|drak|magie)\b/i,
    'Adventure': /\b(voyage|ship|island|treasure|quest|cesta|poklad|more)\b/i,
    'Action': /\b(battle|fight|explosion|chase|combat|boj|bitva)\b/i,
    'Historical': /\b(empire|century|king|war of|napoleon|ancient|storoč|cisár)\b/i,
    'Philosophy': /\b(virtue|stoic|ethics|reason|existence|filozof|ctnosť)\b/i,
    'Religion/Spiritual': /\b(god|lord|prayer|bible|faith|spirit|boh|modlitba)\b/i,
    'Children': /\b(fairy|nursery|wonderland|child|deti|rozprávka)\b/i,
    'Business/Strategy': /\b(strategy|market|leader|war|sun tzu|stratégia)\b/i,
    'Biography/Memoir': /\b(memoir|autobiography|biography|my life|pamäti)\b/i,
    'Science/Non-fiction': /\b(theory|experiment|species|science|veda|teória)\b/i,
    'Drama': /\b(tragedy|society|guilt|punishment|drama|vina)\b/i,
    'Epic/Poetry': /\b(verse|canto|odyssey|iliad|poem|báseň|epos)\b/i
  };

  function preassign(title) {
    for (var i = 0; i < PUBLIC_PREASSIGN.length; i++) {
      if (PUBLIC_PREASSIGN[i].re.test(title || '')) return PUBLIC_PREASSIGN[i].genre;
    }
    return null;
  }

  function guess(title, text) {
    var pre = preassign(title);
    if (pre) return pre;
    var sample = ((title || '') + ' ' + String(text || '').slice(0, 5000));
    var best = 'Other';
    var bestN = 0;
    Object.keys(KEYWORDS).forEach(function (g) {
      var m = sample.match(new RegExp(KEYWORDS[g].source, 'gi'));
      var n = m ? m.length : 0;
      if (n > bestN) { bestN = n; best = g; }
    });
    return bestN > 0 ? best : 'Other';
  }

  var LS = 'focusReader.bookGenres';

  function loadMap() {
    try { return JSON.parse(localStorage.getItem(LS) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveMap(map) {
    try { localStorage.setItem(LS, JSON.stringify(map)); } catch (e) {}
  }
  function getGenre(bookId, title, text) {
    var map = loadMap();
    if (bookId && map[bookId]) return map[bookId];
    return guess(title, text);
  }
  function setGenre(bookId, genre) {
    if (!bookId) return;
    var map = loadMap();
    map[bookId] = genre;
    saveMap(map);
  }

  function musicFamily(genre) {
    var g = genre || 'Other';
    if (/Sci-fi/i.test(g)) return 'scifi';
    if (/Action|Adventure/i.test(g)) return 'action';
    if (/Horror/i.test(g)) return 'horror';
    if (/Mystery/i.test(g)) return 'mystery';
    if (/Romance|Drama/i.test(g)) return 'romance';
    if (/Historical|Epic/i.test(g)) return 'historical';
    if (/Philosophy|Religion/i.test(g)) return 'calm';
    if (/Children|Fantasy/i.test(g)) return 'fantasy';
    return 'minimal';
  }

  global.FocusGenre = {
    GENRES: GENRES,
    preassign: preassign,
    guess: guess,
    getGenre: getGenre,
    setGenre: setGenre,
    loadMap: loadMap,
    saveMap: saveMap,
    musicFamily: musicFamily
  };
})(typeof window !== 'undefined' ? window : globalThis);
