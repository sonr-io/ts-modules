import { assertionEndpoint, authenticateUserEndpoint, makeCredentialsEndpoint, verifyAssertionEndpoint } from "./constants";
import { GetSessionState, setSessionState } from "./state";
import {Result, Status} from './types/Result';
import { ConfigurationOptions } from "./types/Options";
import {State} from './types/State';
import { Session } from '@sonr-io/types';

import { 
    bufferDecode,
    bufferEncode,
    createAssertion,
    createAuthenicator,
    decodeCredentialAssertion,
    decodeCredentialsFromAssertion,
    encodeCredentialsForAssertion } from "./utils";

/**
    check if a given user is present in the Sonr registry
    @returns boolean indiciating user status within registry 
*/
export function checkUserExists(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try
        {
            const sessionState: State = GetSessionState();
            if (!sessionState || !sessionState.user.name)
                resolve(false);

            fetch('/user/' + sessionState.user.name + '/exists').then(function(response) {
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

/**
* Retrieves authentication Credentials from authentication server
* @returns PublicKeyCredentialOptions
*/
export function getCredentials(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            const sessionState: State = GetSessionState();
            fetch('/credential/' + sessionState.user.name).then(function(response) {
                console.log(response)
                resolve(response);
            }).catch(function(error) {
                console.log(`Error while resolving user credenitals for ${sessionState.user.name}`);
                reject();
            });
        } catch (e)
        {
            console.log(`Error while resolving user credentials for ${e.message}`);
        }
    });
}

/**
* @throws Error  
* @param action 
* @param name domain name to be used for credential creation
* @returns Credential
*/
export async function startRegistration(name: string): Promise<PublicKeyCredentialCreationOptions | undefined> {
    const url: string = makeCredentialsEndpoint;
    const sessionState: State = GetSessionState();
    sessionState.user.name = name;
    setSessionState(sessionState);

    try {
        const response: Response | void = await fetch(
            url + '/' + sessionState.user.name,
            { method: "GET" }
        );
        
        if (!response || response == null) { 
            return undefined;
        }

        const reqBody: string = await response?.text();
        const makeCredentialOptions: PublicKeyCredentialCreationOptions = JSON.parse(reqBody);
        console.log(`Credential Creation Options: ${makeCredentialOptions}`);
        decodeCredentialAssertion(makeCredentialOptions);

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
export async function startLogin(name: string): Promise<Credential | undefined> {
    const url: string = verifyAssertionEndpoint;
    const sessionState: State = GetSessionState();
    try {
        const response: Response | void = await fetch(url + '/' + sessionState.user.name, { method: "GET" });
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
export function finishRegistration(
    credential: PublicKeyCredential
    ): Promise<Result<Session>> {
    return new Promise((resolve, reject) => {
        try {
            const url: string = assertionEndpoint;
            const sessionState: State = GetSessionState();
            const verificationObject: any = createAssertion(credential);
            const serializedCred: string = JSON.stringify(verificationObject);
            verificationObject && fetch(url + '/' + sessionState.user.name, {
                credentials: "same-origin",
                method: 'POST',
                body: serializedCred,
            }).then(async function(response: Response) {
                const reqBody: string = await response.text();

                if (response.status < 200 || response.status > 299)
                {
                    throw new Error(`Error while creating credential assertion: ${reqBody}`);
                }

                const makeAssertionOptions: Session = JSON.parse(reqBody);
                decodeCredentialsFromAssertion(makeAssertionOptions);

                console.log(makeAssertionOptions);
                resolve({
                    status: Status.success,
                    result: makeAssertionOptions,
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

export function finishLogin(
{ credential }: { credential: PublicKeyCredential; }    ): Promise<Result<Session>> {
    return new Promise((resolve, reject) => {
        try {
            const url: string = authenticateUserEndpoint;
            const sessionState: State = GetSessionState();
            const verificationObject: any = createAuthenicator(credential);
            const serializedCred: string = JSON.stringify(verificationObject);
            verificationObject && fetch(url + '/' + sessionState.user.name, {
                credentials: "same-origin",
                method: 'POST',
                body: serializedCred,
            }).then(async function(response: Response) {
                const reqBody: string = await response.text();

                if (response.status < 200 || response.status > 299)
                {
                    throw new Error(`Error while creating credential assertion: ${reqBody}`);
                }

                const makeAssertionOptions: Session = JSON.parse(reqBody);
                decodeCredentialsFromAssertion(makeAssertionOptions);

                console.log(makeAssertionOptions);
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