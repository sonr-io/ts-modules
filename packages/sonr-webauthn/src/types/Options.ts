export interface ConfigurationOptions {
    name: string;
    crossOrigin: boolean;
    rpId: string;
    useMocks?: boolean;
    registrationStartEndpoint?: string,
    registrationFinishEndpoint?: string,
    loginStartEndpoint?: string,
    loginFinishEndpoint?: string,
};