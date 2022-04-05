# Webauthn sonr authentication
provided webauthn authentication implementations for the Sonr network.
the following are endpoints relating to authentication mechanisms within the sonr network

## Registration of user public key information for a sonr domain.
```
/register/name/start
/register/name/finish
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