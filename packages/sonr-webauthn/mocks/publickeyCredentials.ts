export const keyCredentialCreationOption: () => any = () => {
  return {
    publicKey: {
      challenge: "wNz1fYBQzYfVUcssnRvKgra5ZU/IhEcvmURBH9AyKxQ=",
      rp: {
        name: "Duo Security",
        id: "duosecurity.com",
      },
      user: {
        id: "UZSL85T9AFC",
        name: "lee@webauthn.example",
        displayName: "Lee",
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
      },
      timeout: 60000,
      attestation: "direct",
    },
  };
};

export const keyCredentialRequestOption: () => any = () => {
  return {
    "publicKey": {
      "challenge": "j6ugaI/L/qVokNe4DLBgPp8PDMsVMBloI3aCluzAJno=",
      "timeout": 60000,
      "rpId": "localhost",
      "allowCredentials": [{
        "type": "public-key",
        "id":
          "/+uc5aZxPE9XuQS5whsYRROC0F0yGJsse+2+DxB0ZBmis7eYHPKhA4nvGaJ138TqlSvnFrw=",
      }],
    },
  };
};
