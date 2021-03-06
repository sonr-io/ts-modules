import { SessionState } from "../src/state";
import { ConfigurationOptions } from "../src/types/Options";
import { WebAuthn } from "./../src/webauthn";
import {keyCredentialCreationOption, keyCredentialRequestOption} from './../mocks/publickeyCredentials';
import { Result } from "../src/types";

let instance: WebAuthn;
let sessionState: SessionState = new SessionState();
let config: ConfigurationOptions;

//@ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(keyCredentialCreationOption()),
  })
);

beforeEach(() => {
    //@ts-ignore
    fetch.mockClear();

    config = {
        name: "test",
        deviceLabel: "phone",
        crossOrigin: false,
        rpId: "Sonr",
    };
    instance = new WebAuthn(config);
    instance.WithSessionState(sessionState);

    Object.defineProperty(window, 'PublicKeyCredential', function(){});
    Object.defineProperty(window, 'location', {});
});

test('Expect decode credential to encode json', () => {
    expect(instance).toBeDefined()
});


test("Expect session accessor to return session state", () => {
    expect(instance.SessionState).toBeDefined()
});

test("Expect Start Login to be defined", () => {
    expect(instance.StartLogin).toBeDefined()    
});

test("Expect StartRegistration to return publickey option", () => {
    expect(instance.StartRegistration).toBeDefined()
    //@ts-ignore
    instance.StartRegistration().then((option: Result<PublicKeyCredentialCreationOptions>) => {
        expect(option?.result).toBeDefined();
        expect(option?.result?.challenge).toBeDefined()
        expect(option?.result?.user).toBeDefined()
    })
});

test("Expect StartLogin to return publickey option", () => {
    //@ts-ignore
    global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(keyCredentialRequestOption()),
        })
    );
    //@ts-ignore
    instance.StartLogin().then((option: Result<PublicKeyCredentialRequestOptions> | undefined) => {
        expect(option).toBeDefined();
        expect(option?.result).toBeDefined()
    })
});
