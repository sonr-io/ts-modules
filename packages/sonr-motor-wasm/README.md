# Motor Wasm

Provides an implementation of the Sonr `Motor SDK` for javascript runtimes compatible with WebAssembly

## Available endpoints
- bootstrapMotorLib
- getAddress
- getDidDoc
- importCredential
- marshalWallet
- signTx
- verifyTx
- broadcastTx

## Usage
The following is an example usage

```
import `index`
// first bootstrap the module
self.bootstrapMotorLib()

// if successful, all methods will be available on the global object
self.createWallet()
```


