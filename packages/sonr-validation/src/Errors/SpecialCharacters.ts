export class ErrorSpecialCharacters extends Error {
    private static _message: string = "Name must be alphanumeric";
    constructor() {
        super(ErrorSpecialCharacters._message);
    }
}