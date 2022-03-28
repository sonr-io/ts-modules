export function CreateSessionState(): object {
    return {
        createResponse: null,
        publicKeyCredential: null,
        credential: null,
        user: {
            name: "testuser@example.com",
            displayName: "testuser",
        },
    }
}