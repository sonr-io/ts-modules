import express, { Request, Response } from 'express';
import { WebAuthnRegistrationObject, WebAuthnAuthenticationObject } from './scripts/common';
import base64url from 'base64url';
import { getNow, csrfCheck, authzAPI } from './scripts/helper';
import { getCredentials, removeCredential, storeCredential } from './scripts/credential';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import {
  AttestationConveyancePreference,
  PublicKeyCredentialDescriptor,
  PublicKeyCredentialParameters,
  AuthenticatorDevice,
  RegistrationCredentialJSON,
  AuthenticationCredentialJSON,
} from '@simplewebauthn/typescript-types';

const router = express.Router();

router.use(csrfCheck);

const RP_NAME = "Mock Server"
const WEBAUTHN_TIMEOUT = 1000 * 60 * 5; // 5 minutes

export const getOrigin = (
  _origin: string,
  userAgent?: string
): string => {
  let origin = _origin;
  if (!userAgent) return origin;

  const appRe = /^[a-zA-z0-9_.]+/;
  const match = userAgent.match(appRe);
  if (match) {
    // Check if UserAgent comes from a supported Android app.
    if (process.env.ANDROID_PACKAGENAME && process.env.ANDROID_SHA256HASH) {
      const package_names = process.env.ANDROID_PACKAGENAME.split(",").map(name => name.trim());
      const hashes = process.env.ANDROID_SHA256HASH.split(",").map(hash => hash.trim());
      const appName = match[0];
      for (let i = 0; i < package_names.length; i++) {
        if (appName === package_names[i]) {
          // We recognize this app, so use the corresponding hash.
          const octArray = hashes[i].split(':').map((h) =>
            parseInt(h, 16),
          );
          // @ts-ignore
          const androidHash = base64url.encode(octArray);
          origin = `android:apk-key-hash:${androidHash}`;
          break;
        }
      }
    }
  }
  
  return origin;
}

/**
 * Returns a list of credentials
 **/
router.post('/getCredentials', authzAPI, async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!res.locals.user) throw 'Unauthorized.';

  const user = res.locals.user;

  try {
    const credentials = getCredentials(user.user_id);
    res.json(credentials);
  } catch (error) {
    console.error(error);
    res.status(401).json({
      status: false,
      error: 'Unauthorized'
    });
  }
});

/**
 * Removes a credential id attached to the user
 * Responds with empty JSON `{}`
 **/
router.post('/removeCredential', authzAPI, async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!res.locals.user) throw 'Unauthorized.';

  const { credId, userId } = req.body;

  try {
    removeCredential(userId, credId);
    res.json({
      status: true
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false
    });
  }
});

router.post('/registerRequest', authzAPI, async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!res.locals.user) throw 'Unauthorized.';
    if (!res.locals.hostname) throw 'Hostname not configured.';

    const user = res.locals.user;
    const creationOptions = <WebAuthnRegistrationObject>req.body || {};

    const excludeCredentials: PublicKeyCredentialDescriptor[] = [];
    if ((creationOptions as WebAuthnRegistrationObject).credentialsToExclude) {
      const credentials = await getCredentials(user.user_id);
      if (credentials.length > 0) {
        for (let cred of credentials) {
          if ((creationOptions as WebAuthnRegistrationObject)?.credentialsToExclude?.includes(`ID-${cred.credentialID}`)) {
            excludeCredentials.push({
              id: base64url.toBuffer(cred.credentialID),
              type: 'public-key',
              transports: cred.transports,
            });
          }
        }
      }
    }
    const pubKeyCredParams: PublicKeyCredentialParameters[] = [];
    // const params = [-7, -35, -36, -257, -258, -259, -37, -38, -39, -8];
    const params = [-7, -257];
    for (let param of params) {
      pubKeyCredParams.push({ type: 'public-key', alg: param });
    }
    const authenticatorSelection: AuthenticatorSelectionCriteria = {};
    const aa = (creationOptions as WebAuthnRegistrationObject).authenticatorSelection?.authenticatorAttachment;
    const rk = (creationOptions as WebAuthnRegistrationObject).authenticatorSelection?.residentKey;
    const uv = (creationOptions as WebAuthnRegistrationObject).authenticatorSelection?.userVerification;
    const cp = (creationOptions as WebAuthnRegistrationObject).attestation; // attestationConveyancePreference
    let attestation: AttestationConveyancePreference = 'none';

    if (aa === 'platform' || aa === 'cross-platform') {
      authenticatorSelection.authenticatorAttachment = aa;
    }
    const enrollmentType = aa || 'undefined';
    if (rk === 'required' || rk === 'preferred' || rk === 'discouraged') {
      authenticatorSelection.residentKey = rk;
    }
    if (uv === 'required' || uv === 'preferred' || uv === 'discouraged') {
      authenticatorSelection.userVerification = uv;
    }
    if (cp === 'none' || cp === 'indirect' || cp === 'direct' || cp === 'enterprise') {
      attestation = cp;
    }

    // TODO: Validate
    const extensions = (creationOptions as WebAuthnRegistrationObject).extensions;
    const timeout = (creationOptions as WebAuthnRegistrationObject).customTimeout || WEBAUTHN_TIMEOUT;

    const options = generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: res.locals.hostname,
      userID: user.user_id,
      userName: user.name || 'Unnamed User',
      timeout,
      // Prompt users for additional information about the authenticator.
      attestationType: attestation,
      // Prevent users from re-registering existing authenticators
      excludeCredentials,
      authenticatorSelection,
      extensions,
    });
    //@ts-ignore
    req.session.challenge = options.challenge;
    //@ts-ignore
    req.session.timeout = getNow() + WEBAUTHN_TIMEOUT;
    //@ts-ignore
    req.session.type = enrollmentType;

    res.json(options);
  } catch (error) {
    console.error(error);
    res.status(400).send({ status: false, error: error });
  }
});

router.post('/registerResponse', authzAPI, async (
  req: Request,
  res: Response
) => {
  try {
    if (!res.locals.user) throw 'Unauthorized.';
    //@ts-ignore
    if (!req.session.challenge) throw 'No challenge found.';
    if (!res.locals.hostname) throw 'Hostname not configured.';
    if (!res.locals.origin) throw 'Origin not configured.';

    const user = res.locals.user;
    const credential = <RegistrationCredentialJSON>req.body;

    //@ts-ignore
    const expectedChallenge = req.session.challenge;
    const expectedRPID = res.locals.hostname;

    let expectedOrigin = getOrigin(res.locals.origin, req.get('User-Agent'));

    const verification = await verifyRegistrationResponse({
      credential,
      expectedChallenge,
      expectedOrigin,
      expectedRPID,
    });

    const { verified, registrationInfo } = verification;

    if (!verified || !registrationInfo) {
      throw 'User verification failed.';
    }

    const { credentialPublicKey, credentialID, counter } = registrationInfo;
    const base64PublicKey = base64url.encode(credentialPublicKey);
    const base64CredentialID = base64url.encode(credentialID);
    const { transports, clientExtensionResults } = credential;

    await storeCredential({
      user_id: user.user_id,
      credentialID: base64CredentialID,
      credentialPublicKey: base64PublicKey,
      counter,
      registered: getNow(),
      user_verifying: registrationInfo.userVerified,
      //@ts-ignore
      authenticatorAttachment: req.session.type || "undefined",
      //@ts-ignore
      browser: req.useragent?.browser,
      //@ts-ignore
      os: req.useragent?.os,
      //@ts-ignore
      platform: req.useragent?.platform,
      transports,
      clientExtensionResults,
    });
    //@ts-ignore
    delete req.session.challenge;
    //@ts-ignore
    delete req.session.timeout;
    //@ts-ignore
    delete req.session.type;

    // Respond with user info
    res.json(credential);
  } catch (error: any) {
    console.error(error);

    //@ts-ignore
    delete req.session.challenge;
    //@ts-ignore
    delete req.session.timeout;
    //@ts-ignore
    delete req.session.type;

    res.status(400).send({ status: false, error: error.message });
  }
});

router.post('/authRequest', authzAPI, async (
  req: Request,
  res: Response
) => {
  if (!res.locals.user) throw 'Unauthorized.';

  try {
    const user = res.locals.user;

    const requestOptions = <WebAuthnAuthenticationObject>req.body;

    const userVerification = requestOptions.userVerification || 'preferred';
    const timeout = requestOptions.customTimeout || WEBAUTHN_TIMEOUT;
    const allowCredentials: PublicKeyCredentialDescriptor[] = [];
    const rpID = res.locals.hostname;

    // If `credentialsToAllow` is not defined, leave `allowCredentials` an empty array.
    if (requestOptions.credentialsToAllow) {
      const credentials = await getCredentials(user.user_id);
      for (let cred of credentials) {
        // When credId is not specified, or matches the one specified
        if (requestOptions.credentialsToAllow.includes(`ID-${cred.credentialID}`)) {
          allowCredentials.push({
            id: base64url.toBuffer(cred.credentialID),
            type: 'public-key',
            transports: cred.transports
          });
        }
      }
    }

    const options = generateAuthenticationOptions({
      timeout,
      allowCredentials,
      userVerification,
      rpID
    });
    //@ts-ignore
    req.session.challenge = options.challenge;
    //@ts-ignore
    req.session.timeout = getNow() + WEBAUTHN_TIMEOUT;

    res.json(options);
  } catch (error) {
    console.error(error);

    res.status(400).json({ status: false, error });
  }
});

router.post('/authResponse', authzAPI, async (
  req: Request,
  res: Response
) => {
  if (!res.locals.user) throw 'Unauthorized.';

  if (!res.locals.hostname) throw 'Hostname not configured.';
  if (!res.locals.origin) throw 'Origin not configured.';

  const user = res.locals.user;
  //@ts-ignore
  const expectedChallenge = req.session.challenge || '';
  const expectedRPID = res.locals.hostname;
  const expectedOrigin = getOrigin(res.locals.origin, req.get('User-Agent'));

  try {
    const claimedCred = <AuthenticationCredentialJSON>req.body;

    const credentials = await getCredentials(user.user_id);
    let storedCred = credentials.find((cred) => cred.credentialID === claimedCred.id);

    if (!storedCred) {
      throw 'Authenticating credential not found.';
    }

    const base64PublicKey = base64url.toBuffer(storedCred.credentialPublicKey);
    const base64CredentialID = base64url.toBuffer(storedCred.credentialID);
    const { counter, transports } = storedCred; 

    const authenticator: AuthenticatorDevice = {
      credentialPublicKey: base64PublicKey,
      credentialID: base64CredentialID,
      counter,
      transports
    }

    const verification = verifyAuthenticationResponse({
      credential: claimedCred,
      expectedChallenge,
      expectedOrigin,
      expectedRPID,
      authenticator,
    });

    const { verified, authenticationInfo } = verification;

    if (!verified) {
      throw 'User verification failed.';
    }

    storedCred.counter = authenticationInfo.newCounter;
    storedCred.last_used = getNow();
    //@ts-ignore
    delete req.session.challenge;
    //@ts-ignore
    delete req.session.timeout;
    res.json(storedCred);
  } catch (error) {
    console.error(error);
    //@ts-ignore
    delete req.session.challenge;
    //@ts-ignore
    delete req.session.timeout;
    res.status(400).json({ status: false, error });
  }
});

export { router as webauthn };