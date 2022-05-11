export const keyCredentialOption: () => PublicKeyCredentialCreationOptions = () => {
    return   {
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
};

