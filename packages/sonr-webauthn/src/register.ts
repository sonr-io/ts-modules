import { createCredentials } from "./credentials";
import { ConfigurationOptions } from "./types/Options";
import { startRegistration, finishRegistration} from "./webauthn";
import {GetSessionState, setSessionState} from './state';
import {State} from './types/State';
import { Result } from "./types/Result";
import { rejects } from "assert";
import { ValidateDisplayName, ValidateUserName } from "@sonr-io/validation";

/**
 * 
 * @param options configuration object for webAuthentication options
 * @returns boolean indicating status of registration operation
 */
export async function startUserRegistration(options: ConfigurationOptions): Promise<Result<PublicKeyCredential>> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    try
    {
        const sessionState: State = GetSessionState();
        sessionState.user.name = ValidateUserName(options.name);
        sessionState.user.displayName = ValidateDisplayName(options.name);

        setSessionState(sessionState);

        const credential: Credential | void = await startRegistration(options.name);

        const newCredential: Credential | void = await createCredentials(
            credential as unknown as PublicKeyCredentialCreationOptions
        );
        
        console.info(`Credentials created for ${options.name}`);
        console.log(newCredential);
        const result: Result<PublicKeyCredential> = await finishRegistration(
            newCredential as PublicKeyCredential
        );

        return result;
    } catch(e)
    {
        console.error(`Error while registering endpoint: ${e}`);
        throw e;
    }
}