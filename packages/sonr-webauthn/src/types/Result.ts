export declare type Result<T> = {
    error?: Error;
    result: T;
    status: Status;
};

export enum Status {
    success = 0,
    notFound = 1,
    error = -1,
}