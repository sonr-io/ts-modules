import { getCredentials } from "./credentials";
import { Result, Status } from "./types/Result";
import { ConfigurationOptions } from "./types/Options";
import { ValidateUserName, ValidateDisplayName } from '@sonr-io/validation/src/index';
import {State} from './types/State';
import { Session } from "@sonr-io/types";
import { WebAuthn } from "./webauthn";
import { SessionState } from "./state";



/**
 * 
 * @param options configuration object for webAuthentication options
 * @returns boolean indicating status of authentication operation
 */
export async function startUserLogin(options: ConfigurationOptions): Promise<boolean | undefined> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    try
    {
        const authn: WebAuthn = new WebAuthn(options);

        let sessionState: SessionState = new SessionState();
        sessionState.UserName = options.name;
        sessionState.DisplayName = options.name;

        authn.WithSessionState(sessionState);


        const credential: Result<Credential> = await authn.StartLogin();
        const newCredential: Credential | void = await getCredentials(credential as unknown as PublicKeyCredentialCreationOptions);
        console.info(`Credentials created for ${options.name}`);
        console.log(JSON.stringify(newCredential));
        const result: Result<boolean> = await authn.FinishLogin({ credential: newCredential as PublicKeyCredential });

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