/**
 * Piper ONNX + phoneme/energy timing — module Web Worker.
 */
import piper from './vendor/piper/piper-entry.js';
import './piper-timing.js';

const WASM = piper.DEFAULT_WASM;
const Timing = globalThis.FocusPiperTiming;
let busy = false;
const queue = [];

function reply(id, msg, transfer) {
  const data = Object.assign({ id }, msg);
  if (transfer && transfer.length) self.postMessage(data, transfer);
  else self.postMessage(data);
}

async function synthTimed(text, voiceId, words) {
  const timed = await piper.predictTimed({
    text: text,
    voiceId: voiceId,
    wasmPaths: WASM
  });
  const pcm = timed.pcm;
  const sampleRate = timed.sampleRate || 22050;
  const durationSec = timed.durationSec || (pcm ? pcm.length / sampleRate : 0);
  const wordList = words && words.length ? words : String(text || '').trim().split(/\s+/).filter(Boolean);
  const ph = timed.phonemes || [];
  // Normalize phonemes: string → char/token array with spaces as breaks
  let phonemes = ph;
  if (typeof ph === 'string') {
    phonemes = [];
    for (const ch of ph) phonemes.push(ch === ' ' ? ' ' : ch);
  } else if (Array.isArray(ph) && ph.length === 1 && typeof ph[0] === 'string' && ph[0].includes(' ')) {
    phonemes = ph[0].split('').map((c) => c);
  }
  let wordEnds = Timing
    ? Timing.allocateWordTimes(wordList, phonemes, durationSec, pcm, sampleRate)
    : wordList.map((_, i) => ((i + 1) / wordList.length) * durationSec);

  const blob = timed.blob;
  const buffer = await blob.arrayBuffer();
  // Transfer pcm copy for optional main-thread use (Float32Array buffer)
  let pcmCopy = null;
  if (pcm && pcm.length && pcm.length < 2e6) {
    pcmCopy = pcm.slice(0);
  }
  const msg = {
    type: 'synth-done',
    mime: blob.type || 'audio/wav',
    byteLength: buffer.byteLength,
    buffer: buffer,
    wordEnds: wordEnds,
    durationSec: durationSec,
    sampleRate: sampleRate,
    phonemeCount: (phonemes || []).length,
    wordCount: wordList.length,
    phonemeType: typeof (timed.phonemes),
    phonemeGroups: Timing ? Timing.phonemesPerWord(phonemes).length : 0
  };
  const transfer = [buffer];
  if (pcmCopy) {
    msg.pcm = pcmCopy;
    transfer.push(pcmCopy.buffer);
  }
  return { msg, transfer };
}

async function runJob(job) {
  const { id, type, payload } = job;
  try {
    if (type === 'ping') {
      reply(id, { type: 'pong', ok: true });
      return;
    }
    if (type === 'warm') {
      const vid = payload.voiceId;
      await piper.predictTimed({
        text: payload.text || 'Ready.',
        voiceId: vid,
        wasmPaths: WASM
      });
      reply(id, { type: 'warm-done', voiceId: vid });
      return;
    }
    if (type === 'synth') {
      const { msg, transfer } = await synthTimed(payload.text, payload.voiceId, payload.words);
      self.postMessage(Object.assign({ id }, msg), transfer);
      return;
    }
    if (type === 'download') {
      await piper.download(payload.voiceId, function (p) {
        reply(id, { type: 'download-progress', progress: p });
      });
      reply(id, { type: 'download-done', voiceId: payload.voiceId });
      return;
    }
    if (type === 'stored') {
      reply(id, { type: 'stored-done', stored: await piper.stored() });
      return;
    }
    if (type === 'remove') {
      await piper.remove(payload.voiceId);
      reply(id, { type: 'remove-done', voiceId: payload.voiceId });
      return;
    }
    if (type === 'flush') {
      await piper.flush();
      reply(id, { type: 'flush-done' });
      return;
    }
    if (type === 'voices') {
      reply(id, { type: 'voices-done', voices: await piper.voices() });
      return;
    }
    reply(id, { type: 'error', message: 'unknown type ' + type });
  } catch (err) {
    reply(id, { type: 'error', message: String(err && err.message || err) });
  }
}

async function pump() {
  if (busy) return;
  busy = true;
  while (queue.length) await runJob(queue.shift());
  busy = false;
}

self.onmessage = function (e) {
  const data = e.data || {};
  if (data.type === 'cancel-all') {
    queue.length = 0;
    reply(data.id || 0, { type: 'cancel-done' });
    return;
  }
  queue.push(data);
  pump();
};

self.postMessage({ type: 'worker-ready' });
