import { CredentialOptions } from "./credentials";
import { CreateSessionState, GetSessionState } from "./state";
import { bufferDecode, bufferEncode } from "./utils";

CreateSessionState();
const state: any = GetSessionState();

function checkUserExists(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        try
        {
            fetch('/user/' + state.user.name + '/exists')
            .then(function(response) {
                return true;
            }).catch(function() {
                return false;
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
            fetch('/credential/' + state.user.name)
            .then(function(response) {
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

function makeCredential(name: string) {
    console.log("Fetching options for new credential");
    
    var credential = null;
    var attestation_type = $('#select-attestation').find(':selected').val();
    var authenticator_attachment = $('#select-authenticator').find(':selected').val();

    var user_verification = $('#select-verification').find(':selected').val();
    var resident_key_requirement = $('#select-residency').find(':selected').val();
    var txAuthSimple_extension = $('#extension-input').val();
    checkUserExists().then(function() {
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
            });
    });
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


function getAssertion(userVerification: string, txAuthSimple: string, name: string) {
    new Promise((resolve, reject) => {
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
            
            navigator.credentials.get({
                publicKey: makeAssertionOptions.publicKey
            }).then(function(credential) {
                console.log(credential);
                verifyAssertion(credential);
            }).catch(function(err) {
                console.log(err.name);
            });
        });
    });
}

function verifyAssertion(assertedCredential) {
    // Move data into Arrays incase it is super long
    console.log('verifying assterted user credentials');
    let authData = new Uint8Array(assertedCredential.response.authenticatorData);
    let clientDataJSON = new Uint8Array(assertedCredential.response.clientDataJSON);
    let rawId = new Uint8Array(assertedCredential.rawId);
    let sig = new Uint8Array(assertedCredential.response.signature);
    let userHandle = new Uint8Array(assertedCredential.response.userHandle);
    $.ajax({
        url: '/assertion',
        type: 'POST',
        data: JSON.stringify({
            id: assertedCredential.id,
            rawId: bufferEncode(rawId),
            type: assertedCredential.type,
            response: {
                authenticatorData: bufferEncode(authData),
                clientDataJSON: bufferEncode(clientDataJSON),
                signature: bufferEncode(sig),
                userHandle: bufferEncode(userHandle),
            },
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            window.location = "/dashboard";
            console.log(response)
        }
    });
}

function setCurrentUser(userResponse) {
    state.user.name = userResponse.name;
    state.user.displayName = userResponse.display_name;
}