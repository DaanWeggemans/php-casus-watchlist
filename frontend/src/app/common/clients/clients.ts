import { inject, Injectable, InjectionToken } from '@angular/core';
import { LoginBody, RegisterBody } from '../interfaces/auth';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, firstValueFrom, switchMap } from 'rxjs';
import { handleError } from '../helpers/error';
import { handleResponse } from '../helpers/response';

export const API_BASE_URL = new InjectionToken<string>("");

@Injectable({ providedIn: 'root' })
export class AuthClient {
  baseUrl = inject(API_BASE_URL);
  http = inject(HttpClient);

  async csrf() {
    const url = `${this.baseUrl}/sanctum/csrf-cookie`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );
    return await firstValueFrom(request$);
  }

  async login(body: LoginBody) {
    const url = `${this.baseUrl}/login`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.post(url, body, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async register(body: RegisterBody) {
    const url = `${this.baseUrl}/register`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.post(url, body, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );
    return await firstValueFrom(request$);
  }

  async user() {
    const url = `${this.baseUrl}/user`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, null);
  }
}