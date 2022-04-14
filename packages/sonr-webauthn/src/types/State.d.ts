import { User } from "./User";

export declare type State = {
    user: User,
    credentials?: PublicKeyCredential;
};