import { response } from "express";
import { ConfigurationOptions } from "./types/Options";

export class FetchProvider {
    private static _instance: FetchProvider;
    public static GetInstance(config: ConfigurationOptions): FetchProvider {
        if (!this._instance)
            this._instance = new FetchProvider(config);
        return this._instance;
    }
    
    private _config: ConfigurationOptions;

    private constructor(config: ConfigurationOptions) {
        this._config = config;
    }

    public getFetchProvider(url: string, info: RequestInfo): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if(this._config.useMocks)
                return {}
            
            try {
                if(!fetch)
                    return;
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