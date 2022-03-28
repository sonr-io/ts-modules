import { getCredentials, removeCredential, storeCredential } from './credential';

await storeCredential({      
    user_id: user.user_id,      
    credentialID: base64CredentialID,      
    credentialPublicKey: base64PublicKey,
    counter,      
    registered: getNow(),      
    user_verifying: registrationInfo.userVerified,      
    authenticatorAttachment: req.session.type || "undefined",      
    browser: req.useragent?.browser,      
    os: req.useragent?.os,      
    platform: req.useragent?.platform,      
    transports,
    clientExtensionResults,    
});