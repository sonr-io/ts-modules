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
            var credential = null;
            
            fetch(makeCredentialsEndpoint + '/' + state.user.name, { 
                method: "POST",
                body: JSON.stringify({
                        attType: "",
                        authType: "",
                        userVerification: "",
                        residentKeyRequirement: "",
                        txAuthExtension: "",
                    })
                }).then((makeCredentialOptions: any) => {
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
                        userVerification: string,
                        txAuthSimple: string, 
                        name: string): Promise<PublicKeyCredentialCreationOptions> {
    return new Promise((resolve, reject) => {
        state.user.name = name;
        fetch(assertionEndpoint + state.user.name, {
            body: JSON.stringify({
                userVer: userVerification,
                txAuthExtension: txAuthSimple
            // TODO: Create type for asstertion response
            })
        }).then(function(makeAssertionOptions: any) {
            console.log(makeAssertionOptions);
            makeAssertionOptions.publicKey.challenge = bufferDecode(makeAssertionOptions.publicKey.challenge);
            makeAssertionOptions.publicKey.allowCredentials.forEach(function(listItem) {
                listItem.id = bufferDecode(listItem.id)
            });
            console.log(makeAssertionOptions);
            resolve(makeAssertionOptions.publicKey);
        }).catch(function(err) {
                console.log(err.name);
                reject();
        });
    });
}

export function verifyAssertion(assertedCredential): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        // Move data into Arrays incase it is super long
        console.log('verifying assterted user credentials');
        const encodedAssertion: any = encodeCredentialsForAssertion(assertedCredential);
        const payload: any = createAssertion(assertedCredential, encodedAssertion);
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