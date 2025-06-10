export interface ResponseObject<T> {
    code: number;
    message: string;
    data: T;
}
  