export class ErrorHasAtLeastOneNumber extends Error {
    private static _message: 'Should have at least one numeric character.';
    
    constructor() {
        super(ErrorHasAtLeastOneNumber._message);
    }
}