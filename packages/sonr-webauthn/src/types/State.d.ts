import { User } from "./User";
import { WhoIs } from "./WhoIs";

export interface State {
    user: User,
    credentials?: PublicKeyCredential;
    whoIs: WhoIs;
}
