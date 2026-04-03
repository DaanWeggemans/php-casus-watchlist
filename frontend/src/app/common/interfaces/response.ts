export interface Response<T = any> {
    succeeded: boolean;
    status: number;
    error?: any;
    result?: T;
}