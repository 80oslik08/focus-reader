/**
 * Piper ONNX synthesis — module Web Worker (off main thread).
 * Main thread only plays audio + updates display.
 */
import piper from './vendor/piper/piper-engine.js';

const WASM = piper.DEFAULT_WASM;
let busy = false;
const queue = [];

function reply(id, msg, transfer) {
  const data = Object.assign({ id: id }, msg);
  if (transfer && transfer.length) self.postMessage(data, transfer);
  else self.postMessage(data);
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
      await piper.predict({
        text: payload.text || 'Ready.',
        voiceId: vid,
        wasmPaths: WASM
      });
      reply(id, { type: 'warm-done', voiceId: vid });
      return;
    }
    if (type === 'synth') {
      const blob = await piper.predict({
        text: payload.text,
        voiceId: payload.voiceId,
        wasmPaths: WASM
      });
      const buffer = await blob.arrayBuffer();
      self.postMessage({
        id: id,
        type: 'synth-done',
        mime: blob.type || 'audio/wav',
        byteLength: buffer.byteLength,
        buffer: buffer
      }, [buffer]);
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
  while (queue.length) {
    await runJob(queue.shift());
  }
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
