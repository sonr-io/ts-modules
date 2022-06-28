require('../public/wasm_exec.js');

export async function createModuleInstance(buf, runtime) {

    try {
        const mod = await WebAssembly.instantiate(buf, runtime.importObject);
        // Exported function live under instance.exports
        runtime.run(mod.instance)
        
        return mod
    } catch(e) {
        throw e;
    }
}