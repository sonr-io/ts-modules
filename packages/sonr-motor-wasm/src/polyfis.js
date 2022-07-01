if (!globalThis.crypto)
    globalThis.crypto = require('node:crypto').webcrypto;

if (!WebAssembly.instantiateStreaming) { 
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer()
        return await WebAssembly.instantiate(source, importObject)
    }
}

if (!globalThis.fetch)
    globalThis.fetch = require('node-fetch-polyfill')