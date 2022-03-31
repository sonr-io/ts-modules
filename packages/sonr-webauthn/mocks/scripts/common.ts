import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON }
  from '@simplewebauthn/typescript-types';

export interface UserInfo {
  user_id: string
  name: string
  picture: string
};

export interface WebAuthnRegistrationObject extends Omit<PublicKeyCredentialCreationOptionsJSON, 'rp' | 'pubKeyCredParams'> {
  credentialsToExclude?: string[]
  customTimeout?: number
  abortTimeout?: number
};

export interface WebAuthnAuthenticationObject extends PublicKeyCredentialRequestOptionsJSON {
  credentialsToAllow?: string[]
  customTimeout?: number
};

export type user_id = string;
export type credential_id = string;

export interface StoredCredential {
  user_id: user_id
  // User visible identifier.
  credentialID: credential_id // roaming authenticator's credential id,
  credentialPublicKey: string // public key,
  counter: number // previous counter,
  aaguid?: string // AAGUID,
  registered?: number // registered epoc time,
  user_verifying: boolean // user verifying authenticator,
  authenticatorAttachment: "platform" | "cross-platform" | "undefined" // authenticator attachment,
  transports?: AuthenticatorTransport[] // list of transports,
  browser?: string
  os?: string
  platform?: string
  last_used?: number // last used epoc time,
  clientExtensionResults?: any
}