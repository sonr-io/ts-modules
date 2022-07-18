import { getCredentials, storeCredentials } from "./credentials";
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
export async function startUserLogin(options: ConfigurationOptions): Promise<PublicKeyCredential> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    try
    {
        const authn: WebAuthn = new WebAuthn(options);

        let sessionState: SessionState = new SessionState();
        sessionState.UserName = options.name;
        sessionState.DisplayName = options.name;

        authn.WithSessionState(sessionState);


        const credential: Result<PublicKeyCredentialRequestOptions> = await authn.StartLogin();
        options?.logingHooks?.afterStart();

        const newCredential: Credential | void = await getCredentials(credential.result);

        const result: Result<Credential> = await authn.FinishLogin({
            credential: newCredential as PublicKeyCredential
        });
        storeCredentials(newCredential)

        options?.logingHooks?.afterFinish();

        return newCredential as PublicKeyCredential;

    } catch(e)
    {
        return undefined;
    }
}