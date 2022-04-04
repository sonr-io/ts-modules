import { createCredentials } from "./credentials";
import { getAssertion, makeCredential, verifyAssertion } from "./webauthn";

declare type RegistrationOptions = {
    name: string,
    crossOrigin: boolean,
}

export async function startRegistration(options: RegistrationOptions): Promise<boolean> {
    if (!options)
        throw Error("No Configuration options provided, aborting");
    
    return new Promise(async (resolve, reject) => {
        try
        {
            const credential: Credential = await makeCredential(options.name);
            const newCredential: Credential | void = await createCredentials(credential as unknown as PublicKeyCredentialCreationOptions);
            console.info(`Credentials created for ${options.name}`);
            console.log(newCredential);
            const result: boolean = await getAssertion(newCredential as PublicKeyCredential);
            result ? resolve(true) : resolve(false);
            // const verification: boolean = await verifyAssertion(newCredential);
        } catch(e)
        {
            resolve(false);
        }
    });
}