import { getCredentials } from "./credentials";
import { Result, Status } from "./types/Result";
import { ConfigurationOptions } from "./types/Options";
import { startLogin, finishLogin } from "./webauthn";

/**
 * 
 * @param options configuration object for webAuthentication options
 * @returns boolean indicating status of authentication operation
 */
export async function startUserLogin(options: ConfigurationOptions): Promise<boolean> {
    if (!options)
        throw Error("No Configuration options provided, aborting");

    return new Promise(async (resolve, reject) => {
        try
        {
            const credential: Credential = await startLogin(options.name);
            const newCredential: Credential | void = await getCredentials(credential as unknown as PublicKeyCredentialCreationOptions);
            console.info(`Credentials created for ${options.name}`);
            console.log(JSON.stringify(newCredential));
            const result: Result<PublicKeyCredential> = await finishLogin({ credential: newCredential as PublicKeyCredential });
            if (result.status === Status.success)
                resolve(true);
            else
                resolve(false);
        } catch(e)
        {
            reject();
        }
    });
}