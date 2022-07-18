import { BrowserSupport } from "./enums";
import { storageKey } from "./constants";
const base64js = require('base64-js');

export function getStorageKey(): string  { return storageKey; }

/**
 * constructs public key credential for highway (server side)
 */
export function createAssertion(credential: PublicKeyCredential): any {
    if (!credential)
        return {};

    const attestationResp = new Uint8Array((credential.response as any).attestationObject);
    const clientDataJSON = new Uint8Array((credential.response as any).clientDataJSON);

    return {
        id: credential.id,
        rawId: bufferEncode(credential.rawId as Uint8Array),
        type: credential.type,
        response: {
            attestationObject: bufferEncode(attestationResp),
            clientDataJSON: bufferEncode(clientDataJSON),
        },
    };
}

function decodeAssertionClientResponse(clientResponse: ArrayBuffer, key: string): ArrayBuffer {
    const clientResponseStr: string = new TextDecoder().decode(clientResponse);
    var obj: any = JSON.parse(clientResponseStr)
    obj["challenge"] = atob(obj[key])

    return new TextEncoder().encode(JSON.stringify(obj))
}

export function createAuthenicator(credential: PublicKeyCredential): any {
    if (!credential)
        return {};

    let authData = new Uint8Array((credential.response as any).authenticatorData);
    let clientDataJSON = new Uint8Array((credential.response as any).clientDataJSON);
    let rawId = new Uint8Array(credential.rawId);
    let sig = new Uint8Array((credential.response as any).signature);
    let userHandle = new Uint8Array((credential.response as any).userHandle);
    
    return {
        id: credential.id,
        rawId: bufferEncode(rawId),
        type: credential.type,
        response: {
            authenticatorData: bufferEncode(authData),
            clientDataJSON: bufferEncode(clientDataJSON),
            signature: bufferEncode(sig),
            userHandle: bufferEncode(userHandle),
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
        if (window.location.protocol === "http:") {
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
export function decodeCredentialsFromAssertion(assertedCredential: any, username: string): boolean {
    if(assertedCredential) {
        assertedCredential.challenge = bufferDecode(assertedCredential.challenge);
        assertedCredential.excludeCredentials && assertedCredential.excludeCredentials.forEach(function (listItem) {
            if (!listItem) { return }
            listItem.id = bufferDecode(listItem.id);
        });

        if (assertedCredential.user) {
            assertedCredential.user.id = bufferDecode(assertedCredential.user.id);
            assertedCredential.user.name  = username;
        }

        return true;
    }

    return false;
};

export function decodeCredentialRequestOptions(makeAssertionOptions: PublicKeyCredentialRequestOptions) {
    makeAssertionOptions.challenge = bufferDecode((makeAssertionOptions.challenge as unknown as string));
    makeAssertionOptions.allowCredentials.forEach(function (listItem) {
        listItem.id = bufferDecode(listItem.id as unknown as string)
    });
}


/*
    Buffer Helpers
*/
export function string2buffer(data: string) {
    return new Uint8Array(data.length).map(function(x, i) {
        return data.charCodeAt(i);
    });
}

/**
 * Transforms an ArrayBuffer to base64 string
* @param value ArrayBuffer 
* @returns string base64
*/
export function bufferEncode(value: ArrayBuffer): string {
   return base64js.fromByteArray(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}


export function bufferDecode(value: string): Uint8Array {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

/**
 * @param buf Uint8AArray
 * @returns string
 */
export function buffer2string(buf: Uint8Array): string {
    let str = "";
    if (!(buf.constructor === Uint8Array)) {
        buf = new Uint8Array(buf);
    }

    for (let i =0; i < buf.length; i ++) {
        str += String.fromCharCode(buf[i]);
    }

    return str;
}

export function getOs() {
    const os = ["Windows", "Linux", "Macintosh"]; // add your OS values
    const userAgent = navigator.userAgent;
    for (let i = 0; i < os.length; i++) {
        if (userAgent.indexOf(os[i]) > -1) {
        return os[i];
        }
    }
    return "Unknown";
};

export function buildFinishRegistrationEndpoint(url: string, name: string, label: string): string {
    return `${url}?username=${name}&os=${getOs()}&label=${label}`;
}