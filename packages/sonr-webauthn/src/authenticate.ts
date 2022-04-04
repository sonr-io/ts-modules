import { getCredentials } from "./credentials";
import { getAssertion, makeCredential } from "./webauthn";

declare type RegistrationOptions = {
    name: string,
    crossOrigin: boolean,
};

export async function startAuthentication(options: RegistrationOptions): Promise<boolean> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    return new Promise(async (resolve, reject) => {
        try
        {
            const credential: Credential = await makeCredential(options.name);
            const newCredential: Credential | void = await getCredentials(credential as unknown as PublicKeyCredentialCreationOptions);
            console.info(`Credentials created for ${options.name}`);
            console.log(JSON.stringify(newCredential));
            const result: boolean = await getAssertion(newCredential as PublicKeyCredential);
            resolve(true);
        } catch(e) 
        {

        }
    });
}