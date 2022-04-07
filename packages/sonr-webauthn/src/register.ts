import { createCredentials } from "./credentials";
import { Action } from "./enums";
import { startRegistration, finishRegistration} from "./webauthn";

declare type RegistrationOptions = {
    name: string,
    crossOrigin: boolean,
}

/**
 * 
 * @param options configuration object for webAuthentication options
 * @returns boolean indicating status of registration operation
 */
export async function startAuthentication(options: RegistrationOptions): Promise<boolean> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    try
    {
        const credential: Credential | void = await startRegistration(options.name);
        const newCredential: Credential | void = await createCredentials(
            credential as unknown as PublicKeyCredentialCreationOptions
        );
        console.info(`Credentials created for ${options.name}`);
        console.log(newCredential);
        const result: boolean = await finishRegistration(
            newCredential as PublicKeyCredential
        );

        return result;
    } catch(e)
    {
        console.error(`Error while registering endpoint: ${e}`);
        return false;
    }
}