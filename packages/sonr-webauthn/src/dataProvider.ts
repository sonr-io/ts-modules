import { ConfigurationOptions } from "./types/Options";

export class DataProvider {
    private static _instance: DataProvider;
    public static GetInstance(): DataProvider {
        if (!this._instance)
            this._instance = new DataProvider();
        return this._instance;
    }
    
    private static WithConfiguration(config: ConfigurationOptions): void {
        DataProvider._config = config;
    }

    private static _config: ConfigurationOptions;

    private constructor() {}

    public getCredentialOptions(): Promise<PublicKeyCredentialCreationOptions> {
        return new Promise(async (resolve, reject) => {
            if(DataProvider._config.useMocks)
                return  {
                    challenge: Uint8Array.from(
                        "XSASDACVDVSDFSDF", c => c.charCodeAt(0)),
                    rp: {
                        name: "Duo Security",
                        id: "duosecurity.com",
                    },
                    user: {
                        id: Uint8Array.from(
                            "UZSL85T9AFC", c => c.charCodeAt(0)),
                        name: "lee@webauthn.example",
                        displayName: "Lee",
                    },
                    pubKeyCredParams: [{alg: -7, type: "public-key"}],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                    },
                    timeout: 60000,
                    attestation: "direct"
                };
            
            try {
                if(!fetch)
                    return;
                
                // grpc client call for given endpoint as 'url' parameter
                const resp: Response = await fetch(url);

                if (resp.status < 200 || resp.status > 299)
                {
                    throw new Error(`Error while creating credential assertion: ${resp.status}`);
                }
                const reqBody = await resp.text();
                const body: any = JSON.parse(reqBody);
                return body;
            } catch(e)
            {
                console.error(`Error while creating credential options ${e.message}`);
            }
        });
    }
};