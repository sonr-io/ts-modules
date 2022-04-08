# Webauthn sonr authentication

[Webauthn](https://webauthn.io/) implementation for the sonr highway node implemetnation. 
 
## Registration of user public key information for a sonr domain.
```
/register/name/start
/register/name/finish
```

Public Key Credentials options 
```
const publicKeyCredentialCreationOptions = {
    challenge: Uint8Array.from(
        randomStringFromServer, c => c.charCodeAt(0)),
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
```

## Authentication of user public key information for a sonr domain
```
/access/name/start
/access/name/finish
```

## Usage
```
startRegistration(/* options */); -> returns a status of true / false
```

```
startAuthentication(/* options */); -> returns a status of true / false
```

# Development
```
npm run tsc (builds project typescript)
npm run bundle:dev (bundles files for single file bundle distribution)
npm run bundle:prod (bundles and minifies for production/publishing)
```