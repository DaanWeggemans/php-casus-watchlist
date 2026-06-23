import { inject, Injectable, InjectionToken } from '@angular/core';
import { LoginBody, RegisterBody } from '../interfaces/auth';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, firstValueFrom, switchMap } from 'rxjs';
import { handleError } from '../helpers/error';
import { handleResponse } from '../helpers/response';
import { CreateFranchiseRequest, EditFranchiseRequest, Franchise } from '../interfaces/franchise';
import { CreateSerieRequest, EditSerieRequest, Serie } from '../interfaces/serie';
import { CreateEpisodeRequest, EditEpisodeRequest, Episode } from '../interfaces/episode';
import { Feeds } from '../interfaces/feed';

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
export class FranchiseClient {
  baseUrl = inject(API_BASE_URL);
  http = inject(HttpClient);

  async getAllFranchises() {
    const url = `${this.baseUrl}/franchises`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse<Franchise[]>(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async getFranchise(id: string) {
    const url = `${this.baseUrl}/franchises/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async createFranchise(body: CreateFranchiseRequest) {
    const url = `${this.baseUrl}/franchises`;
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
    const url = `${this.baseUrl}/franchises/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.delete(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async editFranchise(id: string, body: EditFranchiseRequest) {
    const url = `${this.baseUrl}/franchises/${id}`;
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

@Injectable({ providedIn: 'root' })
export class SerieClient {
  baseUrl = inject(API_BASE_URL);
  http = inject(HttpClient);

  async getAllSeries() {
    const url = `${this.baseUrl}/series`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse<Serie[]>(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async getAllSeriesFromFranchise(id: string) {
    const url = `${this.baseUrl}/series/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse<Serie[]>(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async createSerie(body: CreateSerieRequest) {
    const url = `${this.baseUrl}/series`;
    const options: any = {
      observe: 'response'
    };

    const formData = new FormData();
    formData.append('name', body.name);
    formData.append('type', body.type);
    formData.append('done', body.done ? "1" : "0");
    if (body.season != null)
      formData.append('season', body.season.toString());
    if (body.image != null)
      formData.append('image', body.image, body.image.name);
    formData.append('franchise_id', body.franchise_id);

    const request$ = this.http.post(url, formData, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async deleteSerie(id: string) {
    const url = `${this.baseUrl}/series/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.delete(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async editSerie(id: string, body: EditSerieRequest) {
    const url = `${this.baseUrl}/series/${id}`;
    const options: any = {
      observe: 'response'
    };

    const formData = new FormData();
    formData.append("_method", "PUT");

    if (body.name !== undefined)
      formData.append('name', body.name);
    if (body.done !== undefined)
      formData.append('done', body.done ? "1" : "0");
    if (body.season !== undefined)
      formData.append('season', body.season.toString());
    if (body.image)
      formData.append('image', body.image, body.image.name);
    if (body.image === null)
      formData.append('image', "");
    if (body.index && body.franchise_id) {
      formData.append('index', body.index.toString());
      formData.append('franchise_id', body.franchise_id);
    }

    const request$ = this.http.post(url, formData, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }
}

@Injectable({ providedIn: 'root' })
export class EpisodeClient {
  baseUrl = inject(API_BASE_URL);
  http = inject(HttpClient);

  async getAllEpisodes() {
    const url = `${this.baseUrl}/episodes`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse<Episode[]>(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async getAllEpisodesFromSerie(id: string) {
    const url = `${this.baseUrl}/episodes/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => handleResponse<Episode[]>(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async createEpisodes(body: CreateEpisodeRequest) {
    const url = `${this.baseUrl}/episodes`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.post(url, body, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async deleteEpisode(id: string) {
    const url = `${this.baseUrl}/episodes/${id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.delete(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async editEpisode(id: string, body: EditEpisodeRequest) {
    const url = `${this.baseUrl}/episodes/${id}`;
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

@Injectable({ providedIn: 'root' })
export class FeedClient {
  baseUrl = inject(API_BASE_URL);
  http = inject(HttpClient);

  async getFeed() {
    const url = `${this.baseUrl}/feed`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => {
        response.body = response.body.map((x: Feeds) => {
          x.shared_on = new Date(x.shared_on);
          return x;
        });
        return handleResponse<Feeds[]>(response);
      }),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async getFollowedFeed() {
    const url = `${this.baseUrl}/feed/followed`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.get(url, options).pipe(
      switchMap((response: any) => {
        response.body = response.body.map((x: Feeds) => {
          x.shared_on = new Date(x.shared_on);
          return x;
        });
        return handleResponse<Feeds[]>(response);
      }),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async createFeed(serie_id: string) {
    const url = `${this.baseUrl}/feed`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.post(url, { serie_id }, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async createFollowed(followed_user_id: string) {
    const url = `${this.baseUrl}/feed/followed`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.post(url, { followed_user_id }, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async removeFeed(serie_id: string) {
    const url = `${this.baseUrl}/feed/${serie_id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.delete(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }

  async removeFollowed(user_id: string) {
    const url = `${this.baseUrl}/feed/followed/${user_id}`;
    const options: any = {
      observe: 'response'
    };

    const request$ = this.http.delete(url, options).pipe(
      switchMap((response: any) => handleResponse(response)),
      catchError((error: HttpErrorResponse) => handleError(error))
    );

    return await firstValueFrom(request$);
  }
}