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
    start: () => void;
    finish: () => void;
};

export interface AuthenticationHookDefinition {
    start: () => void;
    finish: () => void;
}