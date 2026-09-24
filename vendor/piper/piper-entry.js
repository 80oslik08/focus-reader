import * as tts from './piper-tts-web.js';

const BASE = new URL('./', import.meta.url).href;
const DEFAULT_WASM = {
  onnxWasm: BASE,
  piperData: BASE + 'piper_phonemize.data',
  piperWasm: BASE + 'piper_phonemize.wasm'
};

async function predict(config, callback) {
  const voiceId = config.voiceId || config.voice || 'en_US-amy-low';
  const session = await tts.TtsSession.create({
    voiceId,
    progress: callback,
    wasmPaths: config.wasmPaths || DEFAULT_WASM,
    logger: config.logger
  });
  // length_scale via model config if exposed later
  return session.predict(config.text);
}

async function download(voiceId, callback) {
  return tts.download(voiceId, callback);
}

const api = {
  predict,
  download,
  remove: tts.remove,
  flush: tts.flush,
  stored: tts.stored,
  voices: tts.voices,
  TtsSession: tts.TtsSession,
  DEFAULT_WASM,
  HF_BASE: 'https://huggingface.co/rhasspy/piper-voices/resolve/main'
};

export default api;
export { predict, download };

if (typeof window !== 'undefined') {
  window.FocusPiper = api;
}
