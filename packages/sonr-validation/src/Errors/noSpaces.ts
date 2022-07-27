export class ErrorNoSpaces extends Error {
    private static _message: 'Field must not contain spaces.';
    
    constructor() {
        super(ErrorNoSpaces._message);
    }
}