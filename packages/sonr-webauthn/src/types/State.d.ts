import { User } from "./User";

export interface State {
    user: User,
    credentials?: PublicKeyCredential;
    whoIs: any;
}
