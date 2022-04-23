export interface WhoIs {
    name: string;
    did: string;
    document: ArrayBuffer;
    creator: string;
    credentials: Credential[];
    type: any;
    metaData: Map<string, string>
    timestamp: number;
    isActive: boolean;
}

export interface Session {
    baseDID: string,
    whoIs: WhoIs,
    credential: Credential
}

export enum Type {
    User = 0,
    App = 1,
}