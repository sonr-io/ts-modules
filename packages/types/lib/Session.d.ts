import { WhoIs } from "./WhoIs";

/**
    User session instance containing a WhoIs and Credential, making a user session 
*/
export interface Session {
    ownerDid: string;
    whoIs: WhoIs;
    credential: PublicKeyCredential;
}