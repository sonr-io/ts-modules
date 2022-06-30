export interface ConfigurationOptions {
    name: string;
    deviceLabel: string,
    crossOrigin: boolean;
    rpId: string;
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