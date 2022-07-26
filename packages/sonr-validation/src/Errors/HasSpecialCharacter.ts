export class ErrorHasSpecialCharacter extends Error {
    private static _message: 'Should have at least one special character.';
    
    constructor() {
        super(ErrorHasSpecialCharacter._message);
    }
}