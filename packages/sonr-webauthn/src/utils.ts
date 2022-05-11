import { BrowserSupport } from "./enums";
import { storageKey } from "./constants";

export function getStorageKey(): string  { return storageKey; }

/**
 * constructs public key credential for highway (server side)
 */
export function createAssertion(credential: PublicKeyCredential): any {
    if (!credential)
        return {};

    return {
        id: credential.id,
        rawId: bufferEncode(credential.rawId as Uint8Array),
        type: credential.type,
        response: {
            attestationObject: bufferEncode((credential.response as any).attestationObject),
            clientDataJSON: bufferEncode((credential.response as any).clientDataJSON),
        },
    };
}

export function createAuthenicator(credential: PublicKeyCredential): any {
    if (!credential)
        return {};

    return {
        id: credential.id,
        rawId: bufferEncode(credential.rawId as Uint8Array),
        type: credential.type,
        response: {
            authenticatorData: bufferEncode((credential.response as any).authenticatorData),
            //attestationObject: bufferEncode((credential.response as any).attestationObject),
            clientDataJSON: bufferEncode((credential.response as any).clientDataJSON),
            signature: bufferEncode((credential.response as any).signature),
            userHandle: bufferEncode((credential.response as any).userHandle)
        },
    };
}

/**
 * 
 * @returns BrowserSupport Support status indicating compatibility for webauthn
 */
export function detectWebAuthnSupport(): BrowserSupport {
    if (window.PublicKeyCredential === undefined ||
        typeof window.PublicKeyCredential !== "function") {
        if (window.location.protocol === "http:" 
            && (window.location.hostname !== "localhost" 
            && window.location.hostname !== "127.0.0.1")) {
            return BrowserSupport.NonHttps;
        }

        // browser not supported or https is disabled
        return BrowserSupport.Unsupported;
    }

    // Browser suppported and https enabled
    return BrowserSupport.Supported;
}

/**
 * Creates encoded buffers for public key exchange options. 
*/
export function encodeCredentialsForAssertion(assertedCredential: any): any {
    try 
    {
        let authData = new Uint8Array(assertedCredential.authenticatorData);
        let clientDataJSON = new Uint8Array(assertedCredential.clientDataJSON);
        let rawId = new Uint8Array(assertedCredential.rawId);
        let sig = new Uint8Array(assertedCredential.signature);
        let userHandle = new Uint8Array(assertedCredential.response.userHandle);

        return {
            authData,
            clientDataJSON,
            rawId,
            sig,
            userHandle
        };
    } catch (e) {
        console.error(`Error while encoding credential assertion: ${e.message}`);
        
    }
}

/**
 * Decodes ArrayBuffer to Uint8Array
 * @param assertedCredential  key credentials
 * @returns status (bool)
 */
export function decodeCredentialsFromAssertion(assertedCredential: any): boolean {

    if(assertedCredential.publicKey)
    {
        assertedCredential.publicKey.challenge = bufferDecode(assertedCredential.publicKey.challenge);
        assertedCredential.publicKey.allowCredentials.forEach(function (listItem) {
            listItem.id = bufferDecode(listItem.id);
        });

        return true;
    }

    return false;
};


export function decodeCredentialAssertion(makeCredentialOptions: any): boolean {
    if (!makeCredentialOptions.publicKey) {
        return false;
    }
    
    makeCredentialOptions.publicKey.challenge = bufferDecode(makeCredentialOptions.publicKey.challenge);
    makeCredentialOptions.publicKey.user.id = bufferDecode(makeCredentialOptions.publicKey.user.id);
    

    if (makeCredentialOptions.publicKey.excludeCredentials) {
        for (var i = 0; i < makeCredentialOptions.publicKey.excludeCredentials.length; i++) {
            makeCredentialOptions.publicKey.excludeCredentials[i].id = bufferDecode(makeCredentialOptions.publicKey.excludeCredentials[i].id);
        }
    }

    return true;
}


/*
    Buffer Helpers
*/

export function string2buffer(data: string) {
    return (new Uint8Array(data.length)).map(function(x, i) {
        return data.charCodeAt(i);
    });
}

/**
 * Transforms an ArrayBuffer to base64 string
* @param value arraybuffer to be transformed 
* @returns string base64 encoded array value
*/
export function bufferEncode(value: ArrayBuffer): string {
    try 
    {
        const base65Str: string = btoa(String.fromCharCode(...new Uint8Array(value)));
        return base65Str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    } catch(e) {
        console.log(`Error while encoding key credentials: ${e.message}`);
    }
}

// Don't drop any blanks
export function bufferDecode(value): Uint8Array {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

export function buffer2string(buf: any) {
    let str = "";
    if (!(buf.constructor === Uint8Array)) {
        buf = new Uint8Array(buf);
    }

    buf.map(function(x: any) {
        return str += String.fromCharCode(x);
    });

    return str;
}