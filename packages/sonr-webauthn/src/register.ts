import { createCredentials, storeCredentials } from "./credentials";
import { ConfigurationOptions } from "./types/Options";
import { WebAuthn } from "./webauthn";
import { Result, Status } from "./types/Result";
import { SessionState } from "./state";

/**
 * 
 * @param options configuration object for webAuthentication options
 * @returns PublicKeyCredential
 */
export async function startUserRegistration(options: ConfigurationOptions): Promise<PublicKeyCredential> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    try
    {
        const authn: WebAuthn = new WebAuthn(options);

        let sessionState: SessionState = new SessionState();
        sessionState.UserName = options.name;
        sessionState.DisplayName = options.name;

        authn.WithSessionState(sessionState);

        const credential: Result<PublicKeyCredentialCreationOptions> = await authn.StartRegistration();
        if (credential?.error) {
            throw new Error("Error while getting public key credential options")
        }
        
        options?.registrationHooks?.afterStart();
        const newCredential: Credential | void = await createCredentials(
            credential.result as unknown as PublicKeyCredentialCreationOptions
        );
        
        console.info(`Credentials created for ${options.name}`);
        authn.SessionState.Credential = newCredential as PublicKeyCredential;
        const resp: Result<Credential> = await authn.FinishRegistration();
        options?.registrationHooks?.afterFinish();
        storeCredentials(resp.result);

        return resp.result as PublicKeyCredential;

    } catch(e)
    {

    }
}