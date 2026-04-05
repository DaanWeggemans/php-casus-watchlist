import { inject, Injectable, InjectionToken } from '@angular/core';
import { LoginBody, RegisterBody } from '../interfaces/auth';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, firstValueFrom, switchMap } from 'rxjs';
import { handleError } from '../helpers/error';
import { handleResponse } from '../helpers/response';
import { FranchiseBody } from '../interfaces/franchise';

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
    const url = `${this.baseUrl}/auth/login`;
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
    const url = `${this.baseUrl}/auth/register`;
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
    const url = `${this.baseUrl}/auth/user`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async logout() {
    const url = `${this.baseUrl}/auth/logout`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.post(url, null, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }
}

@Injectable({ providedIn: 'root' })
export class WatchlistClient {
  baseUrl = inject(API_BASE_URL);
  http = inject(HttpClient);

  async getAllFranchises() {
    const url = `${this.baseUrl}/watchlist/franchises`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async getFranchise(id: string) {
    const url = `${this.baseUrl}/watchlist/franchises/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async createFranchise(body: FranchiseBody) {
    const url = `${this.baseUrl}/watchlist/franchises`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.post(url, body, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async deleteFranchise(id: string) {
    const url = `${this.baseUrl}/watchlist/franchises/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.delete(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async editFranchise(id: string, body: any) {
    const url = `${this.baseUrl}/watchlist/franchises/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.put(url, body, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }
}