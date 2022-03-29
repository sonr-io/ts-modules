import { CreateSessionState, GetSessionState } from "./state";
import { bufferDecode, bufferEncode } from "./utils";

CreateSessionState();
const state: any = GetSessionState();

function checkUserExists(): Promise<boolean> {
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

function getCredentials(state: any): Promise<object> {
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

function makeCredential(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            var credential = null;
    
            var attestation_type = "";
            var authenticator_attachment = "";
        
            var user_verification = "";
            var resident_key_requirement = "";
            var txAuthSimple_extension = "";
            
            checkUserExists().then(function(resp: boolean) {
                if (!resp)
                    reject();
                fetch('/makeCredential/' + state.user.name, { 
                    method: "POST",
                    body: JSON.stringify({
                            attType: attestation_type,
                            authType: authenticator_attachment,
                            userVerification: user_verification,
                            residentKeyRequirement: resident_key_requirement,
                            txAuthExtension: txAuthSimple_extension,
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
                    }).catch(() => {
                        reject();
                    });
            });
        } catch (e)
        {
            console.error(`Error while making user credentials: ${e.message}`); // what to do if the server returns resp code?
        }
    });
    console.log("Fetching options for new credential");
}

// This should be used to verify the auth data with the server
function registerNewCredential(newCredential: any) {
    // Move data into Arrays incase it is super long
    let attestationObject = new Uint8Array(newCredential.response.attestationObject);
    let clientDataJSON = new Uint8Array(newCredential.response.clientDataJSON);
    let rawId = new Uint8Array(newCredential.rawId);

    fetch('/makeCredential', {
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


function getAssertion(userVerification: string, txAuthSimple: string, name: string): Promise<PublicKeyCredentialCreationOptions> {
    return new Promise((resolve, reject) => {
        state.user.name = name;
        fetch('/assertion/' + state.user.name, {
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

function verifyAssertion(assertedCredential): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        // Move data into Arrays incase it is super long
        console.log('verifying assterted user credentials');
        let authData = new Uint8Array(assertedCredential.authenticatorData);
        let clientDataJSON = new Uint8Array(assertedCredential.clientDataJSON);
        let rawId = new Uint8Array(assertedCredential.rawId);
        let sig = new Uint8Array(assertedCredential.signature);
        let userHandle = new Uint8Array(assertedCredential.response.userHandle);
        fetch('/assertion', {
            method: 'POST',
            body: JSON.stringify({
                id: assertedCredential.id,
                rawId: bufferEncode(rawId),
                type: assertedCredential.type,
                response: {
                    authenticatorData: bufferEncode(authData),
                    clientDataJSON: bufferEncode(clientDataJSON),
                    signature: bufferEncode(sig),
                    userHandle: bufferEncode(userHandle),
                },
            })
        });
    });
}

function setCurrentUser(userResponse) {
    state.user.name = userResponse.name;
    state.user.displayName = userResponse.display_name;
}