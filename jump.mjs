import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import vm from 'vm';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sandbox = { console, Math, JSON, Object, Array, Number, String, isFinite };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(__dirname, 'jump.js'), 'utf8'), sandbox);
export const FocusJump = sandbox.FocusJump;
export default FocusJump;
