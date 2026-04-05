import { HttpErrorResponse } from "@angular/common/http";
import { Response } from "../interfaces/response";
import { of } from "rxjs";

export function handleError(response: HttpErrorResponse) {
    const error: Response = {
        error: response.error?.errors ?? response.error,
        succeeded: response.ok,
        status: response.status
    };
    
    return of(error);
}