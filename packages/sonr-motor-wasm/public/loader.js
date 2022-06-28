
try {
    const runtime = new Go()
    fetch('sonr-motor.wasm').then(resp => resp.arrayBuffer()).then(async buf => {
        WebAssembly.instantiate(buf, runtime.importObject).then(async mod => {
            // Exported function live under instance.exports
            await runtime.run(mod.instance)
        });
    }).catch(err => {
        console.error("Error while ")
    });
} catch(e) {
    throw e;
}
