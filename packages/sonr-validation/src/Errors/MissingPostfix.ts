export class ErrorMissingPostfix extends Error {
    private static _message: string = "Display name must contain .snr";

    constructor() {
        super(ErrorMissingPostfix._message);
    }
}