export const keyCredentialOption: () => any = () => {
    return   {
        challenge: "XSASDACVDVSDFSDF",
        rp: {
            name: "Duo Security",
            id: "duosecurity.com",
        },
        user: {
            id: "UZSL85T9AFC",
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
