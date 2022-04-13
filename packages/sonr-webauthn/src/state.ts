import { storageKey } from "./constants";
import { User } from "./types/User";

export type State = {
    user: User,
    credentials?: PublicKeyCredential
};

export function CreateSessionState(): void {
    if (!sState) {
        sState = {
            user: {
                name: "testuser@example.com",
                displayName: "testuser",
            },
            credentials: undefined
        };

        var sState = JSON.stringify(sState);
        sessionStorage && sessionStorage.setItem(storageKey, sState);
    }
}

export function GetSessionState(): State {
    const sessionState: string = sessionStorage?.getItem(storageKey) || "{}";
    return JSON.parse(sessionStorage.getItem(storageKey)) as State;
}

export function setSessionState(sessionState: State): void {
    const serializedState: string = JSON.stringify(sessionState);
    sessionStorage && sessionStorage.setItem(storageKey, serializedState);
}