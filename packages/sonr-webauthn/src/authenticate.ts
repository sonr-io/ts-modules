import { getCredentials } from "./credentials";
import { Result, Status } from "./types/Result";
import { ConfigurationOptions } from "./types/Options";
import { startLogin, finishLogin } from "./webauthn";
import { ValidateUserName, ValidateDisplayName } from '@sonr-io/validation/src/index';
import { CreateSessionState, GetSessionState, setSessionState } from "./state";
import {State} from './types/State';
import { Session } from "@sonr-io/types";



/**
 * 
 * @param options configuration object for webAuthentication options
 * @returns boolean indicating status of authentication operation
 */
export async function startUserLogin(options: ConfigurationOptions): Promise<Session | undefined> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    try
    {
        CreateSessionState();
        let sessionState: State = GetSessionState();
        sessionState.user.name = ValidateUserName(options.name);
        sessionState.user.displayName = ValidateDisplayName(options.name);
        setSessionState(sessionState);

        const credential: Credential = await startLogin(options.name);
        const newCredential: Credential | void = await getCredentials(credential as unknown as PublicKeyCredentialCreationOptions);
        console.info(`Credentials created for ${options.name}`);
        console.log(JSON.stringify(newCredential));
        const result: Result<Session> = await finishLogin({ credential: newCredential as PublicKeyCredential });
        sessionState = GetSessionState();
        sessionState.credentials = result.result.credential;
        setSessionState(sessionState);
        if (result.status === Status.success)
            return result?.result;
        else
            return result?.result;
    } catch(e)
    {
        console.error(`Error while authenticating: ${e}`);
        throw e; // throw error back to the caller
    }
}