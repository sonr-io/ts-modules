import { BrowserSupport } from "./enums";
import { storageKey } from "./constants";
import { fromByteArray } from "base64-js";

export function getStorageKey(): string  { return storageKey; }

export function createAssertion(credential: PublicKeyCredential): any {
    if (!credential)
        return {};
    credential.response.clientDataJSON;
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

export function decodeCredentialsFromAssertion(assertedCredential: any): void {
    assertedCredential.publicKey.challenge = bufferDecode(assertedCredential.publicKey.challenge);
    assertedCredential.publicKey.allowCredentials.forEach(function (listItem) {
        listItem.id = bufferDecode(listItem.id);
    });
};

export function string2buffer(data: string) {
    return (new Uint8Array(data.length)).map(function(x, i) {
        return data.charCodeAt(i);
    });
}

/*
* Encode an ArrayBuffer into a base64 string.
*/
export function bufferEncode(value: Uint8Array): string {
    try 
    {
        const base65Str: string = atob(String.fromCharCode.apply(null, new Uint8Array(value)));

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