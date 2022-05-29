import { assertionEndpoint, authenticateUserEndpoint, makeCredentialsEndpoint, verifyAssertionEndpoint } from "./constants";
import { SessionState } from "./state";
import {Result, Status} from './types/Result';
import { ConfigurationOptions } from "./types/Options";

import { 
    createAssertion,
    createAuthenicator,
    decodeCredentialsFromAssertion,} from "./utils";

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
    public async StartRegistration(name: string): Promise<PublicKeyCredentialCreationOptions | undefined> {
        const url: string = makeCredentialsEndpoint;
        const username: string = this._sessionState.UserName;

        try {

            const response: Response | void = await fetch(
                url + '/' + username,
                { method: "GET" }
            );
            
            if (!response || response == null) { 
                return undefined;
            }

            const reqBody: string = await response?.text();
            const makeCredentialOptions: PublicKeyCredentialCreationOptions = JSON.parse(reqBody);
            console.log(`Credential Creation Options: ${makeCredentialOptions}`);
            decodeCredentialsFromAssertion(makeCredentialOptions);

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
    public async StartLogin(name: string): Promise<Credential | undefined> {
        const url: string = verifyAssertionEndpoint;
        const username: string = this._sessionState.UserName;
        try {
            const response: Response | void = await fetch(url + '/' + username, { method: "GET" });
            if (!response || response == null) { 
                return undefined;
            }

            const reqBody: string = await response?.text();
            const makeCredentialOptions: any = JSON.parse(reqBody);
            console.log(`Credential Creation Options: ${makeCredentialOptions}`);
            if (makeCredentialOptions.publicKey)
            {
                decodeCredentialsFromAssertion(makeCredentialOptions);
            }

            return makeCredentialOptions.publicKey;
        } catch (e)
        {
            console.error(`Error while making user credentials: ${e.message}`);
            throw e;
        }
    }

    /*
    * Finalizes user registration within the sonr registry.
    * Once presisted name is valid within sonr name registry
    */
    public async FinishRegistration(credential: PublicKeyCredential): Promise<Result<boolean>> {
        return new Promise((resolve, reject) => {
            try {
                const url: string = assertionEndpoint;
                const verificationObject: any = createAssertion(credential);
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
                const url: string = authenticateUserEndpoint;
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

    /**
        check if a given user is present in the Sonr registry
        @returns boolean indiciating user status within registry 
    */
    private CheckUserExists(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try
            {
                const username: string = this._sessionState.UserName;
                if (!username)
                    resolve(false);

                fetch && fetch('/user/' + username + '/exists').then(function(response) {
                    resolve(true);
                }).catch(function() {
                    resolve(false);
                });
            } catch(e)
            {
                console.log(`Error while validating user: ${e.message}`);
            }
        });
    }
}