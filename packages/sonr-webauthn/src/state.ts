import { storageKey } from "./constants";
import { User } from "./types/User";
import { State } from './types/State';

export class SessionState {
    private _state: User =  {
        name: "testuser@example.com",
        displayName: "testuser",
        id: undefined,
        iconURL: undefined,
    };
    constructor(intialState?: User) {
        this._state = intialState ? intialState : this._state;
    }

    get SessionState(): User {
        const sessionState: string = sessionStorage?.getItem(storageKey) || "{}";
        return JSON.parse(sessionState) as User;
    }

    set SessionState(value: User) {
        const serializedState: string = JSON.stringify(this._state);
        sessionStorage && sessionStorage.setItem(storageKey, serializedState);
    }

    get UserName(): string {
        return this._state.name;
    }

    set UserName(value: string) {
        this._state.name = value;
    }

    get DisplayName(): string {
        return this._state.displayName;
    }
    
    set DisplayName(value: string) {
        this._state.displayName = value;
    }
}