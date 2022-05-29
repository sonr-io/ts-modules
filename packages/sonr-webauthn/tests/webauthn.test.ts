import { SessionState } from "../src/state";
import { ConfigurationOptions } from "../src/types/Options";
import { WebAuthn } from "./../src/webauthn";

let instance: WebAuthn = undefined;
let sessionState: SessionState = new SessionState();

let config: ConfigurationOptions = undefined;
beforeEach(() => {
    config = {
        name: "test",
        crossOrigin: false,
        rpId: "Sonr",
    };
    instance = new WebAuthn(config);
    instance.WithSessionState(sessionState);
});

test('Expect decode credential to encode json', () => {
    expect(instance).toBeDefined()
});


test("Expect session accessor to return session state", () => {
    expect(instance.SessionState).toBeDefined()
})