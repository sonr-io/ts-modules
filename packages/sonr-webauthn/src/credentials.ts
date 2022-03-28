
const store = undefined;

export type user_id = string;
export type credential_id = string;

export interface StoredCredential {  
    user_id: user_id;
    credentialID: credential_id;
};

export async function getCredentials(user_id: user_id): Promise<StoredCredential[]> {  
    const results: StoredCredential[] = [];
    const refs = await store.collection('credentials').where('user_id', '==', user_id).orderBy('registered', 'desc').get();
    refs.forEach(cred => results.push(<StoredCredential>cred.data()));
    return results;
};

export async function getCredential(credential_id: credential_id): Promise<StoredCredential> {
    const doc = await store.collection('credentials').doc(credential_id).get();
    return <StoredCredential>doc.data();
};

export function storeCredential(credential: StoredCredential): Promise<FirebaseFirestore.WriteResult> {
    const ref = store.collection('credentials').doc(credential.credentialID);
    return ref.set(credential);
};

export function removeCredential(credential_id: credential_id): Promise<FirebaseFirestore.WriteResult> {
    const ref = store.collection('credentials').doc(credential_id);
    return ref.delete();
};