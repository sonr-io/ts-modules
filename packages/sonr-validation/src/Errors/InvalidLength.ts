export class ErrorInvalidLength extends Error {
    private static _message: (length: number) => string = (length: number) => `Length must be greater than ${length}`;
    constructor(size: number) {
        super(ErrorInvalidLength._message(size));
    }
}