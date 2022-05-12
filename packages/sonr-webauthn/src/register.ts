import { createCredentials } from "./credentials";
import { ConfigurationOptions } from "./types/Options";
import { startRegistration, finishRegistration} from "./webauthn";
import {CreateSessionState, GetSessionState, setSessionState} from './state';
import {State} from './types/State';
import { Result } from "./types/Result";
import { rejects } from "assert";
import { ValidateDisplayName, ValidateUserName } from "@sonr-io/validation/src/index";
import { Session } from "@sonr-io/types";
import { resolve } from "path";

/**
 * 
 * @param options configuration object for webAuthentication options
 * @returns boolean indicating status of registration operation
 */
export async function startUserRegistration(options: ConfigurationOptions): Promise<Session | undefined> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    try
    {
        CreateSessionState();
        let sessionState: State = GetSessionState();
        sessionState.user.name = ValidateUserName(options.name);
        sessionState.user.displayName = ValidateDisplayName(options.name);

        setSessionState(sessionState);

        const credential: PublicKeyCredentialCreationOptions | void = await startRegistration(options.name);

        const newCredential: Credential | void = await createCredentials(
            credential as unknown as PublicKeyCredentialCreationOptions
        );
        
        console.info(`Credentials created for ${options.name}`);
        console.log(newCredential);
        const resp: Result<Session> = await finishRegistration(
            newCredential as PublicKeyCredential
        );
        sessionState = GetSessionState();
        sessionState = GetSessionState();
        sessionState.credentials = resp.result.credential;
        setSessionState(sessionState);
        return resp.result;

    } catch(e)
    {
        console.error(`Error while registering endpoint: ${e}`);
        throw e;
    }
}