export class ErrorSpecialCharacters extends Error {
    private static _message: string = "Length must be greater than three";
    constructor() {
        super(ErrorSpecialCharacters._message);
    }
}