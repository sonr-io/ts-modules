import { BrowserSupport } from "./enums";
import { detectWebAuthnSupport } from "./utils";

/*

*/
function createCredentialOptions(
    serverContext: string, 
    userName: string, 
    displayName: string): PublicKeyCredentialCreationOptions {
    return {
        challenge: Uint8Array.from(
            serverContext, c => c.charCodeAt(0)),
        rp: {
            name: "Duo Security",
            id: "duosecurity.com",
        },
        user: {
            id: Uint8Array.from(
                "UZSL85T9AFC", c => c.charCodeAt(0)),
            name: "lee@webauthn.guide",
            displayName: "Lee",
        },
        // -7 indicates that the server accepts Elliptic Curve public keys using a SHA-256
        pubKeyCredParams: [{alg: -7, type: "public-key"}],
        authenticatorSelection: {
            authenticatorAttachment: "cross-platform",
        },
        timeout: 60000,
        attestation: "direct"
    };    
};

/*

*/
export async function createCredentials(
    options: PublicKeyCredentialCreationOptions
    ): Promise<Credential | null> {
    try
    {
        const browserSupport: BrowserSupport = detectWebAuthnSupport();
        if (browserSupport == BrowserSupport.NonHttps || BrowserSupport.Unsupported)
            throw new Error("Browser does not support credentials");
        
        const cred: Credential = await navigator.credentials.create({
            publicKey: options
        });

        return cred;
    } catch(e)
    {
        console.error(`Error while creating public key credentials ${e.message}`);
        throw e; // throw error back to the caller to handle.
    }
};

/*
    Navigator Credentials to query on the endpoint
*/
export async function getCredentials(pk: PublicKeyCredentialRequestOptions): Promise<Credential | null> {
    if (!pk) return null;
    
    try
    {
        const browserSupport: BrowserSupport = detectWebAuthnSupport();
        if (browserSupport == BrowserSupport.NonHttps || BrowserSupport.Unsupported)
            throw new Error("Browser does not support credentials");
        const credResponse = await navigator.credentials.get({
            publicKey: pk
        });

        return credResponse;
    } catch(e)
    {
        console.error(`Error while getting public key credentials ${e.message}`);
        throw e; // throw error back to the caller to handle.
    }
};