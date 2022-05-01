export const storageKey = 'sonr-username';
export const makeCredentialsEndpoint = '/register/name/start';
export const assertionEndpoint = '/register/name/finish';

export const verifyAssertionEndpoint = '/access/name/start';
export const authenticateUserEndpoint = '/access/name/finish';

export const staticPublicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge: Uint8Array.from(
        "XSASDACVDVSDFSDF", c => c.charCodeAt(0)),
    rp: {
        name: "Duo Security",
        id: "duosecurity.com",
    },
    user: {
        id: Uint8Array.from(
            "UZSL85T9AFC", c => c.charCodeAt(0)),
        name: "lee@webauthn.example",
        displayName: "Lee",
    },
    pubKeyCredParams: [{alg: -7, type: "public-key"}],
    authenticatorSelection: {
        authenticatorAttachment: "platform",
    },
    timeout: 60000,
    attestation: "direct"
};