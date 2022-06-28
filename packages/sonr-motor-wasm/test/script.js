const fs = require('fs')
const loader = require('../src')

const wasmBuff = fs.readFileSync("../lib/sonr-motor.wasm")
const mod = await loader(wasmBuff)

globalThis.newWallet()
