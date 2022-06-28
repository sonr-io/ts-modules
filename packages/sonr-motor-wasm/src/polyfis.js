const crypto = require('node:crypto');
globalThis.crypto = crypto.webcrypto; //

// polyfill
if (!WebAssembly.instantiateStreaming) { 
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer()
        return await WebAssembly.instantiate(source, importObject)
    }
}