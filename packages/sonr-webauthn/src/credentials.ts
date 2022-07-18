import { BrowserSupport } from "./enums";
import { detectWebAuthnSupport } from "./utils";

/*

*/
export async function createCredentials(
    options: PublicKeyCredentialCreationOptions
    ): Promise<Credential | null> {
    try
    {
        const browserSupport: BrowserSupport = detectWebAuthnSupport();
        if (browserSupport == BrowserSupport.NonHttps 
            || browserSupport == BrowserSupport.Unsupported)
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
    if (!pk) return;
    
    try
    {
        const browserSupport: BrowserSupport = detectWebAuthnSupport();
        if (browserSupport == BrowserSupport.NonHttps 
            || browserSupport == BrowserSupport.Unsupported)
            throw new Error("Browser does not support credentials");
        const credResponse: Credential = await navigator.credentials.get({
            publicKey: pk
        });

        return credResponse;
    } catch(e)
    {
        console.error(`Error while getting public key credentials ${e.message}`);
        throw e; // throw error back to the caller to handle.
    }
};

/*
    Navigator Credentials to query on the endpoint
*/
export async function storeCredentials(credential: Credential): Promise<Credential | null> {
    if (!credential) return;
    
    try
    {
        const browserSupport: BrowserSupport = detectWebAuthnSupport();
        if (browserSupport == BrowserSupport.NonHttps 
            || browserSupport == BrowserSupport.Unsupported)
            throw new Error("Browser does not support credentials");
        const credResponse: Credential = await navigator.credentials.store(credential)
        return credResponse;
    } catch(e)
    {
        console.error(`Error while getting public key credentials ${e.message}`);
        throw e; // throw error back to the caller to handle.
    }
};