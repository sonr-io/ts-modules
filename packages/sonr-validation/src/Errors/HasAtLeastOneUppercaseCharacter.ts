export class ErrorHasAtLeastOneUppercaseCharacter extends Error {
    private static _message: string = 'Should have at least one uppercase character.';
    constructor() {
        super(ErrorHasAtLeastOneUppercaseCharacter._message);
    }
}