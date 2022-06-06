export class ErrorInvalidLength extends Error {
    private static _message: string = "Length must be greater than three";
    constructor() {
        super(ErrorInvalidLength._message);
    }
}