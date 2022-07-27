export class ErrorHasNoSpecialCharacters extends Error {
    private static _message: string = 'Should not have special characters.';
    constructor() {
        super(ErrorHasNoSpecialCharacters._message);
    }
}