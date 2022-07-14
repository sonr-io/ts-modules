export const keyCredentialOption: () => any = () => {
    return  {
        publicKey: {
            challenge: "Yb52bYi-UCnlg8HoSyGAOcZZvvmdwLfrv1Oq1aVfb30",
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
        }
    }
};

