export class ErrorHasAtLeastOneLowercaseCharacter extends Error {
    private static _message: 'Should have at least one lowercase character.';
    
    constructor() {
        super(ErrorHasAtLeastOneLowercaseCharacter._message);
    }
}