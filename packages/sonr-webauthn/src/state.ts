import { storageKey } from "./constants";
import { User } from "./types/User";
import { State } from './types/State';

let sState: State | undefined = undefined;
export function CreateSessionState(): void {
    if (!sState) {
        sState = {
            user: {
                name: "",
                displayName: "",
                id: undefined,
            },
            credentials: undefined,
            whoIs: undefined
        };

        var sState = JSON.stringify(sState);
        sessionStorage && sessionStorage.setItem(storageKey, sState);
    }
}

export function GetSessionState(): State {
    const sessionState: string = sessionStorage?.getItem(storageKey) || "{}";
    return JSON.parse(sessionState) as State;
}

export function setSessionState(sessionState: State): void {
    const serializedState: string = JSON.stringify(sessionState);
    sessionStorage && sessionStorage.setItem(storageKey, serializedState);
}