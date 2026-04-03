import { HttpResponse } from "@angular/common/http";
import { Response } from "../interfaces/response";
import { of } from "rxjs";

export function handleResponse<T = any>(response: HttpResponse<any>) {
    const result: Response<T> = {
        status: response.status,
        succeeded: response.ok,
        result: response.body
    };

    return of(result);
}