# Webauthn sonr authentication

[Webauthn](https://webauthn.io/) implementation for sonr device registration 
 
## Options
```
interface ConfigurationOptions {
    name: string;
    deviceLabel: string,
    crossOrigin: boolean;
    rpId: string;
    registrationHooks?: RegistrationHookDefinition;
    logingHooks?: AuthenticationHookDefinition;
};

interface RegistrationHookDefinition {
    afterStart: () => void;
    afterFinish: () => void;
};

interface AuthenticationHookDefinition {
    afterStart: () => void;
    afterFinish: () => void;
}
```
## Usage
```
startRegistration(/* options */).then((publicKey: PublicKeyCredential) => {

})
```

```
startAuthentication(/* options */).then((publicKey: PublicKeyCredential) => {

})
```

# Development
```
npm run tsc (builds project typescript)
npm run bundle:dev (bundles files for single file bundle distribution)
npm run bundle:prod (bundles and minifies for production/publishing)
```