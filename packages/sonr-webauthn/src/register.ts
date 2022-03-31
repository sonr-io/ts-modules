import { makeCredential } from "./webauthn";

declare type RegistrationOptions = {
    name: string,
    log: boolean,
}

export async function startRegistration(options: RegistrationOptions): Promise<void> {
    if (!options)
        throw Error("No Configuration options provided, aborting");
    
    return new Promise(async (resolve, reject) => {
        try 
        {
            const credential: Credential = await makeCredential(options.name);
            console.log("Credential Created: ", credential);
        } catch(e)
        {

        }
    });
}