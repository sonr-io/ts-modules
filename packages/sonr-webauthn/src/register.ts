import { createCredentials } from "./utils";
import { getAssertion, makeCredential, verifyAssertion } from "./webauthn";

declare type RegistrationOptions = {
    name: string,
    crossOrigin: boolean,
}

export async function startRegistration(options: RegistrationOptions): Promise<void> {
    if (!options)
        throw Error("No Configuration options provided, aborting");
    
    return new Promise(async (resolve, reject) => {
        try
        {
            const credential: Credential = await makeCredential(options.name);
            const newCredential: Credential | void = await createCredentials(credential);
            console.info(`Credentials created for ${options.name}`);
            console.log(JSON.stringify(newCredential));
            await getAssertion(newCredential as PublicKeyCredential);
            // const verification: boolean = await verifyAssertion(newCredential);
        } catch(e)
        {

        }
    });
}