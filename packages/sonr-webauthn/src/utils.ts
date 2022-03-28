import { BrowserSupport } from "./enums";
import { storageKey } from "./constants";

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

export function getStorageKey() { return storageKey; }

function string2buffer(data: string) {
    return (new Uint8Array(data.length)).map(function(x, i) {
        return data.charCodeAt(i)
    });
}

// Encode an ArrayBuffer into a base64 string.
function bufferEncode(value: Uint8Array) {
    return base64js.fromByteArray(value)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}

// Don't drop any blanks
// decode
function bufferDecode(value) {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
}

function buffer2string(buf: any) {
    let str = "";
    if (!(buf.constructor === Uint8Array)) {
        buf = new Uint8Array(buf);
    }
    buf.map(function(x: any) {
        return str += String.fromCharCode(x);
    });
    return str;
}