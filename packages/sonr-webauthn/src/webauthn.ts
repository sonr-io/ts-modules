import { assertionEndpoint, makeCredentialsEndpoint } from "./constants";
import { CreateSessionState, GetSessionState } from "./state";
import { bufferDecode, bufferEncode, createAssertion, encodeCredentialsForAssertion } from "./utils";

CreateSessionState();
const state: any = GetSessionState();

export function checkUserExists(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try
        {
            if (!state || !state.user.name)
                resolve(false);

            fetch('/user/' + state.user.name + '/exists').then(function(response) {
                resolve(true);
            }).catch(function() {
                resolve(false);
            });
        } catch(e)
        {
            console.log(`Error while validating user: ${state.user.name}`);
        }
    });
}

export function getCredentials(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
        try {
            fetch('/credential/' + state.user.name).then(function(response) {
                console.log(response)
                resolve(response);
            }).catch(function(error) {
                console.log(`Error while resolving user credenitals for ${state.user.name}`);
                reject();
            });
        } catch (e)
        {
            console.log(`Error while resolving user credentials for ${state.user.name}`);
        }
    });
}

export function makeCredential(name: string): Promise<Credential> {
    return new Promise<Credential>((resolve, reject) => {
        try {
            if (!name) { reject(); }
            GetSessionState().user.name = name;
            fetch(makeCredentialsEndpoint + '/' + state.user.name, { 
                method: "GET",
                }).then(async function(response: Response) {
                    const reqBody: string = await response.text();
                    const makeCredentialOptions: any = JSON.parse(reqBody);
                    makeCredentialOptions.publicKey.challenge = bufferDecode(makeCredentialOptions.publicKey.challenge);
                    makeCredentialOptions.publicKey.user.id = bufferDecode(makeCredentialOptions.publicKey.user.id);
                    if (makeCredentialOptions.publicKey.excludeCredentials) {
                        for (var i = 0; i < makeCredentialOptions.publicKey.excludeCredentials.length; i++) {
                            makeCredentialOptions.publicKey.excludeCredentials[i].id = bufferDecode(makeCredentialOptions.publicKey.excludeCredentials[i].id);
                        }
                    }
                    console.log(`Credential Creation Options: ${makeCredentialOptions}`);
                    resolve(makeCredentialOptions.publicKey);
                }).catch(() => {
                    reject();
                });
        } catch (e)
        {
            console.error(`Error while making user credentials: ${e.message}`); // what to do if the server returns resp code?
        }
    });
}

// This should be used to verify the auth data with the server
export function registerNewCredential(newCredential: any) {
    // Move data into Arrays incase it is super long
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);

    fetch(makeCredentialsEndpoint, {
        method: 'POST',
        body: JSON.stringify({
            id: newCredential.id,
            rawId: bufferEncode(rawId),
            type: newCredential.type,
            response: {
                attestationObject: bufferEncode(attestationObject),
                clientDataJSON: bufferEncode(clientDataJSON),
            },
        })
    });
};


export function getAssertion(
    credential: PublicKeyCredential
    ): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {
            const verificationObject: any = createAssertion(credential);
            verificationObject && fetch(assertionEndpoint + '/' + state.user.name, {
                method: 'POST',
                body: JSON.stringify(verificationObject),
            }).then(async function(response: Response) {
                const reqBody: string = await response.text();
                const makeAssertionOptions: any = JSON.parse(reqBody);
                makeAssertionOptions.publicKey.challenge = bufferDecode(makeAssertionOptions.publicKey.challenge);
                makeAssertionOptions.publicKey.allowCredentials.forEach(function(listItem) {
                    listItem.id = bufferDecode(listItem.id);
                });
                console.log(makeAssertionOptions);
                resolve(true);
            }).catch(function(err) {
                    console.log(err.name);
                    resolve(false);
            });
        } catch(e) {
            console.log(`Error while getting credential assertion: ${e.message}`);
            reject();
        }
    });
}

export function verifyAssertion(
    assertedCredential
    ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        // Move data into Arrays incase it is super long
        console.log('verifying assterted user credentials');
        const encodedAssertion: any = encodeCredentialsForAssertion(assertedCredential);
        const payload: any = createAssertion(assertedCredential);
        if (Object.keys(payload).length < 1) reject();

        fetch(assertionEndpoint, {
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(() => {
            resolve(true);
        }).catch(() => {
            reject(false);
        });
    });
}