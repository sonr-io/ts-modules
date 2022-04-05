import { storageKey } from "./constants";

/* 
    Currently keeping session state in memory
    Should probably switch to using sessionStorage
*/
export type User = {
    name: string,
    displayName: string
};

export type State = {
    user: User
};

export function CreateSessionState(): void {
    if (!sState) {
        sState = {
            user: {
                name: "testuser@example.com",
                displayName: "testuser",
            },
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