globalThis.crypto = {}
globalThis.crypto.getRandomValues = () => {}
const fs = require('fs')
require('../lib/wasm_exec.js')
const go = new Go();
const wasmBuff = fs.readFileSync("./lib/sonr-motor.wasm")

WebAssembly.instantiate(wasmBuff, go.importObject).then(async wasmModule => {
    // Exported function live under instance.exports
   go.run(wasmModule.instance)
   globalThis.newWallet()

   console.log(globalThis.Address())
});

