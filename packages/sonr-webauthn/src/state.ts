export type User = {
    name: string,
    displayName: string
};

export type State = {
    createResponse: any,
    publicKeyCredential: any,
    credential: any,
    user: User
};

let state: any = undefined;
export function CreateSessionState(): void {
    if (!state)
        state = {
            createResponse: null,
            publicKeyCredential: null,
            credential: null,
            user: {
                name: "testuser@example.com",
                displayName: "testuser",
            },
        };
}

export function GetSessionState() { return state; }