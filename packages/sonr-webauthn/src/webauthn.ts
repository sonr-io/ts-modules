import { assertionEndpoint, authenticateUserEndpoint, makeCredentialsEndpoint, verifyAssertionEndpoint } from "./constants";
import { SessionState } from "./state";
import {Result, Status} from './types/Result';
import { ConfigurationOptions } from "./types/Options";

import { 
    buildFinishRegistrationEndpoint,
    createAssertion,
    createAuthenicator,
    decodeCredentialsFromAssertion,
} from "./utils";
import { config } from "process";

export class WebAuthn {
    private _options: ConfigurationOptions;
    private _sessionState: SessionState;

    public constructor(options: ConfigurationOptions) {
        this._options = options;
    }


    public WithSessionState(state: SessionState) {
        this._sessionState = state;
    }

    get SessionState(): SessionState {
        return this._sessionState;
    }

    /**
    * @throws Error  
    * @param action 
    * @param name domain name to be used for credential creation
    * @returns Credential
    */
    public async StartRegistration(): Promise<PublicKeyCredentialCreationOptions | undefined> {
        const url: string = makeCredentialsEndpoint;
        const username: string = this._sessionState.UserName;

        try {
            const response: Response | void = await fetch(
                url + '?username=' + username,
                { 
                    method: "GET",
                    headers: {
                        accept: 'application/json',
                    }
                }, 
            );
            
            if (!response || response == null) { 
                return undefined;
            }

            const reqBody: string = await response?.text();
            const makeCredentialOptions: PublicKeyCredentialCreationOptions = JSON.parse(reqBody).publicKey;
            decodeCredentialsFromAssertion(makeCredentialOptions, username);
            makeCredentialOptions.rp.id = window.location.hostname;
            return makeCredentialOptions;
        } catch (e)
        {
            console.error(`Error while making user credentials: ${e.message}`);
            throw e;
        }
    }

    /**
    * @throws Error  
    * @param action 
    * @param name domain name to be used for credential creation
    * @returns Credential
    */
    public async StartLogin(): Promise<Result<Credential>> {
        const url: string = verifyAssertionEndpoint;
        const username: string = this._sessionState.UserName;
        try {
            const response: Response | void = await fetch(url + '?username=' + username, { method: "GET" });
            if (!response || response == null) { 
                return {
                    error: new Error("Error while fetching credential options"),
                    result: undefined,
                    status: Status.notFound
                };
            }

            const reqBody: string = await response?.text();
            const makeCredentialOptions: any = JSON.parse(reqBody);
            if (makeCredentialOptions.publicKey)
            {
                decodeCredentialsFromAssertion(makeCredentialOptions, username);
            }

            return makeCredentialOptions.publicKey;
        } catch (e)
        {
            console.error(`Error while making user credentials: ${e.message}`);
            return {
                error: e,
                result: undefined,
                status: Status.notFound
            };
        }
    }

    /*
    * Finalizes user registration within the sonr registry.
    * Once presisted name is valid within sonr name registry
    */
    public async FinishRegistration(): Promise<Result<boolean>> {
        return new Promise((resolve, reject) => {
            try {
                if (!this._sessionState.Credential) {
                    throw new Error("No Credential Registered, aborting");
                }

                let url: string = buildFinishRegistrationEndpoint(
                    assertionEndpoint,
                    this._sessionState.DisplayName,
                    this._options.deviceLabel
                );

                const verificationObject: any = createAssertion(this._sessionState.Credential);
                const serializedCred: string = JSON.stringify(verificationObject);
                verificationObject && fetch(url, {
                    credentials: "same-origin",
                    method: 'POST',
                    body: serializedCred,
                }).then(async function(response: Response) {
                    const reqBody: string = await response.text();

                    if (response.status < 200 || response.status > 299)
                    {
                        throw new Error(`Error while creating credential assertion: ${reqBody}`);
                    }
                    resolve({
                        status: Status.success,
                        result: true,
                    });
                }).catch(function(err) {
                    console.log(err.name);
                    reject({
                        error: err,
                        status: Status.error
                    });
                });
            } catch(err) {
                console.log(`Error while getting credential assertion: ${err.message}`);
                reject({
                    error: err,
                    status: Status.error
                });
            }
        });
    }

    /**
     * 
     * @param param0 
     * @returns 
     */
    public FinishLogin({ credential }: { credential: PublicKeyCredential; } ): Promise<Result<boolean>> {
        return new Promise((resolve, reject) => {
            try {
                const url: string = buildFinishRegistrationEndpoint(
                    authenticateUserEndpoint,
                    this._sessionState.DisplayName,
                    this._options.deviceLabel
                );

                const verificationObject: any = createAuthenicator(credential);
                const serializedCred: string = JSON.stringify(verificationObject);
                verificationObject && fetch(url + '/' + this._sessionState.UserName, {
                    credentials: "same-origin",
                    method: 'POST',
                    body: serializedCred,
                }).then(async function(response: Response) {
                    const reqBody: string = await response.text();
    
                    if (response.status < 200 || response.status > 299)
                    {
                        throw new Error(`Error while creating credential assertion: ${reqBody}`);
                    }
                    console.log(true);
                    resolve({
                        result: verificationObject,
                        status: Status.success
                    });
                }).catch(function(err) {
                    console.log(err.name);
                    resolve({
                        error: err,
                        status: Status.error
                    });
                });
            } catch(err) {
                console.log(`Error while getting credential assertion: ${err.message}`);
                reject({
                    error: err,
                    status: Status.error
                });
            }
        });
    }
}