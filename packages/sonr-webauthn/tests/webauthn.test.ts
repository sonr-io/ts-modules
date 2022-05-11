import {keyCredentialOption} from '../mocks/publickeyCredentials';
import { decodeCredentialAssertion } from '../src/utils';



test('expect decode credential to encode json', () => {
    const makeCredentialOptions: any = keyCredentialOption()
    decodeCredentialAssertion(makeCredentialOptions);
    expect(makeCredentialOptions).toHaveProperty("user.id")
    expect(makeCredentialOptions).toHaveProperty("challenge")
    expect(makeCredentialOptions).toHaveProperty("attestation")

});