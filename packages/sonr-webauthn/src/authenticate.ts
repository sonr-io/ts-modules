import { getCredentials } from "./credentials";
import { Action } from "./enums";
import { getAssertion, makeCredential } from "./webauthn";

declare type RegistrationOptions = {
    name: string,
    crossOrigin: boolean,
};

/**
 * 
 * @param options configuration object for webAuthentication options
 * @returns boolean indicating status of authentication operation
 */
export async function startAuthentication(options: RegistrationOptions): Promise<boolean> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    return new Promise(async (resolve, reject) => {
        try
        {
            const credential: Credential = await makeCredential(Action.Authenticate, options.name);
            const newCredential: Credential | void = await getCredentials(credential as unknown as PublicKeyCredentialCreationOptions);
            console.info(`Credentials created for ${options.name}`);
            console.log(JSON.stringify(newCredential));
            const result: boolean = await getAssertion(Action.Authenticate, newCredential as PublicKeyCredential);
            result ? resolve(true) : resolve(false);
        } catch(e) 
        {
            reject();
        }
    });
}