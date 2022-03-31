
import { StoredCredential, credential_id, user_id } from "./common";

const store: Map<string, StoredCredential[]> = new Map<string, StoredCredential[]>();

function addBucket(credential_id: credential_id): void {
    store[credential_id] = !store[credential_id] || store[credential_id] == null ? [] : store[credential_id];
}

export function getCredentials(user_id: user_id): StoredCredential[] {
    if (!store[user_id] || typeof(store[user_id]) !== "object")
        return [];
    return store[user_id];
}

export function getCredential(user_id: user_id, credential_id: credential_id): StoredCredential | null {
    if (!store[user_id])
        return null;
    
    const bucket: StoredCredential[] = store[user_id];

    // hacky but this is just a mock store, should be fine
    const cred: StoredCredential | undefined = bucket.find((cred: StoredCredential) => cred.credentialID == credential_id);
    return cred ? cred : null;
}
  
export function storeCredential(credential: StoredCredential): void {
    try 
    {
        addBucket(credential.user_id);
        store[credential.user_id].push(credential);
    } catch(e)
    {
        console.error('Error while storing Credential', (e as Error).message);
    }
}
  
export function removeCredential(user_id: user_id, credential_id: credential_id): void {
    if (!store[credential_id])
        return;
    
    const creds: StoredCredential[] = store[user_id];
    const filteredCreds: StoredCredential[] = creds.filter((value: StoredCredential) => value.credentialID != credential_id);
    store[user_id] = filteredCreds;
}