export interface ConfigurationOptions {
    name: string;
    crossOrigin: boolean;
    rpId: string;
    useMocks?: boolean;
    registrationStartEndpoint?: string,
    registrationFinishEndpoint?: string,
    loginStartEndpoint?: string,
    loginFinishEndpoint?: string,
    registrationHooks?: RegistrationHookDefinition;
    logingHooks?: AuthenticationHookDefinition;
};

export interface RegistrationHookDefinition {
    afterStart: () => void;
    afterFinish: () => void;
};

export interface AuthenticationHookDefinition {
    afterStart: () => void;
    afterFinish: () => void;
}