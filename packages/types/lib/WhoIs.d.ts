/**
 * Entry in name registry
 * Holds user Credential from os keychain
*/
export interface WhoIs {
        name: string;
        did: string;
        document: Int8Array;
        creator: string;
        credential: Credential;
        metadata: Map<string, string>
        type: Type;
        timespamp: BigInt64Array;
        isActive: boolean;
}

export enum Type {
    // User is the type of the registered name
    User,

    // Application is the type of the registered name
    Application
}