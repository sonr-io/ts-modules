function resolveMessage(message) {
    try 
    {
        const funcName = message.invoke
        const params = message.params
        if (!funcName)
            return
        
        if (!self[funcName])
            return
        
        var value;
        if (params && params.array)
            value = self[funcName](...params)
        else
            value = self[funcName]()
    
        postMessage({
            status: 200,
            response: value,
            error: undefined
        })
    }
    catch(e)
    {
        console.error(e)
        postMessage({
            status: 500,
            response: undefined,
            error: e
        })
    }
}

function createMessageHandler() {
    self.addEventListener('message', async (event) => {
        const data = event.data;
        resolveMessage(data)
    });
}

createMessageHandler();