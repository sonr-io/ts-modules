import { createCredentials } from "./credentials";
import { ConfigurationOptions } from "./types/Options";
import { WebAuthn } from "./webauthn";
import {State} from './types/State';
import { Result } from "./types/Result";
import { rejects } from "assert";
import { ValidateDisplayName, ValidateUserName } from "@sonr-io/validation/src/index";
import { Session } from "@sonr-io/types";
import { resolve } from "path";
import { SessionState } from "./state";

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
        const authn: WebAuthn = new WebAuthn(options);

        let sessionState: SessionState = new SessionState();
        sessionState.UserName = options.name;
        sessionState.DisplayName = options.name;

        authn.WithSessionState(sessionState);

        const credential: PublicKeyCredentialCreationOptions | void = await authn.StartRegistration(options.name);

        const newCredential: Credential | void = await createCredentials(
            credential as unknown as PublicKeyCredentialCreationOptions
        );
        
        console.info(`Credentials created for ${options.name}`);
        console.log(newCredential);
        const resp: Result<Session> = await authn.FinishRegistration(
            newCredential as PublicKeyCredential
        );

        sessionState.Credential = resp.result.credential;
        
        return resp.result;

    } catch(e)
    {
        console.error(`Error while registering endpoint: ${e}`);
        throw e;
    }
}