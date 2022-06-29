
import "../lib/wasm_exec"
import motorLib from './../lib/sonr-motor.wasm';
import './polyfis';

/*
    bootstraps wasm module as a module with the goland v1.18 js runtime target
    loads motor api to the global object through the go module's entry point
*/
self.bootstrapMotorLib = function bootstrapMotorLib() {
    try {
        const runtime = new Go()
        motorLib(runtime.importObject).then(lib => {
            runtime.run(lib.instance)
        }).catch(err => {
            console.error(err)
        });
    } catch(e) {
        throw e;
    }
}
