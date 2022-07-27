export class ErrorIsRequired extends Error {
    private static _message: 'Field is required.';
    
    constructor() {
        super(ErrorIsRequired._message);
    }
}