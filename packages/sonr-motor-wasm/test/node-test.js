require('./../src/polyfis');
require('./../lib/wasm_exec');

const path = require('path');
const fs = require('fs');

if (!globalThis.crypto)
    globalThis.crypto = require('node:crypto').webcrypto;

if (!globalThis.fetch)
    globalThis.fetch = require('node-fetch-polyfill')


const wasmBuffer = fs.readFileSync(path.join(__dirname, '../lib/sonr-motor.wasm'));
const runtime = new Go()

WebAssembly.instantiate(wasmBuffer, runtime.importObject).then(async lib => {
  // Exported function live under instance.exports
  runtime.run(lib.instance);
}).then(() => {
    console.log("module initialized invoking methods")
    globalThis.createWallet();
});